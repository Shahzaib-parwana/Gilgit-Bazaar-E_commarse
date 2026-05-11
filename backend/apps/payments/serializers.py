from rest_framework import serializers
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'order', 'payment_method', 'transaction_id', 'amount', 'status', 'created_at']
        read_only_fields = ['transaction_id', 'status']


class StripePaymentIntentSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()