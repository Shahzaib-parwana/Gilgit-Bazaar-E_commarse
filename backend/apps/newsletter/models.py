from django.db import models
from django.utils import timezone
from django.core.mail import send_mass_mail
from django.conf import settings
import uuid

class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    verification_token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    is_verified = models.BooleanField(default=False)
    unsubscribed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-subscribed_at']
        verbose_name = 'Newsletter Subscriber'
        verbose_name_plural = 'Newsletter Subscribers'
    
    def __str__(self):
        return self.email
    
    def unsubscribe(self):
        self.is_active = False
        self.unsubscribed_at = timezone.now()
        self.save()

class NewsletterEmail(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('sent', 'Sent'),
        ('failed', 'Failed'),
    ]
    
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    recipients_count = models.IntegerField(default=0)
    success_count = models.IntegerField(default=0)
    failed_count = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Newsletter Email'
        verbose_name_plural = 'Newsletter Emails'
    
    def __str__(self):
        return f"{self.subject} - {self.created_at.date()}"