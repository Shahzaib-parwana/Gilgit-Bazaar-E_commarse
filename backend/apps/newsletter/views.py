from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail, EmailMessage
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.utils import timezone
from .models import NewsletterSubscriber, NewsletterEmail
from .serializers import (
    NewsletterSubscriberSerializer, 
    NewsletterSubscribeSerializer,
    NewsletterUnsubscribeSerializer,
    NewsletterEmailSerializer,
    BulkEmailSerializer
)

@api_view(['POST'])
@permission_classes([AllowAny])
def subscribe_newsletter(request):
    """Subscribe to newsletter with email verification"""
    serializer = NewsletterSubscribeSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(
            {'error': serializer.errors.get('email', ['Invalid data'])[0]},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    email = serializer.validated_data['email']
    
    # Check if subscriber exists but inactive
    try:
        subscriber = NewsletterSubscriber.objects.get(email=email)
        if not subscriber.is_active:
            # Reactivate
            subscriber.is_active = True
            subscriber.is_verified = False  # Need reverification
            subscriber.unsubscribed_at = None
            subscriber.save()
        else:
            return Response(
                {'error': 'Email already subscribed and verified'},
                status=status.HTTP_400_BAD_REQUEST
            )
    except NewsletterSubscriber.DoesNotExist:
        # Create new subscriber
        subscriber = NewsletterSubscriber.objects.create(
            email=email,
            is_active=True,
            is_verified=False
        )
    
    # Send verification email
    verification_url = f"http://localhost:3000/verify-newsletter/{subscriber.verification_token}"
    
    html_message = render_to_string('newsletter_verification_email.html', {
        'email': email,
        'verification_url': verification_url,
        'site_name': 'Gilgit Bazaar'
    })
    
    plain_message = strip_tags(html_message)
    
    try:
        send_mail(
            'Verify Your Newsletter Subscription - Gilgit Bazaar',
            plain_message,
            settings.DEFAULT_FROM_EMAIL,
            [email],
            html_message=html_message,
            fail_silently=False,
        )
        
        return Response({
            'success': True,
            'message': 'Verification email sent! Please check your inbox.'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Failed to send verification email: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def verify_newsletter(request, token):
    """Verify newsletter subscription"""
    try:
        subscriber = NewsletterSubscriber.objects.get(verification_token=token)
        subscriber.is_verified = True
        subscriber.is_active = True
        subscriber.save()
        
        return Response({
            'success': True,
            'message': 'Email verified successfully! You will now receive our newsletters.'
        }, status=status.HTTP_200_OK)
        
    except NewsletterSubscriber.DoesNotExist:
        return Response({
            'error': 'Invalid or expired verification token'
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def unsubscribe_newsletter(request):
    """Unsubscribe from newsletter"""
    serializer = NewsletterUnsubscribeSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(
            {'error': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    email = serializer.validated_data['email']
    
    try:
        subscriber = NewsletterSubscriber.objects.get(email=email)
        subscriber.unsubscribe()
        
        return Response({
            'success': True,
            'message': 'You have been unsubscribed successfully.'
        }, status=status.HTTP_200_OK)
        
    except NewsletterSubscriber.DoesNotExist:
        return Response({
            'error': 'Email not found in our subscription list.'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_subscribers(request):
    """Get all subscribers (Admin only)"""
    subscribers = NewsletterSubscriber.objects.all()
    serializer = NewsletterSubscriberSerializer(subscribers, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def send_bulk_email(request):
    """Send bulk email to all verified subscribers (Admin only)"""
    serializer = BulkEmailSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(
            {'error': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    subject = serializer.validated_data['subject']
    message = serializer.validated_data['message']
    
    # Save to database
    newsletter = NewsletterEmail.objects.create(
        subject=subject,
        message=message,
        status='sent'
    )
    
    # Get all active and verified subscribers
    subscribers = NewsletterSubscriber.objects.filter(is_active=True, is_verified=True)
    recipient_list = [sub.email for sub in subscribers]
    
    if not recipient_list:
        return Response({
            'error': 'No active subscribers found.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    newsletter.recipients_count = len(recipient_list)
    
    try:
        # Create email with HTML support
        email = EmailMessage(
            subject=subject,
            body=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[],  # Empty to list
            bcc=recipient_list,  # Use BCC to hide recipients
        )
        email.content_subtype = "html"  # Send as HTML
        
        # Send email
        sent_count = email.send()
        
        newsletter.success_count = sent_count
        newsletter.failed_count = len(recipient_list) - sent_count
        newsletter.sent_at = timezone.now()
        newsletter.save()
        
        return Response({
            'success': True,
            'message': f'Email sent to {sent_count} out of {len(recipient_list)} subscribers',
            'sent_count': sent_count,
            'total': len(recipient_list)
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        newsletter.status = 'failed'
        newsletter.save()
        return Response({
            'error': f'Failed to send emails: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_newsletter_stats(request):
    """Get newsletter statistics (Admin only)"""
    total_subscribers = NewsletterSubscriber.objects.count()
    active_subscribers = NewsletterSubscriber.objects.filter(is_active=True, is_verified=True).count()
    unverified_subscribers = NewsletterSubscriber.objects.filter(is_verified=False).count()
    
    recent_emails = NewsletterEmail.objects.all()[:5]
    email_serializer = NewsletterEmailSerializer(recent_emails, many=True)
    
    return Response({
        'total_subscribers': total_subscribers,
        'active_subscribers': active_subscribers,
        'unverified_subscribers': unverified_subscribers,
        'recent_emails': email_serializer.data
    })