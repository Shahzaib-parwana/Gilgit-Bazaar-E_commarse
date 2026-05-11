from django.contrib import admin
from django.utils.html import format_html
from .models import (
    HeroSection, IntroSection, Stat, VideoSection, 
    ArtisanStory, ProcessStep, CTASection, StorySettings
)

@admin.register(HeroSection)
class HeroSectionAdmin(admin.ModelAdmin):
    list_display = ['id', 'eyebrow_text', 'title_preview', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['title', 'eyebrow_text', 'subtitle']
    fieldsets = (
        ('Content', {
            'fields': ('eyebrow_text', 'title', 'subtitle')
        }),
        ('Media', {
            'fields': ('background_image',),
            'classes': ('collapse',)
        }),
        ('Status', {
            'fields': ('is_active',)
        })
    )
    
    def title_preview(self, obj):
        return obj.title[:50] + '...' if len(obj.title) > 50 else obj.title
    title_preview.short_description = 'Title Preview'

@admin.register(IntroSection)
class IntroSectionAdmin(admin.ModelAdmin):
    list_display = ['id', 'title_preview', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['title', 'text_paragraph_1', 'quote_text']
    
    def title_preview(self, obj):
        return obj.title[:50] + '...' if len(obj.title) > 50 else obj.title
    title_preview.short_description = 'Title Preview'

@admin.register(Stat)
class StatAdmin(admin.ModelAdmin):
    list_display = ['id', 'label', 'value', 'get_icon_display', 'order', 'is_active']
    list_filter = ['is_active', 'icon_name']
    search_fields = ['label', 'value']
    list_editable = ['order', 'is_active']
    
    def get_icon_display(self, obj):
        return obj.get_icon_name_display()
    get_icon_display.short_description = 'Icon'

@admin.register(VideoSection)
class VideoSectionAdmin(admin.ModelAdmin):
    list_display = ['id', 'title_preview', 'youtube_video_id', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['title', 'subtitle']
    
    def title_preview(self, obj):
        return obj.title[:50] + '...' if len(obj.title) > 50 else obj.title
    title_preview.short_description = 'Title Preview'

@admin.register(ArtisanStory)
class ArtisanStoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'category', 'author_name', 'order', 'reverse_layout', 'is_active']
    list_filter = ['is_active', 'category', 'reverse_layout']
    search_fields = ['title', 'story_text', 'author_name', 'quote_text']
    list_editable = ['order', 'is_active', 'reverse_layout']
    fieldsets = (
        ('Story Information', {
            'fields': ('category', 'badge_text', 'title', 'story_text', 'quote_text')
        }),
        ('Author Information', {
            'fields': ('author_name', 'author_role', 'author_avatar')
        }),
        ('Media', {
            'fields': ('story_image',)
        }),
        ('Layout & Status', {
            'fields': ('reverse_layout', 'order', 'is_active')
        })
    )

@admin.register(ProcessStep)
class ProcessStepAdmin(admin.ModelAdmin):
    list_display = ['id', 'step_number', 'title', 'order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['title', 'description']
    list_editable = ['order', 'is_active']

@admin.register(CTASection)
class CTASectionAdmin(admin.ModelAdmin):
    list_display = ['id', 'title_preview', 'button_text', 'button_link', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['title', 'text', 'button_text']
    
    def title_preview(self, obj):
        return obj.title[:50] + '...' if len(obj.title) > 50 else obj.title
    title_preview.short_description = 'Title Preview'

@admin.register(StorySettings)
class StorySettingsAdmin(admin.ModelAdmin):
    list_display = ['id', 'is_active']
    fieldsets = (
        ('Stories Section', {
            'fields': ('section_eyebrow_text', 'section_title', 'section_title_word_1', 
                      'section_title_word_2', 'section_subtitle')
        }),
        ('Process Section', {
            'fields': ('process_eyebrow_text', 'process_title', 'process_title_word', 'process_subtitle')
        }),
        ('Status', {
            'fields': ('is_active',)
        })
    )
    
    def has_add_permission(self, request):
        if StorySettings.objects.exists():
            return False
        return super().has_add_permission(request)