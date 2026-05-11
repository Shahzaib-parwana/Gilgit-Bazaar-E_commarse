from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from ckeditor.fields import RichTextField

class HeroSection(models.Model):
    """Hero section content"""
    eyebrow_text = models.CharField(max_length=200, default="Est. in Gilgit-Baltistan")
    title = models.CharField(max_length=500, default="Crafted with Love, Rooted in Tradition")
    subtitle = models.TextField(default="Every product tells a story of heritage, craftsmanship, and the breathtaking beauty of Gilgit-Baltistan")
    background_image = models.ImageField(upload_to='hero/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Hero Section"
        verbose_name_plural = "Hero Sections"

    def __str__(self):
        return f"Hero Section - {self.created_at.strftime('%Y-%m-%d')}"

class IntroSection(models.Model):
    """Introduction section content"""
    title = models.CharField(max_length=300, default="Where Mountains Meet Mastery")
    highlighted_word = models.CharField(max_length=100, default="Mastery")
    text_paragraph_1 = models.TextField(default="Nestled in the heart of Pakistan's northern highlands, Gilgit-Baltistan is more than just a place—it's a living testament to centuries of artisan tradition and cultural richness.")
    text_paragraph_2 = models.TextField(default="Our journey began with a simple vision: to connect the world with the extraordinary craftsmanship of our local artisans, farmers, and makers who pour their hearts into every creation.")
    quote_text = models.TextField(default="Each product carries the soul of its maker, the essence of our mountains, and a commitment to preserving traditions that have been passed down through generations.")
    image = models.ImageField(upload_to='intro/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Intro Section"
        verbose_name_plural = "Intro Sections"

    def __str__(self):
        return f"Intro Section - {self.created_at.strftime('%Y-%m-%d')}"

class Stat(models.Model):
    """Statistics section"""
    icon_name = models.CharField(max_length=50, choices=[
        ('Users', 'Users'),
        ('Mountain', 'Mountain'),
        ('Heart', 'Heart'),
        ('Award', 'Award'),
    ], default='Users')
    value = models.CharField(max_length=50, default="0")
    label = models.CharField(max_length=200, default="")
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Statistic"
        verbose_name_plural = "Statistics"
        ordering = ['order']

    def __str__(self):
        return f"{self.label}: {self.value}"

class VideoSection(models.Model):
    """Video section content"""
    title = models.CharField(max_length=300, default="See Our Craft Come to Life")
    highlighted_word = models.CharField(max_length=100, default="Craft")
    subtitle = models.TextField(default="Watch how our artisans transform raw materials into beautiful, handcrafted products that tell a story")
    thumbnail_image = models.ImageField(upload_to='video/', blank=True, null=True)
    youtube_video_id = models.CharField(max_length=100, default='dQw4w9WgXcQ')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Video Section"
        verbose_name_plural = "Video Sections"

    def __str__(self):
        return f"Video Section - {self.created_at.strftime('%Y-%m-%d')}"

class ArtisanStory(models.Model):
    """Artisan stories section"""
    category = models.CharField(max_length=100, default="Textile Weaving")
    badge_text = models.CharField(max_length=100, default="Master Artisan")
    title = models.CharField(max_length=300, default="The Art of Traditional Weaving")
    story_text = models.TextField(default="")
    quote_text = models.TextField(default="")
    author_name = models.CharField(max_length=200, default="")
    author_role = models.CharField(max_length=200, default="")
    author_avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    story_image = models.ImageField(upload_to='stories/', blank=True, null=True)
    reverse_layout = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Artisan Story"
        verbose_name_plural = "Artisan Stories"
        ordering = ['order']

    def __str__(self):
        return self.title

class ProcessStep(models.Model):
    """Process section steps"""
    step_number = models.IntegerField()
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon_image = models.ImageField(upload_to='process/', blank=True, null=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Process Step"
        verbose_name_plural = "Process Steps"
        ordering = ['order']

    def __str__(self):
        return f"Step {self.step_number}: {self.title}"

class CTASection(models.Model):
    """Call to Action section"""
    title = models.CharField(max_length=300, default="Become Part of Our Story")
    highlighted_word = models.CharField(max_length=100, default="Story")
    text = models.TextField(default="When you shop with us, you're not just buying a product—you're supporting families, preserving traditions, and celebrating the beauty of handcrafted excellence")
    button_text = models.CharField(max_length=100, default="Explore Our Collection")
    button_link = models.CharField(max_length=500, default="/products")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "CTA Section"
        verbose_name_plural = "CTA Sections"

    def __str__(self):
        return f"CTA Section - {self.created_at.strftime('%Y-%m-%d')}"

class StorySettings(models.Model):
    """Global settings for the Our Story page"""
    section_eyebrow_text = models.CharField(max_length=200, default="Meet Our Makers")
    section_title = models.CharField(max_length=300, default="Stories of Passion and Pride")
    section_title_word_1 = models.CharField(max_length=100, default="Passion")
    section_title_word_2 = models.CharField(max_length=100, default="Pride")
    section_subtitle = models.TextField(default="Behind every product is a person, a family, and a legacy of craftsmanship")
    process_eyebrow_text = models.CharField(max_length=200, default="From Mountain to Market")
    process_title = models.CharField(max_length=300, default="Our Creation Process")
    process_title_word = models.CharField(max_length=100, default="Creation")
    process_subtitle = models.TextField(default="Every product goes through a careful journey of craftsmanship and quality assurance")
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = "Story Settings"
        verbose_name_plural = "Story Settings"

    def __str__(self):
        return "Our Story Page Settings"

    def save(self, *args, **kwargs):
        if not self.pk and StorySettings.objects.exists():
            raise ValidationError("There can only be one StorySettings instance")
        super().save(*args, **kwargs)