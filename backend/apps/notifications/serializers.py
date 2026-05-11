from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    EmailTemplate, 
    Notification, 
    EmailCampaign,
    EmailLog
)

User = get_user_model()


class EmailTemplateSerializer(serializers.ModelSerializer):
    """Serializer for email templates"""
    
    class Meta:
        model = EmailTemplate
        fields = [
            'id', 'name', 'template_type', 'subject',
            'html_content', 'text_content', 'available_variables',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for notifications"""
    
    notification_type_display = serializers.CharField(
        source='get_notification_type_display',
        read_only=True
    )
    
    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'notification_type', 'notification_type_display',
            'title', 'message', 'link', 'metadata',
            'is_read', 'created_at', 'read_at'
        ]
        read_only_fields = ['created_at', 'read_at']


class NotificationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating notifications"""
    
    class Meta:
        model = Notification
        fields = [
            'user', 'notification_type', 'title', 
            'message', 'link', 'metadata'
        ]


class UserBasicSerializer(serializers.ModelSerializer):
    """Basic user serializer for campaign audience"""
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name']


class EmailCampaignSerializer(serializers.ModelSerializer):
    """Serializer for email campaigns"""
    
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )
    target_audience_display = serializers.CharField(
        source='get_target_audience_display',
        read_only=True
    )
    template_name = serializers.CharField(
        source='email_template.name',
        read_only=True
    )
    
    class Meta:
        model = EmailCampaign
        fields = [
            'id', 'name', 'email_template', 'template_name',
            'subject', 'target_audience', 'target_audience_display',
            'status', 'status_display', 'scheduled_at', 'sent_at',
            'total_recipients', 'emails_sent', 'emails_failed',
            'emails_opened', 'emails_clicked',
            'created_by', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'status', 'sent_at', 'total_recipients',
            'emails_sent', 'emails_failed', 'emails_opened',
            'emails_clicked', 'created_at', 'updated_at'
        ]


class EmailCampaignCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating email campaigns"""
    
    selected_user_emails = serializers.ListField(
        child=serializers.EmailField(),
        required=False,
        write_only=True
    )
    
    class Meta:
        model = EmailCampaign
        fields = [
            'name', 'email_template', 'subject',
            'target_audience', 'selected_user_emails', 'scheduled_at'
        ]
    
    def create(self, validated_data):
        selected_emails = validated_data.pop('selected_user_emails', [])
        request = self.context.get('request')
        
        campaign = EmailCampaign.objects.create(
            **validated_data,
            created_by=request.user if request else None
        )
        
        # Add selected users if custom audience
        if selected_emails:
            users = User.objects.filter(email__in=selected_emails)
            campaign.selected_users.set(users)
        
        return campaign


class EmailLogSerializer(serializers.ModelSerializer):
    """Serializer for email logs"""
    
    user_email = serializers.CharField(source='user.email', read_only=True)
    campaign_name = serializers.CharField(source='campaign.name', read_only=True)
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )
    
    class Meta:
        model = EmailLog
        fields = [
            'id', 'campaign', 'campaign_name', 'user', 'user_email',
            'email_type', 'subject', 'status', 'status_display',
            'error_message', 'sent_at', 'opened_at', 'clicked_at',
            'tracking_id'
        ]
        read_only_fields = [
            'sent_at', 'opened_at', 'clicked_at', 'tracking_id'
        ]


class SendEmailSerializer(serializers.Serializer):
    """Serializer for sending individual emails"""
    
    recipient_email = serializers.EmailField()
    template_type = serializers.ChoiceField(choices=EmailTemplate.TEMPLATE_TYPES)
    context_data = serializers.JSONField(required=False, default=dict)
    
    def validate_template_type(self, value):
        """Ensure template exists for this type"""
        if not EmailTemplate.objects.filter(template_type=value, is_active=True).exists():
            raise serializers.ValidationError(
                f"No active template found for type: {value}"
            )
        return value


class BulkNotificationSerializer(serializers.Serializer):
    """Serializer for sending bulk notifications"""
    
    TARGET_CHOICES = [
        ('all', 'All Users'),
        ('active', 'Active Customers'),
        ('new', 'New Users'),
        ('custom', 'Custom Selection'),
    ]
    
    notification_type = serializers.ChoiceField(choices=Notification.NOTIFICATION_TYPES)
    title = serializers.CharField(max_length=200)
    message = serializers.CharField()  # Fixed: Changed from TextField to CharField
    link = serializers.CharField(max_length=500, required=False, allow_blank=True)
    target = serializers.ChoiceField(choices=TARGET_CHOICES)
    user_emails = serializers.ListField(
        child=serializers.EmailField(),
        required=False
    )
    
    def validate(self, data):
        """Validate that user_emails is provided for custom target"""
        if data['target'] == 'custom' and not data.get('user_emails'):
            raise serializers.ValidationError({
                'user_emails': 'Required when target is custom'
            })
        return data