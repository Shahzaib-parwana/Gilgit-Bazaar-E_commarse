from rest_framework import serializers
from .models import (
    AboutHeroSection, StorySection, Value, Timeline, StatItem,
    TeamMember, ArtisanSpotlight, NewsletterSection, AboutPageSettings
)

class AboutHeroSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutHeroSection
        fields = '__all__'

class StorySectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = StorySection
        fields = '__all__'

class ValueSerializer(serializers.ModelSerializer):
    icon_name_display = serializers.CharField(source='get_icon_name_display', read_only=True)
    
    class Meta:
        model = Value
        fields = ['id', 'icon_name', 'icon_name_display', 'title', 'description', 'order', 'is_active']

class TimelineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Timeline
        fields = ['id', 'year', 'title', 'description', 'order', 'is_active']

class StatItemSerializer(serializers.ModelSerializer):
    icon_name_display = serializers.CharField(source='get_icon_name_display', read_only=True)
    
    class Meta:
        model = StatItem
        fields = ['id', 'value', 'label', 'icon_name', 'icon_name_display', 'order', 'is_active']

class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = ['id', 'name', 'role', 'bio', 'image', 'order', 'is_active']

class ArtisanSpotlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtisanSpotlight
        fields = '__all__'

class NewsletterSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSection
        fields = '__all__'

class AboutPageSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutPageSettings
        fields = '__all__'

class AboutPageDataSerializer(serializers.Serializer):
    """Combined serializer for all about page data"""
    hero = AboutHeroSectionSerializer()
    story = StorySectionSerializer()
    values = ValueSerializer(many=True)
    timeline = TimelineSerializer(many=True)
    stats = StatItemSerializer(many=True)
    team = TeamMemberSerializer(many=True)
    spotlight = ArtisanSpotlightSerializer()
    newsletter = NewsletterSectionSerializer()
    settings = AboutPageSettingsSerializer()