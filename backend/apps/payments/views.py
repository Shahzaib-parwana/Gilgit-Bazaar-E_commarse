import stripe
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import HttpResponse
from .models import Payment
from .serializers import PaymentSerializer, StripePaymentIntentSerializer
from apps.orders.models import Order
import json

stripe.api_key = settings.STRIPE_SECRET_KEY


class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(order__user=self.request.user)


class StripePaymentIntentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = StripePaymentIntentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        order_id = serializer.validated_data['order_id']
        order = get_object_or_404(Order, id=order_id, user=request.user)

        if order.is_paid:
            return Response({'error': 'Order already paid'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Create Stripe PaymentIntent
            intent = stripe.PaymentIntent.create(
                amount=int(order.total * 100),  # Amount in cents
                currency='usd',
                metadata={
                    'order_id': order.id,
                    'order_number': order.order_number
                }
            )

            return Response({
                'clientSecret': intent.client_secret,
                'publishableKey': settings.STRIPE_PUBLIC_KEY
            })

        except stripe.error.StripeError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class StripeWebhookView(APIView):
    permission_classes = []

    def post(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError:
            return HttpResponse(status=400)
        except stripe.error.SignatureVerificationError:
            return HttpResponse(status=400)

        # Handle the event
        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            self.handle_successful_payment(payment_intent)
        
        elif event['type'] == 'payment_intent.payment_failed':
            payment_intent = event['data']['object']
            self.handle_failed_payment(payment_intent)

        return HttpResponse(status=200)

    def handle_successful_payment(self, payment_intent):
        from datetime import datetime
        
        order_id = payment_intent['metadata']['order_id']
        order = Order.objects.get(id=order_id)
        
        # Create payment record
        Payment.objects.create(
            order=order,
            payment_method='stripe',
            transaction_id=payment_intent['id'],
            amount=payment_intent['amount'] / 100,
            status='completed',
            payment_response=payment_intent
        )
        
        # Update order
        order.is_paid = True
        order.paid_at = datetime.now()
        order.payment_id = payment_intent['id']
        order.status = 'processing'
        order.save()
        
        # Send confirmation email
        from apps.notifications.tasks import send_payment_confirmation_email
        send_payment_confirmation_email.delay(order.id)

    def handle_failed_payment(self, payment_intent):
        order_id = payment_intent['metadata']['order_id']
        order = Order.objects.get(id=order_id)
        
        Payment.objects.create(
            order=order,
            payment_method='stripe',
            transaction_id=payment_intent['id'],
            amount=payment_intent['amount'] / 100,
            status='failed',
            payment_response=payment_intent
        )


class CashOnDeliveryView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('order_id')
        order = get_object_or_404(Order, id=order_id, user=request.user)

        if order.payment_method != 'cod':
            return Response({'error': 'Invalid payment method'}, status=status.HTTP_400_BAD_REQUEST)

        # Create COD payment record
        import uuid
        Payment.objects.create(
            order=order,
            payment_method='cod',
            transaction_id=f"COD-{uuid.uuid4().hex[:12].upper()}",
            amount=order.total,
            status='pending'
        )

        order.status = 'processing'
        order.save()

        # Send order confirmation
        from apps.notifications.tasks import send_order_confirmation_email
        send_order_confirmation_email.delay(order.id)

        return Response({'message': 'Order placed successfully with Cash on Delivery'})