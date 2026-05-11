# apps/reviews/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Review, ReviewHelpfulVote

User = get_user_model()


class ReviewImageUploadSerializer(serializers.Serializer):
    """Serializer for image upload"""
    images = serializers.ListField(
        child=serializers.ImageField(),
        max_length=5,
        help_text="Upload up to 5 images"
    )


class ReviewSerializer(serializers.ModelSerializer):
    """
    Main Review Serializer
    """
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_avatar = serializers.SerializerMethodField()
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_slug = serializers.CharField(source='product.slug', read_only=True)
    product_primary_image = serializers.SerializerMethodField()
    is_helpful_by_user = serializers.SerializerMethodField()
    can_modify = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    
    class Meta:
        model = Review
        fields = [
            'id', 'user', 'user_name', 'user_email', 'user_avatar',
            'product', 'product_name', 'product_slug', 'product_primary_image',
            'order', 'rating', 'title', 'comment', 'images',
            'status', 'helpful_count', 'is_helpful_by_user',
            'can_modify', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'user_name', 'user_email', 'user_avatar',
            'product_name', 'product_slug', 'product_primary_image',
            'status', 'helpful_count', 'is_helpful_by_user', 
            'can_modify', 'created_at', 'updated_at'
        ]
    
    def get_user_avatar(self, obj):
        """Get user avatar URL"""
        if hasattr(obj.user, 'profile') and obj.user.profile.avatar:
            return obj.user.profile.avatar.url
        return None
    
    def get_product_primary_image(self, obj):
        """Get product primary image"""
        primary = obj.product.images.filter(is_primary=True).first()
        if primary:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(primary.image.url)
        return None
    
    def get_is_helpful_by_user(self, obj):
        """Check if current user found this review helpful"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.helpful_votes.filter(id=request.user.id).exists()
        return False
    
    def get_can_modify(self, obj):
        """Check if current user can modify this review"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return request.user == obj.user or request.user.is_staff
        return False
    def get_images(self, obj):
        """Convert relative media paths to absolute URLs"""
        if not obj.images:
            return []
            
        request = self.context.get('request')
        processed_images = []
        
        for image_path in obj.images:
            if not image_path:
                continue
            # If the path is already absolute, keep it
            if image_path.startswith(('http://', 'https://')):
                processed_images.append(image_path)
            elif request:
                # This builds http://domain.com/media/...
                processed_images.append(request.build_absolute_uri(image_path))
            else:
                # Fallback if request context is missing
                processed_images.append(image_path)
                
        return processed_images


class ReviewCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating/updating reviews
    """
    class Meta:
        model = Review
        fields = ['product', 'order', 'rating', 'title', 'comment', 'images']
    
    def validate(self, data):
        """Check if user has purchased the product"""
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("You must be logged in to write a review")
        
        product = data.get('product')
        
        # Check if user already reviewed this product
        if Review.objects.filter(user=request.user, product=product).exists():
            raise serializers.ValidationError("You have already reviewed this product")
        
        # Check if user has purchased and received the product
        has_purchased = request.user.orders.filter(
            items__product=product,
            status='delivered'
        ).exists()
        
        if not has_purchased:
            raise serializers.ValidationError(
                "You can only review products you have purchased and received"
            )
        
        return data
    
    def validate_rating(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value
    
    def validate_images(self, value):
        if len(value) > 5:
            raise serializers.ValidationError("Maximum 5 images allowed")
        return value


class ReviewUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating reviews (only if not approved yet)
    """
    class Meta:
        model = Review
        fields = ['rating', 'title', 'comment', 'images']
    
    def validate_rating(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value
    
    def validate_images(self, value):
        if len(value) > 5:
            raise serializers.ValidationError("Maximum 5 images allowed")
        return value
    
    def update(self, instance, validated_data):
        # Only allow update if review is pending
        if instance.status != 'pending':
            raise serializers.ValidationError("Only pending reviews can be edited")
        return super().update(instance, validated_data)


class ReviewHelpfulVoteSerializer(serializers.ModelSerializer):
    """
    Serializer for helpful votes
    """
    class Meta:
        model = ReviewHelpfulVote
        fields = ['id', 'review', 'user', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']


class ReviewStatsSerializer(serializers.Serializer):
    """
    Serializer for review statistics
    """
    average_rating = serializers.FloatField()
    total_reviews = serializers.IntegerField()
    rating_distribution = serializers.DictField()
    rating_percentages = serializers.DictField()


class ReviewModerationSerializer(serializers.Serializer):
    """
    Serializer for admin moderation
    """
    action = serializers.ChoiceField(choices=['approve', 'reject'])
    notes = serializers.CharField(required=False, allow_blank=True)


class CanReviewResponseSerializer(serializers.Serializer):
    """
    Response serializer for checking if user can review
    """
    can_review = serializers.BooleanField()
    has_purchased = serializers.BooleanField()
    already_reviewed = serializers.BooleanField()