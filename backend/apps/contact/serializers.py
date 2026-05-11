from rest_framework import serializers
from .models import (
    ContactHeroSection, ContactChannel, BusinessHour, SocialLink,
    ContactFormSettings, MapSection, ContactMessage, ContactPageSettings
)

class ContactHeroSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactHeroSection
        fields = '__all__'

class ContactChannelSerializer(serializers.ModelSerializer):
    icon_name_display = serializers.CharField(source='get_icon_name_display', read_only=True)
    
    class Meta:
        model = ContactChannel
        fields = ['id', 'icon_name', 'icon_name_display', 'title', 'detail', 'subtitle', 'href', 'order', 'is_active']

class BusinessHourSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessHour
        fields = ['id', 'day', 'time', 'status', 'order', 'is_active']

class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = ['id', 'platform', 'label', 'url', 'icon_display', 'order', 'is_active']

class ContactFormSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactFormSettings
        fields = '__all__'

class MapSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MapSection
        fields = '__all__'

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'subject_type', 'subject', 'message', 'status', 'admin_notes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class ContactPageSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactPageSettings
        fields = '__all__'

class ContactPageDataSerializer(serializers.Serializer):
    """Combined serializer for all contact page data"""
    hero = ContactHeroSectionSerializer()
    channels = ContactChannelSerializer(many=True)
    hours = BusinessHourSerializer(many=True)
    social_links = SocialLinkSerializer(many=True)
    form_settings = ContactFormSettingsSerializer()
    map_settings = MapSectionSerializer()
    settings = ContactPageSettingsSerializer()