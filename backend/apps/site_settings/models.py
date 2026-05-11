# site_settings/models.py
from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator

class AnnouncementBar(models.Model):
    """
    Model for managing the announcement bar content
    """
    text = models.CharField(max_length=500, help_text="Announcement text to display")
    link_url = models.URLField(blank=True, null=True, help_text="Optional link for the announcement")
    link_text = models.CharField(max_length=100, blank=True, null=True, help_text="Link text (e.g., 'Shop Now')")
    is_active = models.BooleanField(default=True, help_text="Show/hide announcement bar")
    order = models.IntegerField(default=0, help_text="Display order")
    background_color = models.CharField(max_length=20, default="#f0a500", help_text="Hex color code")
    text_color = models.CharField(max_length=20, default="#000000", help_text="Hex color code")
    show_icon = models.BooleanField(default=True, help_text="Show/hide icon (🎁, 🚚, ✨, 💳)")
    icon = models.CharField(
        max_length=10, 
        blank=True, 
        null=True,
        help_text="Emoji icon (e.g., 🎁, 🚚, ✨, 💳)",
        choices=[
            ('🎁', '🎁 Gift'),
            ('🚚', '🚚 Delivery'),
            ('✨', '✨ Special'),
            ('💳', '💳 Payment'),
            ('⚡', '⚡ Flash'),
            ('🔥', '🔥 Hot'),
            ('⭐', '⭐ Featured'),
        ]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = "Announcement Bar"
        verbose_name_plural = "Announcement Bars"

    def __str__(self):
        return self.text[:50]


class FlashSale(models.Model):
    """
    Model for managing flash sales with countdown timer
    """
    title = models.CharField(max_length=200, default="Flash Sale — Up to 50% Off")
    subtitle = models.CharField(max_length=300, default="Limited time offer on selected northern crafts & dried fruits")
    discount_percentage = models.IntegerField(
        default=50,
        validators=[MinValueValidator(1), MaxValueValidator(99)],
        help_text="Discount percentage to show"
    )
    start_date = models.DateTimeField(help_text="When the flash sale starts")
    end_date = models.DateTimeField(help_text="When the flash sale ends")
    is_active = models.BooleanField(default=True, help_text="Show/hide flash sale")
    background_color = models.CharField(max_length=20, default="#7c1a1a", help_text="Hex color code")
    button_text = models.CharField(max_length=50, default="Grab Deals")
    button_link = models.CharField(max_length=200, default="/products?sale=true")
    show_countdown = models.BooleanField(default=True, help_text="Show/hide countdown timer")
    products = models.ManyToManyField(
        'products.Product',
        blank=True,
        related_name='flash_sales',
        help_text="Products included in flash sale (leave empty to show all products with sale tag)"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_active', '-start_date']
        verbose_name = "Flash Sale"
        verbose_name_plural = "Flash Sales"

    def __str__(self):
        return f"{self.title} - {self.start_date} to {self.end_date}"
    
    @property
    def is_running(self):
        """Check if flash sale is currently running"""
        now = timezone.now()
        return self.start_date <= now <= self.end_date
    
    @property
    def time_remaining(self):
        """Get time remaining as dictionary"""
        if not self.is_running:
            return None
        remaining = self.end_date - timezone.now()
        return {
            'hours': remaining.total_seconds() // 3600,
            'minutes': (remaining.total_seconds() % 3600) // 60,
            'seconds': remaining.total_seconds() % 60,
            'total_seconds': int(remaining.total_seconds())
        }


class SiteSetting(models.Model):
    """
    General site settings
    """
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['key']
        verbose_name = "Site Setting"
        verbose_name_plural = "Site Settings"
    
    def __str__(self):
        return self.key