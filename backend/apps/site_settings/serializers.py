# site_settings/serializers.py
from rest_framework import serializers
from .models import AnnouncementBar, FlashSale, SiteSetting

class AnnouncementBarSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnnouncementBar
        fields = [
            'id', 'text', 'link_url', 'link_text', 'is_active',
            'order', 'background_color', 'text_color', 'show_icon', 'icon'
        ]


class FlashSaleSerializer(serializers.ModelSerializer):
    is_running = serializers.BooleanField(read_only=True)
    time_remaining = serializers.DictField(read_only=True)
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = FlashSale
        fields = [
            'id', 'title', 'subtitle', 'discount_percentage', 'start_date', 'end_date',
            'is_active', 'is_running', 'time_remaining', 'background_color',
            'button_text', 'button_link', 'show_countdown', 'product_count'
        ]
    
    def get_product_count(self, obj):
        return obj.products.count()


class SiteSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSetting
        fields = ['id', 'key', 'value', 'description', 'is_active']