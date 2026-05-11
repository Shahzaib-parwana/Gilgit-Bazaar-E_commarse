# site_settings/admin.py
from django.contrib import admin
from .models import AnnouncementBar, FlashSale, SiteSetting

@admin.register(AnnouncementBar)
class AnnouncementBarAdmin(admin.ModelAdmin):
    list_display = ['text', 'is_active', 'order', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['text']
    list_editable = ['is_active', 'order']
    fieldsets = (
        ('Content', {
            'fields': ('text', 'link_url', 'link_text', 'icon', 'show_icon')
        }),
        ('Styling', {
            'fields': ('background_color', 'text_color')
        }),
        ('Status', {
            'fields': ('is_active', 'order')
        }),
    )


@admin.register(FlashSale)
class FlashSaleAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_active', 'start_date', 'end_date', 'is_running']
    list_filter = ['is_active', 'start_date', 'end_date']
    search_fields = ['title', 'subtitle']
    filter_horizontal = ['products']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Content', {
            'fields': ('title', 'subtitle', 'discount_percentage', 'button_text', 'button_link')
        }),
        ('Schedule', {
            'fields': ('start_date', 'end_date', 'show_countdown')
        }),
        ('Styling', {
            'fields': ('background_color',)
        }),
        ('Products', {
            'fields': ('products',)
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
    )


@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ['key', 'value', 'is_active']
    list_filter = ['is_active']
    search_fields = ['key', 'description']
    list_editable = ['is_active']