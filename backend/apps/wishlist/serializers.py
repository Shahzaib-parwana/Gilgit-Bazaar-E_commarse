# apps/wishlist/serializers.py
from rest_framework import serializers
from .models import Wishlist
from apps.products.serializers import ProductListSerializer, ProductVariantSerializer

class WishlistSerializer(serializers.ModelSerializer):
    product_detail = serializers.SerializerMethodField()
    variant_detail = ProductVariantSerializer(source='variant', read_only=True)
    
    class Meta:
        model = Wishlist
        fields = ['id', 'product', 'variant', 'product_detail', 'variant_detail', 'added_at']
        read_only_fields = ['user', 'added_at']
    
    def get_product_detail(self, obj):
        # Pass the request context to the ProductListSerializer
        # This is the key fix!
        serializer = ProductListSerializer(
            obj.product, 
            context=self.context  # ← Pass the context here
        )
        return serializer.data

class AddToWishlistSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    variant_id = serializers.IntegerField(required=False, allow_null=True)