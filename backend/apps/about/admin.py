from django.contrib import admin

# Register your models here.
from django.contrib import admin
from django.utils.html import format_html
from .models import (
    AboutHeroSection, StorySection, Value, Timeline, StatItem,
    TeamMember, ArtisanSpotlight, NewsletterSection, AboutPageSettings
)

@admin.register(AboutHeroSection)
class AboutHeroSectionAdmin(admin.ModelAdmin):
    list_display = ['id', 'badge_text', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['badge_text', 'title_line_1', 'subtitle']
    fieldsets = (
        ('Content', {
            'fields': ('badge_text', 'title_line_1', 'title_highlight', 'subtitle')
        }),
        ('CTAs', {
            'fields': ('cta_button_text', 'cta_button_link', 'secondary_cta_text', 'secondary_cta_link')
        }),
        ('Trust Pills', {
            'fields': ('trust_pills',)
        }),
        ('Floating Cards', {
            'fields': ('floating_card_top_value', 'floating_card_top_label', 
                      'floating_card_bottom_value', 'floating_card_bottom_label')
        }),
        ('Media', {
            'fields': ('hero_image',)
        }),
        ('Status', {
            'fields': ('is_active',)
        })
    )

@admin.register(StorySection)
class StorySectionAdmin(admin.ModelAdmin):
    list_display = ['id', 'eyebrow_text', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['eyebrow_text', 'paragraph_1', 'quote_text']
    fieldsets = (
        ('Content', {
            'fields': ('eyebrow_text', 'title_prefix', 'title_highlight', 'title_suffix')
        }),
        ('Text', {
            'fields': ('paragraph_1', 'quote_text', 'paragraph_2')
        }),
        ('Check Items', {
            'fields': ('check_items',)
        }),
        ('Media', {
            'fields': ('story_image', 'badge_year', 'badge_label')
        }),
        ('Status', {
            'fields': ('is_active',)
        })
    )

@admin.register(Value)
class ValueAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'icon_name', 'order', 'is_active']
    list_filter = ['is_active', 'icon_name']
    search_fields = ['title', 'description']
    list_editable = ['order', 'is_active']

@admin.register(Timeline)
class TimelineAdmin(admin.ModelAdmin):
    list_display = ['id', 'year', 'title', 'order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['year', 'title', 'description']
    list_editable = ['order', 'is_active']

@admin.register(StatItem)
class StatItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'value', 'label', 'icon_name', 'order', 'is_active']
    list_filter = ['is_active', 'icon_name']
    search_fields = ['value', 'label']
    list_editable = ['order', 'is_active']

@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'role', 'order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name', 'role', 'bio']
    list_editable = ['order', 'is_active']
    
    def preview_image(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" style="border-radius: 50%;" />', obj.image.url)
        return "No image"
    preview_image.short_description = 'Preview'

@admin.register(ArtisanSpotlight)
class ArtisanSpotlightAdmin(admin.ModelAdmin):
    list_display = ['id', 'eyebrow_text', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['eyebrow_text', 'description']

@admin.register(NewsletterSection)
class NewsletterSectionAdmin(admin.ModelAdmin):
    list_display = ['id', 'eyebrow_text', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['eyebrow_text', 'description']

@admin.register(AboutPageSettings)
class AboutPageSettingsAdmin(admin.ModelAdmin):
    list_display = ['id', 'is_active', 'created_at']
    fieldsets = (
        ('Values Section', {
            'fields': ('values_eyebrow', 'values_title', 'values_title_highlight', 'values_subtitle')
        }),
        ('Timeline Section', {
            'fields': ('timeline_eyebrow', 'timeline_title', 'timeline_title_highlight', 'timeline_subtitle')
        }),
        ('Team Section', {
            'fields': ('team_eyebrow', 'team_title', 'team_title_highlight', 'team_subtitle')
        }),
        ('Status', {
            'fields': ('is_active',)
        })
    )
    
    def has_add_permission(self, request):
        if AboutPageSettings.objects.exists():
            return False
        return super().has_add_permission(request)