from django.db import models
from django.utils.text import slugify
from apps.core.models import TimeStampedModel

class Category(TimeStampedModel):
    name = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    is_active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'categories'
        verbose_name_plural = 'Categories'
        ordering = ['name']


class Product(TimeStampedModel):
    name = models.CharField(max_length=300)
    slug = models.SlugField(max_length=300, unique=True, blank=True)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    compare_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock = models.PositiveIntegerField(default=0)
    sku = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    weight = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True, help_text='Weight in kg')
    is_bundle = models.BooleanField(default=False, help_text="Is this a gift hamper/bundle?")
    bundle_discount = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, 
                                          help_text="Optional discount percentage for the bundle")
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
         

    @property
    def in_stock(self):
        return self.stock > 0

    @property
    def discount_percentage(self):
        if self.compare_price and self.compare_price > self.price:
            return int(((self.compare_price - self.price) / self.compare_price) * 100)
        return 0

    def __str__(self):
        return self.name
    @property
    def is_gift_hamper(self):
        return self.is_bundle

    # NEW: calculate available bundles based on component stock
    def available_bundles(self):
        """Returns max number of bundles that can be made from current component stock.
        If not a bundle, returns self.stock."""
        if not self.is_bundle:
            return self.stock
        max_bundles = None
        for item in self.bundle_items.all():
            needed = item.quantity
            available = item.product.stock
            possible = available // needed if needed else float('inf')
            if max_bundles is None or possible < max_bundles:
                max_bundles = possible
        return max_bundles or 0

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'products'
        ordering = ['-created_at']


class BundleItem(TimeStampedModel):
    bundle = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='bundle_items',
        limit_choices_to={'is_bundle': True}
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name='in_bundles'
    )
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        db_table = 'bundle_items'                     # ← Fix table name
        unique_together = [['bundle', 'product']]

    def __str__(self):
        return f"{self.bundle.name} x{self.quantity} includes {self.product.name}"

   
class ProductImage(TimeStampedModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    alt_text = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.product.name} - Image"

    class Meta:
        db_table = 'product_images'
        ordering = ['-is_primary']


class ProductVariant(TimeStampedModel):
    COLOR_CHOICES = [
        ('red', 'Red'),
        ('blue', 'Blue'),
        ('green', 'Green'),
        ('black', 'Black'),
        ('white', 'White'),
    ]
    
    SIZE_CHOICES = [
        ('xs', 'Extra Small'),
        ('s', 'Small'),
        ('m', 'Medium'),
        ('l', 'Large'),
        ('xl', 'Extra Large'),
    ]

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    color = models.CharField(max_length=50, choices=COLOR_CHOICES, blank=True)
    size = models.CharField(max_length=50, choices=SIZE_CHOICES, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock = models.PositiveIntegerField(default=0)
    sku = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return f"{self.product.name} - {self.color} - {self.size}"

    class Meta:
        db_table = 'product_variants'
        unique_together = ['product', 'color', 'size']