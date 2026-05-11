from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db.models import Q, Count
from datetime import timedelta


from .models import (
    EmailTemplate,
    Notification,
    EmailCampaign,
    EmailLog
)
from .serializers import (
    EmailTemplateSerializer,
    NotificationSerializer,
    NotificationCreateSerializer,
    EmailCampaignSerializer,
    EmailCampaignCreateSerializer,
    EmailLogSerializer,
    SendEmailSerializer,
    BulkNotificationSerializer
)
from .tasks import (
    send_email_via_template_task,
    send_campaign_emails_task,
    send_bulk_notifications_task,
    send_welcome_email,
    send_order_confirmation_email,
    check_scheduled_campaigns,
    clean_old_notifications,
    send_abandoned_cart_emails,
)

User = get_user_model()


class EmailTemplateViewSet(viewsets.ModelViewSet):
    """ViewSet for managing email templates"""
    
    queryset = EmailTemplate.objects.all()
    serializer_class = EmailTemplateSerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by template type
        template_type = self.request.query_params.get('type', None)
        if template_type:
            queryset = queryset.filter(template_type=template_type)
        
        # Filter by active status
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def preview(self, request, pk=None):
        """Preview email template with sample data"""
        template = self.get_object()
        context_data = request.data.get('context_data', {})
        
        # Render template with context
        from django.template import Template, Context
        
        html_template = Template(template.html_content)
        html_rendered = html_template.render(Context(context_data))
        
        return Response({
            'subject': template.subject,
            'html_content': html_rendered
        })
    
    @action(detail=True, methods=['post'])
    def test_send(self, request, pk=None):
        """Send test email to current user"""
        template = self.get_object()
        
        result = send_email_via_template_task.delay(
            user_email=request.user.email,
            template_type=template.template_type,
            context_data={
                'user_name': request.user.get_full_name() or request.user.email,
                'user_email': request.user.email,
            }
        )
        
        return Response({
            'status': 'Test email queued for sending',
            'task_id': result.id
        })


class NotificationViewSet(viewsets.ModelViewSet):
    """ViewSet for managing notifications"""
    
    queryset = Notification.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return NotificationCreateSerializer
        return NotificationSerializer
    
    def get_queryset(self):
        user = self.request.user
        
        # Staff can see all, users see only their own
        if user.is_staff:
            queryset = Notification.objects.all()
            
            # Filter by user if specified
            user_id = self.request.query_params.get('user', None)
            if user_id:
                queryset = queryset.filter(user_id=user_id)
        else:
            queryset = Notification.objects.filter(user=user)
        
        # Filter by read status
        is_read = self.request.query_params.get('is_read', None)
        if is_read is not None:
            queryset = queryset.filter(is_read=is_read.lower() == 'true')
        
        # Filter by type
        notification_type = self.request.query_params.get('type', None)
        if notification_type:
            queryset = queryset.filter(notification_type=notification_type)
        
        return queryset
    
    # FIX: Add url_path parameter with hyphen instead of underscore
    @action(detail=False, methods=['get'], url_path='unread-count', url_name='unread-count')
    def unread_count(self, request):
        """Get count of unread notifications"""
        count = Notification.objects.filter(
            user=request.user,
            is_read=False
        ).count()
        
        return Response({'unread_count': count})
    
    @action(detail=True, methods=['post'], url_path='mark-read', url_name='mark-read')
    def mark_read(self, request, pk=None):
        """Mark notification as read"""
        notification = self.get_object()
        
        # Only allow marking own notifications
        if notification.user != request.user and not request.user.is_staff:
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        notification.mark_as_read()
        
        return Response({'status': 'marked as read'})
    
    @action(detail=False, methods=['post'], url_path='mark-all-read', url_name='mark-all-read')
    def mark_all_read(self, request):
        """Mark all notifications as read for current user"""
        Notification.objects.filter(
            user=request.user,
            is_read=False
        ).update(is_read=True, read_at=timezone.now())
        
        return Response({'status': 'all notifications marked as read'})
    
    @action(detail=False, methods=['post'], permission_classes=[IsAdminUser], url_path='send-bulk', url_name='send-bulk')
    def send_bulk(self, request):
        """Send bulk notifications to multiple users"""
        serializer = BulkNotificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        
        # Send via Celery task
        send_bulk_notifications_task.delay(
            notification_type=data['notification_type'],
            title=data['title'],
            message=data['message'],
            link=data.get('link', ''),
            target=data['target'],
            user_emails=data.get('user_emails', [])
        )
        
        return Response({
            'status': 'Bulk notifications queued for sending'
        })

class EmailCampaignViewSet(viewsets.ModelViewSet):
    """ViewSet for managing email campaigns"""
    
    queryset = EmailCampaign.objects.all()
    permission_classes = [IsAdminUser]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return EmailCampaignCreateSerializer
        return EmailCampaignSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by status
        campaign_status = self.request.query_params.get('status', None)
        if campaign_status:
            queryset = queryset.filter(status=campaign_status)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def send_now(self, request, pk=None):
        """Send campaign immediately"""
        campaign = self.get_object()
        
        if campaign.status == 'sent':
            return Response(
                {'error': 'Campaign already sent'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Queue campaign for sending
        campaign.status = 'sending'
        campaign.save()
        
        send_campaign_emails_task.delay(campaign.id)
        
        return Response({
            'status': 'Campaign queued for sending'
        })
    
    @action(detail=True, methods=['post'])
    def schedule(self, request, pk=None):
        """Schedule campaign for later"""
        campaign = self.get_object()
        scheduled_at = request.data.get('scheduled_at')
        
        if not scheduled_at:
            return Response(
                {'error': 'scheduled_at is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        campaign.scheduled_at = scheduled_at
        campaign.status = 'scheduled'
        campaign.save()
        
        return Response({
            'status': 'Campaign scheduled',
            'scheduled_at': scheduled_at
        })
    
    @action(detail=True, methods=['get'])
    def stats(self, request, pk=None):
        """Get campaign statistics"""
        campaign = self.get_object()
        
        stats = {
            'total_recipients': campaign.total_recipients,
            'emails_sent': campaign.emails_sent,
            'emails_failed': campaign.emails_failed,
            'emails_opened': campaign.emails_opened,
            'emails_clicked': campaign.emails_clicked,
            'open_rate': (campaign.emails_opened / campaign.emails_sent * 100) if campaign.emails_sent > 0 else 0,
            'click_rate': (campaign.emails_clicked / campaign.emails_sent * 100) if campaign.emails_sent > 0 else 0,
        }
        
        return Response(stats)
    
    @action(detail=True, methods=['post'])
    def duplicate(self, request, pk=None):
        """Duplicate a campaign"""
        original = self.get_object()
        
        # Create copy
        copied = EmailCampaign.objects.create(
            name=f"{original.name} (Copy)",
            email_template=original.email_template,
            subject=original.subject,
            target_audience=original.target_audience,
            status='draft',
            created_by=request.user
        )
        
        # Copy selected users if custom audience
        if original.target_audience == 'custom':
            copied.selected_users.set(original.selected_users.all())
        
        serializer = self.get_serializer(copied)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class EmailLogViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing email logs"""
    
    queryset = EmailLog.objects.all()
    serializer_class = EmailLogSerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by campaign
        campaign_id = self.request.query_params.get('campaign', None)
        if campaign_id:
            queryset = queryset.filter(campaign_id=campaign_id)
        
        # Filter by status
        email_status = self.request.query_params.get('status', None)
        if email_status:
            queryset = queryset.filter(status=email_status)
        
        # Filter by user
        user_id = self.request.query_params.get('user', None)
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get overall email statistics"""
        total = EmailLog.objects.count()
        
        stats = {
            'total_emails': total,
            'sent': EmailLog.objects.filter(status='sent').count(),
            'failed': EmailLog.objects.filter(status='failed').count(),
            'opened': EmailLog.objects.filter(status='opened').count(),
            'clicked': EmailLog.objects.filter(status='clicked').count(),
            'bounced': EmailLog.objects.filter(status='bounced').count(),
        }
        
        return Response(stats)


# Optional: View to send a test email
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_test_email(request):
    """Send a test email to the current user"""
    serializer = SendEmailSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    data = serializer.validated_data
    
    result = send_email_via_template_task.delay(
        user_email=request.user.email,
        template_type=data['template_type'],
        context_data=data.get('context_data', {})
    )
    
    return Response({
        'status': 'Test email queued for sending',
        'task_id': result.id
    })
    
    
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def unread_notification_count(request):
    """Get unread notification count for current user"""
    try:
        count = Notification.objects.filter(
            user=request.user,
            is_read=False
        ).count()
        return Response({'unread_count': count})
    except Exception as e:
        return Response({'unread_count': 0, 'error': str(e)})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_all_notifications_read(request):
    """Mark all notifications as read for current user"""
    try:
        updated_count = Notification.objects.filter(
            user=request.user,
            is_read=False
        ).update(is_read=True, read_at=timezone.now())
        return Response({
            'status': 'success',
            'message': f'{updated_count} notifications marked as read'
        })
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=500)  
        
        
      