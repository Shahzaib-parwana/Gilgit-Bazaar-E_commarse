from django.db import models
from apps.core.models import TimeStampedModel
from apps.orders.models import Order


class Payment(TimeStampedModel):
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]

    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    payment_method = models.CharField(max_length=50)
    transaction_id = models.CharField(max_length=200, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    payment_response = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f"Payment {self.transaction_id} - {self.order.order_number}"

    class Meta:
        db_table = 'payments'