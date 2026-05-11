from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone

class ContactHeroSection(models.Model):
    """Hero section for Contact page"""
    badge_text = models.CharField(max_length=200, default="We're here for you")
    title_line_1 = models.CharField(max_length=200, default="Let's Start")
    title_highlight = models.CharField(max_length=100, default="a Conversation")
    subtitle = models.TextField(default="Questions about an order, a product, or want to become an artisan partner? Our dedicated team is ready to help — fast, friendly, and from the heart.")
    
    # Response pills
    response_pills = models.JSONField(default=list, help_text='List of response pills e.g., ["Avg. reply in 3 hrs", "98% satisfaction rate", "Secure & confidential"]')
    
    # Quick links
    quick_links = models.JSONField(default=list, help_text='Quick links e.g., [{"icon":"Phone","text":"Call Now","link":"tel:+923451234567"}]')
    
    # Hero visual cards
    hero_cards = models.JSONField(default=list, help_text='Cards for hero visual')
    
    # Online indicator
    online_indicator_text = models.CharField(max_length=300, default="Support team is online now — ready to help")
    online_indicator_highlight = models.CharField(max_length=100, default="online now")
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Contact Hero Section"
        verbose_name_plural = "Contact Hero Sections"

    def __str__(self):
        return f"Contact Hero - {self.created_at.strftime('%Y-%m-%d')}"

class ContactChannel(models.Model):
    """Contact channels (Phone, Email, etc.)"""
    ICON_CHOICES = [
        ('Phone', 'Phone'),
        ('Mail', 'Mail'),
        ('MapPin', 'Map Pin'),
        ('MessageCircle', 'Message Circle'),
    ]
    
    icon_name = models.CharField(max_length=50, choices=ICON_CHOICES, default='Phone')
    title = models.CharField(max_length=100)
    detail = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=200)
    href = models.CharField(max_length=500)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Contact Channel"
        verbose_name_plural = "Contact Channels"
        ordering = ['order']

    def __str__(self):
        return self.title

class BusinessHour(models.Model):
    """Business hours"""
    day = models.CharField(max_length=100)
    time = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=20, choices=[('open', 'Open'), ('closed', 'Closed')], default='open')
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Business Hour"
        verbose_name_plural = "Business Hours"
        ordering = ['order']

    def __str__(self):
        return f"{self.day} - {self.status}"

class SocialLink(models.Model):
    """Social media links"""
    SOCIAL_CHOICES = [
        ('FaFacebook', 'FaFacebook'),
        ('FaInstagram', 'FaInstagram'),
        ('FaTwitter', 'FaTwitter'),
        ('FaYouTube', 'FaYouTube'),
        ('FaLinkedIn', 'FaLinkedIn'),
    ]
    
    platform = models.CharField(max_length=20, choices=SOCIAL_CHOICES)
    label = models.CharField(max_length=50)
    url = models.URLField()
    icon_display = models.CharField(max_length=10, help_text="Display text for icon (e.g., FB, IG)")
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Social Link"
        verbose_name_plural = "Social Links"
        ordering = ['order']

    def __str__(self):
        return self.label

class ContactFormSettings(models.Model):
    """Settings for contact form"""
    section_eyebrow = models.CharField(max_length=100, default="Message Us")
    title_prefix = models.CharField(max_length=200, default="Send a")
    title_highlight = models.CharField(max_length=100, default="Message")
    subtitle = models.TextField(default="Fill out the form below and our team will get back to you within 24 hours.")
    
    # Subject types
    subject_types = models.JSONField(default=list, help_text='List of subject types for the form')
    
    # Form fields labels
    name_label = models.CharField(max_length=50, default="Full Name")
    email_label = models.CharField(max_length=50, default="Email Address")
    subject_label = models.CharField(max_length=50, default="Subject")
    message_label = models.CharField(max_length=50, default="Message")
    
    # Placeholders
    name_placeholder = models.CharField(max_length=100, default="e.g. Ahmed Raza")
    email_placeholder = models.CharField(max_length=100, default="hello@example.com")
    subject_placeholder = models.CharField(max_length=200, default="{type} — describe briefly")
    message_placeholder = models.CharField(max_length=200, default="Tell us exactly how we can help you…")
    
    # Message limits
    max_message_length = models.IntegerField(default=500)
    
    # Privacy notice
    privacy_text = models.TextField(default="Your data is protected and will never be shared with third parties.")
    
    # Button texts
    button_loading_text = models.CharField(max_length=100, default="Sending your message…")
    button_sent_text = models.CharField(max_length=100, default="Message Sent! ✓")
    button_default_text = models.CharField(max_length=100, default="Send Message")
    
    # Success message
    success_toast_message = models.TextField(default="Message sent! We'll get back to you within 24 hours.")
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Contact Form Settings"
        verbose_name_plural = "Contact Form Settings"

    def __str__(self):
        return "Contact Form Settings"

class MapSection(models.Model):
    """Map section settings"""
    title_prefix = models.CharField(max_length=200, default="Find")
    title_highlight = models.CharField(max_length=100, default="Us")
    subtitle = models.TextField(default="Operating from the stunning highlands of northern Pakistan")
    
    # Map embed URL
    map_embed_url = models.URLField(default="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d211174.78!2d74.3!3d35.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e649c0aa418e67%3A0x87b2ed80018aa1e8!2sGilgit-Baltistan%2C%20Pakistan!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s")
    
    # Map links
    map_link_text = models.CharField(max_length=100, default="Open in Maps")
    map_link_url = models.URLField(default="https://maps.google.com/?q=Gilgit-Baltistan,Pakistan")
    
    # Map footer info
    map_footer_items = models.JSONField(default=list, help_text='Footer items for map section')
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Map Section"
        verbose_name_plural = "Map Sections"

    def __str__(self):
        return f"Map Section - {self.created_at.strftime('%Y-%m-%d')}"

class ContactMessage(models.Model):
    """Store contact form submissions"""
    STATUS_CHOICES = [
        ('new', 'New'),
        ('read', 'Read'),
        ('replied', 'Replied'),
        ('archived', 'Archived'),
    ]
    
    name = models.CharField(max_length=200)
    email = models.EmailField()
    subject_type = models.CharField(max_length=100, blank=True, null=True)
    subject = models.CharField(max_length=500)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    admin_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Contact Message"
        verbose_name_plural = "Contact Messages"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"

class ContactPageSettings(models.Model):
    """Global settings for Contact page"""
    info_column_eyebrow = models.CharField(max_length=100, default="Contact")
    info_column_title_prefix = models.CharField(max_length=200, default="Get in")
    info_column_title_highlight = models.CharField(max_length=100, default="Touch")
    info_column_subtitle = models.TextField(default="Whether it's a question, feedback, or a fresh partnership idea — pick the channel that works best for you.")
    
    hours_section_title = models.CharField(max_length=100, default="Business Hours")
    social_section_title = models.CharField(max_length=100, default="Follow Us")
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Contact Page Settings"
        verbose_name_plural = "Contact Page Settings"

    def __str__(self):
        return "Contact Page Settings"

    def save(self, *args, **kwargs):
        if not self.pk and ContactPageSettings.objects.exists():
            raise ValidationError("There can only be one ContactPageSettings instance")
        super().save(*args, **kwargs)