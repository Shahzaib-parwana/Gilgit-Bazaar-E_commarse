from rest_framework import serializers
from .models import Cart, CartItem, Coupon, StoreSettings
from apps.products.serializers import ProductListSerializer


class CouponSerializer(serializers.ModelSerializer):
    discount_display = serializers.SerializerMethodField()
    
    class Meta:
        model = Coupon
        fields = ['id', 'code', 'discount_type', 'discount_value', 'discount_display', 'valid_to', 'min_cart_amount']
    
    def get_discount_display(self, obj):
        return obj.get_display_text()


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    variant_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'variant_id', 'quantity', 'price', 'total_price']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.IntegerField(read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    coupon_discount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    coupon = CouponSerializer(read_only=True)
    
    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_items', 'subtotal', 'coupon_discount', 'total', 'coupon', 'created_at', 'updated_at']


# For promo code validation requests/responses
class CouponApplySerializer(serializers.Serializer):
    code = serializers.CharField(max_length=50, required=True)
    
    def validate_code(self, value):
        return value.upper().strip()


class CouponResponseSerializer(serializers.Serializer):
    valid = serializers.BooleanField()
    code = serializers.CharField(required=False)
    discount_type = serializers.CharField(required=False)
    discount_value = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    discount_amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    final_subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    message = serializers.CharField()
    
    
# Add this to your serializers.py


class StoreSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoreSettings
        fields = ['id', 'shipping_cost', 'tax_percentage', 'tax_name', 'is_active', 'updated_at']