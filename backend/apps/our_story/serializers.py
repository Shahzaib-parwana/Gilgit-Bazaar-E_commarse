from rest_framework import serializers
from .models import (
    HeroSection, IntroSection, Stat, VideoSection, 
    ArtisanStory, ProcessStep, CTASection, StorySettings
)

class HeroSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroSection
        fields = ['id', 'eyebrow_text', 'title', 'subtitle', 'background_image', 'is_active']

class IntroSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = IntroSection
        fields = ['id', 'title', 'highlighted_word', 'text_paragraph_1', 'text_paragraph_2', 
                  'quote_text', 'image', 'is_active']

class StatSerializer(serializers.ModelSerializer):
    icon_name_display = serializers.CharField(source='get_icon_name_display', read_only=True)
    
    class Meta:
        model = Stat
        fields = ['id', 'icon_name', 'icon_name_display', 'value', 'label', 'order', 'is_active']

class VideoSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoSection
        fields = ['id', 'title', 'highlighted_word', 'subtitle', 'thumbnail_image', 
                  'youtube_video_id', 'is_active']

class ArtisanStorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtisanStory
        fields = ['id', 'category', 'badge_text', 'title', 'story_text', 'quote_text', 
                  'author_name', 'author_role', 'author_avatar', 'story_image', 
                  'reverse_layout', 'order', 'is_active']

class ProcessStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcessStep
        fields = ['id', 'step_number', 'title', 'description', 'icon_image', 'order', 'is_active']

class CTASectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CTASection
        fields = ['id', 'title', 'highlighted_word', 'text', 'button_text', 
                  'button_link', 'is_active']

class StorySettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StorySettings
        fields = ['id', 'section_eyebrow_text', 'section_title', 'section_title_word_1', 
                  'section_title_word_2', 'section_subtitle', 'process_eyebrow_text', 
                  'process_title', 'process_title_word', 'process_subtitle', 'is_active']

class OurStoryDataSerializer(serializers.Serializer):
    """Combined serializer for all story page data"""
    hero = HeroSectionSerializer()
    intro = IntroSectionSerializer()
    stats = StatSerializer(many=True)
    video = VideoSectionSerializer()
    stories = ArtisanStorySerializer(many=True)
    process_steps = ProcessStepSerializer(many=True)
    cta = CTASectionSerializer()
    settings = StorySettingsSerializer()