from django.contrib import admin
from django.contrib import messages
from django.http import HttpResponseRedirect
from django.urls import path
from django.shortcuts import render
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from .models import NewsletterSubscriber, NewsletterEmail
from django.contrib.admin import SimpleListFilter
from django.utils import timezone

class ActiveFilter(SimpleListFilter):
    title = 'Status'
    parameter_name = 'active'
    
    def lookups(self, request, model_admin):
        return (
            ('active', 'Active'),
            ('inactive', 'Inactive'),
            ('unverified', 'Unverified'),
        )
    
    def queryset(self, request, queryset):
        if self.value() == 'active':
            return queryset.filter(is_active=True, is_verified=True)
        if self.value() == 'inactive':
            return queryset.filter(is_active=False)
        if self.value() == 'unverified':
            return queryset.filter(is_verified=False)
        return queryset

@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ['email', 'subscribed_at', 'is_active', 'is_verified']
    list_filter = [ActiveFilter, 'is_verified', 'subscribed_at']
    search_fields = ['email']
    actions = ['send_test_email', 'export_subscribers']
    readonly_fields = ['subscribed_at', 'verification_token']
    
    def send_test_email(self, request, queryset):
        for subscriber in queryset:
            try:
                send_mail(
                    'Test Email from Gilgit Bazaar',
                    'This is a test email to verify your subscription is working.',
                    settings.DEFAULT_FROM_EMAIL,
                    [subscriber.email],
                    fail_silently=False,
                )
                messages.success(request, f'Test email sent to {subscriber.email}')
            except Exception as e:
                messages.error(request, f'Failed to send to {subscriber.email}: {str(e)}')
    
    send_test_email.short_description = "Send test email to selected subscribers"
    
    def export_subscribers(self, request, queryset):
        import csv
        from django.http import HttpResponse
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="subscribers.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Email', 'Subscribed Date', 'Status', 'Verified'])
        
        for subscriber in queryset:
            writer.writerow([
                subscriber.email,
                subscriber.subscribed_at,
                'Active' if subscriber.is_active else 'Inactive',
                'Yes' if subscriber.is_verified else 'No'
            ])
        
        return response
    
    export_subscribers.short_description = "Export selected subscribers to CSV"

@admin.register(NewsletterEmail)
class NewsletterEmailAdmin(admin.ModelAdmin):
    list_display = ['subject', 'created_at', 'sent_at', 'status', 'recipients_count', 'success_count']
    list_filter = ['status', 'created_at']
    search_fields = ['subject']
    readonly_fields = ['sent_at', 'recipients_count', 'success_count', 'failed_count']
    actions = ['send_newsletter']
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('compose-email/', self.admin_site.admin_view(self.compose_email_view), name='compose-email'),
        ]
        return custom_urls + urls
    
    def compose_email_view(self, request):
        if request.method == 'POST':
            subject = request.POST.get('subject')
            message = request.POST.get('message')
            
            # Save to database
            newsletter = NewsletterEmail.objects.create(
                subject=subject,
                message=message,
                status='sent'
            )
            
            # Send emails
            subscribers = NewsletterSubscriber.objects.filter(is_active=True, is_verified=True)
            recipient_list = [sub.email for sub in subscribers]
            
            newsletter.recipients_count = len(recipient_list)
            
            # Send bulk emails
            try:
                from django.core.mail import EmailMessage
                
                # Create email
                email = EmailMessage(
                    subject=subject,
                    body=message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[],
                    bcc=recipient_list,  # Use BCC to hide other recipients
                )
                email.content_subtype = "html"  # Send as HTML email
                
                # Send
                result = email.send()
                
                newsletter.success_count = len(recipient_list)
                newsletter.failed_count = 0
                newsletter.sent_at = timezone.now()
                newsletter.save()
                
                messages.success(request, f'Newsletter sent to {len(recipient_list)} subscribers!')
                return HttpResponseRedirect('/admin/your_app/newsletteremail/')
                
            except Exception as e:
                newsletter.status = 'failed'
                newsletter.save()
                messages.error(request, f'Failed to send newsletter: {str(e)}')
        
        return render(request, 'admin/compose_email.html', {})
    
    def send_newsletter(self, request, queryset):
        for newsletter in queryset:
            if newsletter.status == 'draft':
                subscribers = NewsletterSubscriber.objects.filter(is_active=True, is_verified=True)
                recipient_list = [sub.email for sub in subscribers]
                
                newsletter.recipients_count = len(recipient_list)
                
                try:
                    # Send bulk emails
                    from django.core.mail import EmailMessage
                    
                    email = EmailMessage(
                        subject=newsletter.subject,
                        body=newsletter.message,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        to=[],
                        bcc=recipient_list,
                    )
                    email.content_subtype = "html"
                    
                    result = email.send()
                    
                    newsletter.success_count = len(recipient_list)
                    newsletter.failed_count = 0
                    newsletter.status = 'sent'
                    newsletter.sent_at = timezone.now()
                    newsletter.save()
                    
                    messages.success(request, f'Newsletter "{newsletter.subject}" sent to {len(recipient_list)} subscribers!')
                    
                except Exception as e:
                    newsletter.status = 'failed'
                    newsletter.save()
                    messages.error(request, f'Failed to send newsletter: {str(e)}')
            else:
                messages.warning(request, f'Newsletter "{newsletter.subject}" has already been sent or failed.')
    
    send_newsletter.short_description = "Send selected newsletters to all subscribers"