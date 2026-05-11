from django.contrib import admin
from django.utils.html import format_html
from .models import (
    ContactHeroSection, ContactChannel, BusinessHour, SocialLink,
    ContactFormSettings, MapSection, ContactMessage, ContactPageSettings
)

@admin.register(ContactHeroSection)
class ContactHeroSectionAdmin(admin.ModelAdmin):
    list_display = ['id', 'badge_text', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['badge_text', 'title_line_1', 'subtitle']
    fieldsets = (
        ('Hero Content', {
            'fields': ('badge_text', 'title_line_1', 'title_highlight', 'subtitle')
        }),
        ('Response Pills', {
            'fields': ('response_pills',)
        }),
        ('Quick Links', {
            'fields': ('quick_links',)
        }),
        ('Hero Cards', {
            'fields': ('hero_cards',)
        }),
        ('Online Indicator', {
            'fields': ('online_indicator_text', 'online_indicator_highlight')
        }),
        ('Status', {
            'fields': ('is_active',)
        })
    )

@admin.register(ContactChannel)
class ContactChannelAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'detail', 'icon_name', 'order', 'is_active']
    list_filter = ['is_active', 'icon_name']
    search_fields = ['title', 'detail', 'subtitle']
    list_editable = ['order', 'is_active']

@admin.register(BusinessHour)
class BusinessHourAdmin(admin.ModelAdmin):
    list_display = ['id', 'day', 'time', 'status', 'order', 'is_active']
    list_filter = ['is_active', 'status']
    search_fields = ['day']
    list_editable = ['order', 'is_active', 'status']

@admin.register(SocialLink)
class SocialLinkAdmin(admin.ModelAdmin):
    list_display = ['id', 'platform', 'label', 'url', 'order', 'is_active']
    list_filter = ['is_active', 'platform']
    search_fields = ['label', 'url']
    list_editable = ['order', 'is_active']

@admin.register(ContactFormSettings)
class ContactFormSettingsAdmin(admin.ModelAdmin):
    list_display = ['id', 'is_active', 'created_at']
    fieldsets = (
        ('Section Header', {
            'fields': ('section_eyebrow', 'title_prefix', 'title_highlight', 'subtitle')
        }),
        ('Subject Types', {
            'fields': ('subject_types',)
        }),
        ('Form Labels & Placeholders', {
            'fields': ('name_label', 'email_label', 'subject_label', 'message_label',
                      'name_placeholder', 'email_placeholder', 'subject_placeholder', 'message_placeholder')
        }),
        ('Message Settings', {
            'fields': ('max_message_length', 'privacy_text')
        }),
        ('Button Settings', {
            'fields': ('button_default_text', 'button_loading_text', 'button_sent_text')
        }),
        ('Success Message', {
            'fields': ('success_toast_message',)
        }),
        ('Status', {
            'fields': ('is_active',)
        })
    )
    
    def has_add_permission(self, request):
        if ContactFormSettings.objects.exists():
            return False
        return super().has_add_permission(request)

@admin.register(MapSection)
class MapSectionAdmin(admin.ModelAdmin):
    list_display = ['id', 'is_active', 'created_at']
    fieldsets = (
        ('Title Section', {
            'fields': ('title_prefix', 'title_highlight', 'subtitle')
        }),
        ('Map Settings', {
            'fields': ('map_embed_url', 'map_link_text', 'map_link_url')
        }),
        ('Footer Items', {
            'fields': ('map_footer_items',)
        }),
        ('Status', {
            'fields': ('is_active',)
        })
    )

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'email', 'subject_type', 'status', 'created_at', 'message_preview']
    list_filter = ['status', 'subject_type', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    readonly_fields = ['created_at', 'updated_at']
    list_editable = ['status']
    actions = ['mark_as_read', 'mark_as_replied']
    
    def message_preview(self, obj):
        return obj.message[:50] + '...' if len(obj.message) > 50 else obj.message
    message_preview.short_description = 'Message Preview'
    
    def mark_as_read(self, request, queryset):
        updated = queryset.update(status='read')
        self.message_user(request, f'{updated} messages marked as read.')
    mark_as_read.short_description = 'Mark selected as read'
    
    def mark_as_replied(self, request, queryset):
        updated = queryset.update(status='replied')
        self.message_user(request, f'{updated} messages marked as replied.')
    mark_as_replied.short_description = 'Mark selected as replied'
    
    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'email', 'subject_type')
        }),
        ('Message Details', {
            'fields': ('subject', 'message')
        }),
        ('Admin Management', {
            'fields': ('status', 'admin_notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )

@admin.register(ContactPageSettings)
class ContactPageSettingsAdmin(admin.ModelAdmin):
    list_display = ['id', 'is_active', 'created_at']
    fieldsets = (
        ('Info Column Settings', {
            'fields': ('info_column_eyebrow', 'info_column_title_prefix', 
                      'info_column_title_highlight', 'info_column_subtitle')
        }),
        ('Section Titles', {
            'fields': ('hours_section_title', 'social_section_title')
        }),
        ('Status', {
            'fields': ('is_active',)
        })
    )
    
    def has_add_permission(self, request):
        if ContactPageSettings.objects.exists():
            return False
        return super().has_add_permission(request)