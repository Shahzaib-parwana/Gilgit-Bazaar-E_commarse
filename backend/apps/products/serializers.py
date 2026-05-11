from rest_framework import serializers
from .models import Category, Product, ProductImage, ProductVariant, BundleItem


class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'parent', 'children', 'product_count', 'is_active']

    def get_children(self, obj):
        if obj.children.exists():
            return CategorySerializer(obj.children.filter(is_active=True), many=True).data
        return []

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()



class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary']


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['id', 'color', 'size', 'price', 'stock', 'sku']


class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    primary_image = serializers.SerializerMethodField()
    discount_percentage = serializers.IntegerField(read_only=True)
    stock = serializers.IntegerField(read_only=True)
    is_bundle = serializers.BooleanField(read_only=True) 

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'category_name', 'price', 'compare_price', 
                  'discount_percentage', 'primary_image', 'in_stock', 'stock', 'is_featured','is_bundle']

    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        if primary:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(primary.image.url)
        return None

class BundleItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_slug = serializers.CharField(source='product.slug', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    product_primary_image = serializers.SerializerMethodField()

    class Meta:
        model = BundleItem
        fields = ['id', 'product', 'product_name', 'product_slug', 'product_price', 'product_primary_image', 'quantity']

    def get_product_primary_image(self, obj):
        primary = obj.product.images.filter(is_primary=True).first()
        if primary:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(primary.image.url)
        return None        
    
    
class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
        # NEW: bundle items field
    bundle_items = BundleItemSerializer(many=True, read_only=True)
    available_bundles = serializers.IntegerField(read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'description', 'category', 'price', 'compare_price',
                  'discount_percentage', 'stock', 'sku', 'images', 'variants', 'weight', 
                  'is_featured', 'in_stock', 'created_at','is_bundle', 'bundle_items', 'available_bundles']
        
        

