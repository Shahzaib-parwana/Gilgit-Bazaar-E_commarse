from django.db import models
from django.core.exceptions import ValidationError

class AboutHeroSection(models.Model):
    """Hero section for About page"""
    badge_text = models.CharField(max_length=200, default="Preserving heritage since 2020")
    title_line_1 = models.CharField(max_length=200, default="The Heart Behind")
    title_highlight = models.CharField(max_length=100, default="Gilgit Bazaar")
    subtitle = models.TextField(default="We bridge the majestic highlands of Gilgit-Baltistan with the world — connecting skilled artisans, organic farmers, and centuries-old traditions directly to your doorstep.")
    cta_button_text = models.CharField(max_length=100, default="Explore Products")
    cta_button_link = models.CharField(max_length=500, default="/products")
    secondary_cta_text = models.CharField(max_length=100, default="Our Story")
    secondary_cta_link = models.CharField(max_length=500, default="#story")
    trust_pills = models.JSONField(default=list, help_text='List of trust badges e.g., ["Gilgit-Baltistan, PK", "100% Authentic", "Ethically Sourced"]')
    hero_image = models.ImageField(upload_to='about/hero/', blank=True, null=True)
    floating_card_top_value = models.CharField(max_length=50, default="100+")
    floating_card_top_label = models.CharField(max_length=100, default="Artisan Partners")
    floating_card_bottom_value = models.CharField(max_length=50, default="4.9★")
    floating_card_bottom_label = models.CharField(max_length=100, default="Customer Rating")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "About Hero Section"
        verbose_name_plural = "About Hero Sections"

    def __str__(self):
        return f"About Hero - {self.created_at.strftime('%Y-%m-%d')}"

class StorySection(models.Model):
    """Our Story section"""
    eyebrow_text = models.CharField(max_length=100, default="Our Story")
    title_prefix = models.CharField(max_length=200, default="Roots in the")
    title_highlight = models.CharField(max_length=100, default="Mountains")
    title_suffix = models.CharField(max_length=200, default="Reach to the World")
    paragraph_1 = models.TextField(default="Founded in 2020, Gilgit Bazaar was born from a deep love for the breathtaking landscapes and extraordinary craftsmanship of Gilgit-Baltistan. What began as a small initiative to help local artisans reach wider markets has grown into a thriving platform celebrating the soul of Pakistan's north.")
    quote_text = models.TextField(default="Every product tells a story of hands that shaped it, valleys it came from, and traditions passed down for generations.")
    paragraph_2 = models.TextField(default="We work hand-in-hand with local communities — from weavers in Hunza to farmers in Skardu — ensuring fair wages, ethical sourcing, and a direct line between maker and buyer.")
    check_items = models.JSONField(default=list, help_text='List of checkmark items')
    story_image = models.ImageField(upload_to='about/story/', blank=True, null=True)
    badge_year = models.CharField(max_length=10, default="2020")
    badge_label = models.CharField(max_length=100, default="Year Founded")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Story Section"
        verbose_name_plural = "Story Sections"

    def __str__(self):
        return f"Story Section - {self.created_at.strftime('%Y-%m-%d')}"

class Value(models.Model):
    """Core values"""
    icon_name = models.CharField(max_length=50, choices=[
        ('Heart', 'Heart'),
        ('Award', 'Award'),
        ('Users', 'Users'),
        ('Target', 'Target'),
        ('Shield', 'Shield'),
        ('Globe', 'Globe'),
    ], default='Heart')
    title = models.CharField(max_length=100)
    description = models.TextField()
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Value"
        verbose_name_plural = "Values"
        ordering = ['order']

    def __str__(self):
        return self.title

class Timeline(models.Model):
    """Timeline milestones"""
    year = models.CharField(max_length=10)
    title = models.CharField(max_length=200)
    description = models.TextField()
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Timeline Item"
        verbose_name_plural = "Timeline Items"
        ordering = ['order']

    def __str__(self):
        return f"{self.year}: {self.title}"

class StatItem(models.Model):
    """Statistics items"""
    value = models.CharField(max_length=50)
    label = models.CharField(max_length=200)
    icon_name = models.CharField(max_length=50, choices=[
        ('Star', 'Star'),
        ('Heart', 'Heart'),
        ('Users', 'Users'),
        ('Award', 'Award'),
        ('TrendingUp', 'Trending Up'),
        ('Clock', 'Clock'),
    ], default='Star')
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Statistic Item"
        verbose_name_plural = "Statistic Items"
        ordering = ['order']

    def __str__(self):
        return f"{self.value} - {self.label}"

class TeamMember(models.Model):
    """Team members"""
    name = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    bio = models.CharField(max_length=500)
    image = models.ImageField(upload_to='about/team/', blank=True, null=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Team Member"
        verbose_name_plural = "Team Members"
        ordering = ['order']

    def __str__(self):
        return self.name

class ArtisanSpotlight(models.Model):
    """Artisan spotlight section"""
    eyebrow_text = models.CharField(max_length=100, default="Artisan Spotlight")
    title_prefix = models.CharField(max_length=200, default="The Hands That Create")
    title_highlight = models.CharField(max_length=100, default="Magic")
    description = models.TextField(default="Behind every product is a skilled artisan from the remote valleys of Hunza, Skardu, and Nagar. We ensure fair wages, ethical sourcing, and active preservation of traditional techniques that have been refined over centuries.")
    features = models.JSONField(default=list, help_text='List of feature badges')
    cta_text = models.CharField(max_length=100, default="Support Artisans")
    cta_link = models.CharField(max_length=500, default="/products?category=handicrafts")
    main_image = models.ImageField(upload_to='about/spotlight/', blank=True, null=True)
    secondary_image_1 = models.ImageField(upload_to='about/spotlight/', blank=True, null=True)
    secondary_image_2 = models.ImageField(upload_to='about/spotlight/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Artisan Spotlight"
        verbose_name_plural = "Artisan Spotlights"

    def __str__(self):
        return f"Artisan Spotlight - {self.created_at.strftime('%Y-%m-%d')}"

class NewsletterSection(models.Model):
    """Newsletter section"""
    eyebrow_text = models.CharField(max_length=100, default="Stay in Touch")
    title_prefix = models.CharField(max_length=200, default="Stay")
    title_highlight = models.CharField(max_length=100, default="Connected")
    description = models.TextField(default="Be first to hear about new artisans, collections, and cultural stories from the highlands of Gilgit-Baltistan.")
    button_text = models.CharField(max_length=100, default="Subscribe")
    social_links = models.JSONField(default=dict, help_text='Social media links e.g., {"FB": "https://facebook.com", "IG": "https://instagram.com"}')
    social_labels = models.JSONField(default=list, help_text='Social media labels e.g., ["FB", "IG", "TW", "YT"]')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Newsletter Section"
        verbose_name_plural = "Newsletter Sections"

    def __str__(self):
        return f"Newsletter Section - {self.created_at.strftime('%Y-%m-%d')}"

class AboutPageSettings(models.Model):
    """Global settings for About page"""
    values_eyebrow = models.CharField(max_length=100, default="What We Stand For")
    values_title = models.CharField(max_length=200, default="Our Core Values")
    values_title_highlight = models.CharField(max_length=100, default="Values")
    values_subtitle = models.TextField(default="The principles that guide every decision, partnership, and product we offer")
    
    timeline_eyebrow = models.CharField(max_length=100, default="Milestones")
    timeline_title = models.CharField(max_length=200, default="Our Journey")
    timeline_title_highlight = models.CharField(max_length=100, default="Journey")
    timeline_subtitle = models.TextField(default="From a bold idea in 2020 to Pakistan's premier highland marketplace")
    
    team_eyebrow = models.CharField(max_length=100, default="The People")
    team_title = models.CharField(max_length=200, default="Meet the Team")
    team_title_highlight = models.CharField(max_length=100, default="Team")
    team_subtitle = models.TextField(default="Passionate individuals dedicated to sharing the magic of Gilgit-Baltistan")
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "About Page Settings"
        verbose_name_plural = "About Page Settings"

    def __str__(self):
        return "About Page Settings"

    def save(self, *args, **kwargs):
        if not self.pk and AboutPageSettings.objects.exists():
            raise ValidationError("There can only be one AboutPageSettings instance")
        super().save(*args, **kwargs)