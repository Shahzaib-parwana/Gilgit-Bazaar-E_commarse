from rest_framework import serializers
from .models import Order, OrderItem
from apps.products.serializers import ProductListSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    variant_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_id', 'variant_id', 'quantity', 'price', 'total_price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'order_number', 'user_email', 'status', 'payment_method',
                  'shipping_name', 'shipping_email', 'shipping_phone', 'shipping_address',
                  'shipping_city', 'shipping_state', 'shipping_zip', 'subtotal', 'shipping_cost',
                  'tax', 'total', 'is_paid', 'paid_at', 'items', 'created_at', 'notes']
        read_only_fields = ['order_number', 'is_paid', 'paid_at', 'created_at']


class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['payment_method', 'shipping_name', 'shipping_email', 'shipping_phone',
                  'shipping_address', 'shipping_city', 'shipping_state', 'shipping_zip',
                  'subtotal', 'shipping_cost', 'tax', 'total', 'notes', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(user=self.context['request'].user, **validated_data)
        
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        
        return order


class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status']