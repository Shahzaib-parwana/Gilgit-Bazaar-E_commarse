from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone

User = get_user_model()


class EmailTemplate(models.Model):
    """Email templates for automated and manual campaigns"""
    
    TEMPLATE_TYPES = [
        ('welcome', 'Welcome Email'),
        ('order_confirmation', 'Order Confirmation'),
        ('order_shipped', 'Order Shipped'),
        ('order_delivered', 'Order Delivered'),
        ('password_reset', 'Password Reset'),
        ('promotional', 'Promotional'),
        ('abandoned_cart', 'Abandoned Cart'),
        ('newsletter', 'Newsletter'),
        ('custom', 'Custom'),
    ]
    
    name = models.CharField(max_length=200)
    template_type = models.CharField(max_length=50, choices=TEMPLATE_TYPES)
    subject = models.CharField(max_length=200)
    
    # Email content - supports both HTML and plain text
    html_content = models.TextField(help_text="HTML version of email")
    text_content = models.TextField(blank=True, help_text="Plain text fallback")
    
    # Dynamic variables that can be used in template
    # Example: {{user_name}}, {{order_number}}, {{product_name}}
    available_variables = models.JSONField(
        default=dict,
        help_text="Variables available for this template"
    )
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'email_templates'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.get_template_type_display()})"


class Notification(models.Model):
    """In-app notifications for users"""
    
    NOTIFICATION_TYPES = [
        ('order', 'Order Update'),
        ('promo', 'Promotion'),
        ('system', 'System'),
        ('product', 'Product'),
        ('account', 'Account'),
    ]
    
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='notifications'
    )
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    
    # Optional link to redirect when clicked
    link = models.CharField(max_length=500, blank=True, null=True)
    
    # Metadata for additional info
    metadata = models.JSONField(default=dict, blank=True)
    
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['user', 'is_read']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.title}"
    
    def mark_as_read(self):
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save()


class EmailCampaign(models.Model):
    """Email campaigns to send bulk emails"""
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('scheduled', 'Scheduled'),
        ('sending', 'Sending'),
        ('sent', 'Sent'),
        ('failed', 'Failed'),
    ]
    
    TARGET_AUDIENCE = [
        ('all', 'All Users'),
        ('active', 'Active Customers'),
        ('inactive', 'Inactive Customers'),
        ('new', 'New Users (Last 30 Days)'),
        ('custom', 'Custom Selection'),
    ]
    
    name = models.CharField(max_length=200)
    email_template = models.ForeignKey(
        EmailTemplate,
        on_delete=models.SET_NULL,
        null=True,
        related_name='campaigns'
    )
    
    subject = models.CharField(max_length=200)
    target_audience = models.CharField(max_length=20, choices=TARGET_AUDIENCE)
    
    # For custom audience selection
    selected_users = models.ManyToManyField(
        User,
        blank=True,
        related_name='email_campaigns'
    )
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    scheduled_at = models.DateTimeField(null=True, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    
    # Statistics
    total_recipients = models.IntegerField(default=0)
    emails_sent = models.IntegerField(default=0)
    emails_failed = models.IntegerField(default=0)
    emails_opened = models.IntegerField(default=0)
    emails_clicked = models.IntegerField(default=0)
    
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_campaigns'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'email_campaigns'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.get_status_display()}"


class EmailLog(models.Model):
    """Log all sent emails for tracking"""
    
    STATUS_CHOICES = [
        ('sent', 'Sent'),
        ('failed', 'Failed'),
        ('opened', 'Opened'),
        ('clicked', 'Clicked'),
        ('bounced', 'Bounced'),
    ]
    
    campaign = models.ForeignKey(
        EmailCampaign,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='logs'
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    email_type = models.CharField(max_length=50)  # welcome, order_confirmation, etc.
    subject = models.CharField(max_length=200)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='sent')
    error_message = models.TextField(blank=True)
    
    sent_at = models.DateTimeField(auto_now_add=True)
    opened_at = models.DateTimeField(null=True, blank=True)
    clicked_at = models.DateTimeField(null=True, blank=True)
    
    # Tracking pixel and link tracking
    tracking_id = models.UUIDField(unique=True, editable=False)
    
    class Meta:
        db_table = 'email_logs'
        ordering = ['-sent_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.email_type} - {self.status}"