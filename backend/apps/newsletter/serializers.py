from rest_framework import serializers
from .models import NewsletterSubscriber, NewsletterEmail

class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ['id', 'email', 'subscribed_at', 'is_active', 'is_verified']
        read_only_fields = ['id', 'subscribed_at', 'verification_token', 'is_verified']

class NewsletterSubscribeSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    
    def validate_email(self, value):
        # Check if email already exists and is active
        if NewsletterSubscriber.objects.filter(email=value, is_active=True, is_verified=True).exists():
            raise serializers.ValidationError("This email is already subscribed!")
        return value

class NewsletterUnsubscribeSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

class NewsletterEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterEmail
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'sent_at', 'status', 'recipients_count', 'success_count', 'failed_count']

class BulkEmailSerializer(serializers.Serializer):
    subject = serializers.CharField(max_length=200)
    message = serializers.CharField()