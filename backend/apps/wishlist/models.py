# apps/wishlist/models.py
from django.db import models
from django.conf import settings
from apps.products.models import Product
from apps.products.models import ProductVariant

class Wishlist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wishlists')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='wishlist_items')
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, null=True, blank=True, related_name='wishlist_items')
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'product', 'variant']
        ordering = ['-added_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.product.name}"