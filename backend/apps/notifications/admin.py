from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from django.urls import reverse
from django.utils import timezone
from django.shortcuts import render, redirect
from django.urls import path
from django.contrib import messages
from django.template.response import TemplateResponse
from django import forms
from .models import (
    EmailTemplate,
    Notification,
    EmailCampaign,
    EmailLog
)
from .tasks import send_campaign_emails_task, send_bulk_notifications_task


# ═══════════════════════════════════════════
#  EMAIL CAMPAIGN FORM WITH RICH TEXT EDITOR
# ═══════════════════════════════════════════

class EmailCampaignAdminForm(forms.ModelForm):
    """Custom form for email campaigns with rich editor"""
    
    # Add HTML content field for quick composition
    custom_html_content = forms.CharField(
        widget=forms.Textarea(attrs={
            'rows': 20,
            'style': 'width: 100%; font-family: monospace;'
        }),
        required=False,
        help_text='Custom HTML content (optional - overrides template)',
        label='Email HTML Content'
    )
    
    # Checkbox to send immediately
    send_immediately = forms.BooleanField(
        required=False,
        initial=False,
        help_text='Send this campaign immediately after saving',
        label='📧 Send Immediately to All Recipients'
    )
    
    # Checkbox to also create in-app notifications
    create_notifications = forms.BooleanField(
        required=False,
        initial=True,
        help_text='Also create in-app notifications for users',
        label='🔔 Create In-App Notifications'
    )
    
    notification_title = forms.CharField(
        max_length=200,
        required=False,
        help_text='Title for in-app notification',
        label='Notification Title'
    )
    
    notification_message = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 3}),
        required=False,
        help_text='Message for in-app notification',
        label='Notification Message'
    )
    
    class Meta:
        model = EmailCampaign
        fields = '__all__'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Pre-populate HTML if template is selected
        if self.instance and self.instance.email_template:
            self.fields['custom_html_content'].initial = self.instance.email_template.html_content


@admin.register(EmailCampaign)
class EmailCampaignAdmin(admin.ModelAdmin):
    """Enhanced admin for Email Campaigns with immediate sending"""
    
    form = EmailCampaignAdminForm
    
    list_display = [
        'name',
        'template_link',
        'target_audience',
        'status_badge',
        'stats_display',
        'scheduled_at',
        'created_at',
        'quick_actions'
    ]
    list_filter = ['status', 'target_audience', 'created_at']
    search_fields = ['name', 'subject']
    readonly_fields = [
        'total_recipients', 'emails_sent', 'emails_failed',
        'emails_opened', 'emails_clicked', 'sent_at',
        'created_at', 'updated_at', 'preview_button'
    ]
    filter_horizontal = ['selected_users']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('📧 Campaign Details', {
            'fields': ('name', 'email_template', 'subject', 'target_audience'),
            'description': 'Basic campaign information'
        }),
        ('✍️ Email Content (Optional - Override Template)', {
            'fields': ('custom_html_content', 'preview_button'),
            'classes': ('collapse',),
            'description': 'Write custom HTML or use the template above'
        }),
        ('👥 Recipient Selection', {
            'fields': ('selected_users',),
            'classes': ('collapse',),
            'description': 'Only for "Custom Selection" target audience'
        }),
        ('🔔 In-App Notifications', {
            'fields': (
                'create_notifications',
                'notification_title',
                'notification_message'
            ),
            'classes': ('collapse',),
            'description': 'Create matching in-app notifications for users'
        }),
        ('⚡ Sending Options', {
            'fields': ('send_immediately', 'scheduled_at'),
            'description': 'Choose when to send this campaign'
        }),
        ('📊 Campaign Status', {
            'fields': ('status', 'sent_at'),
            'classes': ('collapse',)
        }),
        ('📈 Statistics', {
            'fields': (
                'total_recipients', 'emails_sent', 'emails_failed',
                'emails_opened', 'emails_clicked'
            ),
            'classes': ('collapse',)
        }),
        ('ℹ️ Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def preview_button(self, obj):
        if obj and obj.email_template:
            return format_html(
                '<a href="#" onclick="window.open(\'/admin/preview-email/{}/\', \'_blank\', \'width=800,height=600\'); return false;" '
                'style="background:#f0a500;color:#000;padding:8px 16px;border-radius:8px;text-decoration:none;'
                'font-weight:600;display:inline-block;">👁️ Preview Email</a>',
                obj.id
            )
        return 'Save first to preview'
    preview_button.short_description = 'Email Preview'
    
    def save_model(self, request, obj, form, change):
        # Set created_by
        if not change:
            obj.created_by = request.user
        
        # Save custom HTML to template if provided
        custom_html = form.cleaned_data.get('custom_html_content')
        if custom_html and obj.email_template:
            obj.email_template.html_content = custom_html
            obj.email_template.save()
        
        super().save_model(request, obj, form, change)
        
        # Create in-app notifications if requested
        if form.cleaned_data.get('create_notifications'):
            notification_title = form.cleaned_data.get('notification_title') or obj.subject
            notification_message = form.cleaned_data.get('notification_message') or 'Check your email for details'
            
            # Determine notification type based on campaign
            notification_type = 'promo'
            if 'order' in obj.name.lower():
                notification_type = 'order'
            elif 'product' in obj.name.lower():
                notification_type = 'product'
            
            # Send via task
            send_bulk_notifications_task.delay(
                notification_type=notification_type,
                title=notification_title,
                message=notification_message,
                link='',
                target=obj.target_audience,
                user_emails=list(obj.selected_users.values_list('email', flat=True)) if obj.target_audience == 'custom' else []
            )
            
            messages.success(request, f'✅ In-app notifications created and queued!')
        
        # Send immediately if requested
        if form.cleaned_data.get('send_immediately'):
            obj.status = 'sending'
            obj.save()
            
            # Queue for sending
            send_campaign_emails_task.delay(obj.id)
            
            messages.success(
                request, 
                f'🚀 Campaign "{obj.name}" is being sent! Emails will be delivered shortly.'
            )
        elif obj.scheduled_at and obj.status == 'draft':
            obj.status = 'scheduled'
            obj.save()
            messages.info(
                request,
                f'⏰ Campaign scheduled for {obj.scheduled_at.strftime("%B %d, %Y at %I:%M %p")}'
            )
    
    def template_link(self, obj):
        if obj.email_template:
            url = reverse('admin:notifications_emailtemplate_change', args=[obj.email_template.id])
            return format_html('<a href="{}">{}</a>', url, obj.email_template.name)
        return '-'
    template_link.short_description = 'Template'
    
    def status_badge(self, obj):
        colors = {
            'draft': '#64748b',
            'scheduled': '#f0a500',
            'sending': '#3b82f6',
            'sent': '#4ade80',
            'failed': '#ef4444',
        }
        color = colors.get(obj.status, '#64748b')
        return format_html(
            '<span style="background:{};color:#fff;padding:6px 14px;'
            'border-radius:12px;font-weight:700;font-size:11px;text-transform:uppercase;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    
    def stats_display(self, obj):
        if obj.emails_sent > 0:
            open_rate = (obj.emails_opened / obj.emails_sent * 100)
            click_rate = (obj.emails_clicked / obj.emails_sent * 100)

            return format_html(
                '<div style="font-size:11px;color:#8892aa;">'
                '📨 <strong>{}</strong> | '
                '👁️ <strong style="color:#4ade80;">{}%</strong> | '
                '🖱️ <strong style="color:#f0a500;">{}%</strong>'
                '</div>',
                obj.emails_sent,
                f"{open_rate:.1f}",   # ✅ FIXED
                f"{click_rate:.1f}"   # ✅ FIXED
            )

        return mark_safe('<span style="color:#8892aa;">Not sent yet</span>')
    stats_display.short_description = 'Performance'
    
    def quick_actions(self, obj):
        if obj.status == 'draft' or obj.status == 'scheduled':
            return format_html(
                '<a href="/admin/send-campaign/{}/" '
                'style="background:#4ade80;color:#000;padding:6px 12px;border-radius:8px;'
                'text-decoration:none;font-weight:600;font-size:11px;" '
                'onclick="return confirm(\'Send this campaign now?\')">🚀 Send Now</a>',
                obj.id
            )
        elif obj.status == 'sent':
            return mark_safe(
                '<span style="color:#4ade80;font-weight:600;">✅ Sent</span>'
            )
        return '-'
    quick_actions.short_description = 'Actions'
    
    actions = ['send_campaigns', 'mark_as_draft', 'duplicate_campaign']
    
    def send_campaigns(self, request, queryset):
        """Send selected campaigns immediately"""
        count = 0
        for campaign in queryset:
            if campaign.status in ['draft', 'scheduled']:
                campaign.status = 'sending'
                campaign.save()
                send_campaign_emails_task.delay(campaign.id)
                count += 1
        
        self.message_user(
            request, 
            f'🚀 {count} campaign(s) queued for sending!',
            messages.SUCCESS
        )
    send_campaigns.short_description = '🚀 Send Selected Campaigns Now'
    
    def mark_as_draft(self, request, queryset):
        updated = queryset.update(status='draft')
        self.message_user(request, f'📝 {updated} campaigns marked as draft.')
    mark_as_draft.short_description = '📝 Mark as Draft'
    
    def duplicate_campaign(self, request, queryset):
        """Duplicate selected campaigns"""
        for campaign in queryset:
            campaign.pk = None
            campaign.name = f"{campaign.name} (Copy)"
            campaign.status = 'draft'
            campaign.sent_at = None
            campaign.total_recipients = 0
            campaign.emails_sent = 0
            campaign.emails_failed = 0
            campaign.save()
        
        self.message_user(
            request,
            f'📋 {queryset.count()} campaign(s) duplicated!',
            messages.SUCCESS
        )
    duplicate_campaign.short_description = '📋 Duplicate Campaigns'


# ═══════════════════════════════════════════
#  EMAIL TEMPLATE ADMIN WITH QUICK PREVIEW
# ═══════════════════════════════════════════

@admin.register(EmailTemplate)
class EmailTemplateAdmin(admin.ModelAdmin):

    list_display = [
        'name',
        'template_type_badge',
        'subject',
        'is_active_badge',
        'preview_action',
        'created_at'
    ]

    readonly_fields = [
        'created_at',
        'updated_at',
        'preview_html'
    ]

    # -------------------------
    # BADGE: TEMPLATE TYPE
    # -------------------------
    def template_type_badge(self, obj):
        colors = {
            'welcome': '#4ade80',
            'order_confirmation': '#3b82f6',
            'order_shipped': '#f0a500',
            'promotional': '#f0a500',
            'newsletter': '#8b5cf6',
        }
        color = colors.get(obj.template_type, '#64748b')

        return format_html(
            '<span style="background:{};color:#fff;padding:6px 12px;border-radius:10px;">{}</span>',
            color,
            obj.get_template_type_display()
        )
    template_type_badge.short_description = 'Type'

    # -------------------------
    # BADGE: ACTIVE STATUS
    # -------------------------
    def is_active_badge(self, obj):
        if obj.is_active:
            return mark_safe(
                '<span style="background:#4ade80;color:#000;padding:6px 12px;border-radius:10px;">Active</span>'
            )
        return mark_safe(
            '<span style="background:#64748b;color:#fff;padding:6px 12px;border-radius:10px;">Inactive</span>'
        )
    is_active_badge.short_description = 'Status'

    # -------------------------
    # PREVIEW HTML (READONLY FIELD)
    # -------------------------
    def preview_html(self, obj):
        if obj.html_content:
            return format_html(
                '<div style="border:1px solid #ddd;padding:10px;">{}</div>',
                obj.html_content
            )
        return "No content"
    preview_html.short_description = "Preview"

    # -------------------------
    # PREVIEW BUTTON
    # -------------------------
    def preview_action(self, obj):
        url = reverse('admin:emailtemplate-preview', args=[obj.id])

        return format_html(
            '<a href="{}" target="_blank" style="background:#3b82f6;color:#fff;padding:6px 12px;border-radius:8px;">👁 Preview</a>',
            url
        )
        
        
    preview_action.short_description = 'Actions'
    
    def get_urls(self):
        urls = super().get_urls()

        custom_urls = [
            path(
                'preview/<int:template_id>/',
                self.admin_site.admin_view(self.preview_template_view),
                name='emailtemplate-preview',
            ),
        ]

        return custom_urls + urls
    def preview_template_view(self, request, template_id):
        template = EmailTemplate.objects.get(id=template_id)

        return TemplateResponse(
            request,
            "admin/email_preview.html",
            {
                "template": template,
                "html_content": template.html_content
            }
        )

# ═══════════════════════════════════════════
#  NOTIFICATION ADMIN
# ═══════════════════════════════════════════

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    """Admin interface for Notifications"""
    
    list_display = [
        'title', 
        'user_link', 
        'notification_type_badge', 
        'is_read_badge', 
        'created_at'
    ]
    list_filter = ['notification_type', 'is_read', 'created_at']
    search_fields = ['title', 'message', 'user__email', 'user__first_name']
    readonly_fields = ['created_at', 'read_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('🔔 Notification Details', {
            'fields': ('user', 'notification_type', 'title', 'message')
        }),
        ('🔗 Links & Metadata', {
            'fields': ('link', 'metadata'),
            'classes': ('collapse',)
        }),
        ('📊 Status', {
            'fields': ('is_read', 'read_at', 'created_at'),
            'classes': ('collapse',)
        }),
    )
    
    def user_link(self, obj):
        if obj.user:
            url = reverse('admin:accounts_user_change', args=[obj.user.id])
            return format_html('<a href="{}">{} ({})</a>', url, obj.user.get_full_name() or obj.user.email, obj.user.email)
        return '-'
    user_link.short_description = 'User'
    
    def notification_type_badge(self, obj):
        colors = {
            'order': '#3b82f6',
            'promo': '#f0a500',
            'system': '#64748b',
            'product': '#8b5cf6',
            'account': '#4ade80',
        }
        color = colors.get(obj.notification_type, '#64748b')
        return format_html(
            '<span style="background:{};color:#fff;padding:4px 10px;'
            'border-radius:10px;font-weight:600;font-size:10px;text-transform:uppercase;">{}</span>',
            color, obj.get_notification_type_display()
        )
    notification_type_badge.short_description = 'Type'
    
    def is_read_badge(self, obj):
        if obj.is_read:
            return mark_safe(
                '<span style="color:#4ade80;">✅ Read</span>'
            )
        return mark_safe(
            '<span style="color:#f0a500;">⏳ Unread</span>'
        )
    is_read_badge.short_description = 'Status'
    
    actions = ['mark_as_read', 'mark_as_unread']
    
    def mark_as_read(self, request, queryset):
        updated = queryset.filter(is_read=False).update(is_read=True, read_at=timezone.now())
        self.message_user(request, f'✅ {updated} notification(s) marked as read.')
    mark_as_read.short_description = '✅ Mark as Read'
    
    def mark_as_unread(self, request, queryset):
        updated = queryset.filter(is_read=True).update(is_read=False, read_at=None)
        self.message_user(request, f'⏳ {updated} notification(s) marked as unread.')
    mark_as_unread.short_description = '⏳ Mark as Unread'


# ═══════════════════════════════════════════
#  EMAIL LOG ADMIN (Read Only)
# ═══════════════════════════════════════════

@admin.register(EmailLog)
class EmailLogAdmin(admin.ModelAdmin):
    """Read-only admin interface for Email Logs"""
    
    list_display = [
        'user_email', 
        'email_type', 
        'status_badge', 
        'subject_truncated', 
        'sent_at'
    ]
    list_filter = ['email_type', 'status', 'sent_at']
    search_fields = ['user__email', 'subject', 'error_message']
    readonly_fields = [field.name for field in EmailLog._meta.fields]
    date_hierarchy = 'sent_at'
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'User Email'
    
    def subject_truncated(self, obj):
        if len(obj.subject) > 50:
            return obj.subject[:50] + '...'
        return obj.subject
    subject_truncated.short_description = 'Subject'
    
    def status_badge(self, obj):
        colors = {
            'sent': '#64748b',
            'failed': '#ef4444',
            'opened': '#4ade80',
            'clicked': '#f0a500',
            'bounced': '#dc2626',
        }
        color = colors.get(obj.status, '#64748b')
        return format_html(
            '<span style="background:{};color:#fff;padding:4px 10px;'
            'border-radius:10px;font-weight:600;font-size:10px;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    