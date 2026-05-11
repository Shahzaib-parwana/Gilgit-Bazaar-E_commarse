from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentViewSet, StripePaymentIntentView, StripeWebhookView, CashOnDeliveryView

router = DefaultRouter()
router.register(r'', PaymentViewSet, basename='payment')

urlpatterns = [
    path('', include(router.urls)),
    path('stripe/create-intent/', StripePaymentIntentView.as_view(), name='stripe-create-intent'),
    path('stripe/webhook/', StripeWebhookView.as_view(), name='stripe-webhook'),
    path('cod/', CashOnDeliveryView.as_view(), name='cash-on-delivery'),
]