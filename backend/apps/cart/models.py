# carts/models.py
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from apps.products.models import Product, ProductVariant
from apps.core.models import TimeStampedModel


class Cart(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    session_key = models.CharField(max_length=40, null=True, blank=True)
    # Add this field to store applied coupon
    coupon = models.ForeignKey('Coupon', on_delete=models.SET_NULL, null=True, blank=True, related_name='carts')
    coupon_discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"Cart {self.id}"

    @property
    def total_items(self):
        return sum(item.quantity for item in self.items.all())

    @property
    def subtotal(self):
        return sum(item.total_price for item in self.items.all())
    
    @property
    def total(self):
        """Final total after coupon discount (no shipping)"""
        return self.subtotal - self.coupon_discount

    class Meta:
        db_table = 'carts'


class CartItem(TimeStampedModel):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)

    @property
    def price(self):
        if self.variant and self.variant.price:
            return self.variant.price
        return self.product.price

    @property
    def total_price(self):
        return self.price * self.quantity

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"

    class Meta:
        db_table = 'cart_items'
        unique_together = ['cart', 'product', 'variant']


class Coupon(TimeStampedModel):
    DISCOUNT_TYPE_CHOICES = [
        ('percentage', 'Percentage (%)'),
        ('fixed', 'Fixed Amount'),
    ]
    
    code = models.CharField(max_length=50, unique=True, db_index=True)
    discount_type = models.CharField(max_length=10, choices=DISCOUNT_TYPE_CHOICES, default='percentage')
    discount_value = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    
    # Validity period
    valid_from = models.DateTimeField(default=timezone.now)
    valid_to = models.DateTimeField()
    
    # Usage limits
    usage_limit = models.PositiveIntegerField(default=1, help_text="Max number of times this code can be used")
    used_count = models.PositiveIntegerField(default=0)
    
    # Minimum purchase requirement
    min_cart_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    active = models.BooleanField(default=True)
    
    # Optional: one-time per user
    per_user_limit = models.PositiveIntegerField(default=1, help_text="How many times a single user can use this")
    
    class Meta:
        db_table = 'coupons'
        indexes = [
            models.Index(fields=['code', 'active']),
            models.Index(fields=['valid_from', 'valid_to']),
        ]
    
    def __str__(self):
        return f"{self.code} - {self.discount_value}{'%' if self.discount_type == 'percentage' else 'Rs'}"
    
    def is_valid(self, cart_total=0, user=None):
        """Check if coupon is currently usable"""
        now = timezone.now()
        
        conditions = [
            self.active,
            self.valid_from <= now <= self.valid_to,
            self.used_count < self.usage_limit,
            cart_total >= self.min_cart_amount
        ]
        
        return all(conditions)
    
    def calculate_discount(self, cart_total):
        """Calculate discount amount based on type"""
        if self.discount_type == 'percentage':
            return (cart_total * self.discount_value) / 100
        else:
            return min(self.discount_value, cart_total)
    
    def apply_usage(self):
        """Increment usage counter when coupon is used"""
        self.used_count += 1
        self.save(update_fields=['used_count'])
    
    def get_display_text(self):
        """For frontend display"""
        if self.discount_type == 'percentage':
            return f"{self.discount_value}% OFF"
        else:
            return f"PKR {self.discount_value} OFF"
        
        
# Add this to your existing carts/models.py

class StoreSettings(models.Model):
    """Simple store settings for shipping and tax"""
    TAX_TYPE_CHOICES = [
        ('gst', 'GST'),
        ('vat', 'VAT'),
        ('sales_tax', 'Sales Tax'),
        ('pst', 'PST'),
    ]
    
    shipping_cost = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=300,
        help_text="Standard shipping cost in PKR"
    )
    
    tax_percentage = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Tax percentage (e.g., 2 for 2%)"
    )
    
    tax_name = models.CharField(
        max_length=20, choices=TAX_TYPE_CHOICES, default='GST')
    
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'store_settings'
        verbose_name = 'Store Setting'
        verbose_name_plural = 'Store Settings'
    
    def __str__(self):
        return f"Shipping: PKR {self.shipping_cost} | Tax: {self.tax_percentage}% ({self.tax_name})"
    
    @classmethod
    def get_settings(cls):
        """Get the active settings, create default if none exist"""
        settings = cls.objects.filter(is_active=True).first()
        if not settings:
            settings = cls.objects.create(
                shipping_cost=200,
                tax_percentage=1,
                tax_name="GST",
                is_active=True
            )
        return settings        
    
    