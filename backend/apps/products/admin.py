from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Sum, Count, Avg
from django.urls import reverse
from .models import Category, Product, ProductImage, ProductVariant, BundleItem
from rangefilter.filters import NumericRangeFilter
from django.utils.safestring import mark_safe


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['image', 'alt_text', 'is_primary', 'image_preview']
    readonly_fields = ['image_preview']
    
    @admin.display(description='Preview')
    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="width: 100px; height: 100px; '
                'object-fit: cover; border-radius: 8px;" />',
                obj.image.url
            )
        return '—'


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1
    fields = ['color', 'size', 'price', 'stock', 'sku']
    
class BundleItemInline(admin.TabularInline):
    model = BundleItem
    fk_name = 'bundle'
    extra = 1
    autocomplete_fields = ['product']
    fields = ['product', 'quantity']
    verbose_name = "Bundle Item"
    verbose_name_plural = "Bundle Items"    


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = [
        'category_image_preview',
        'name',
        'slug',
        'parent_display',
        'product_count_display',
        'is_active_badge',
        'created_date',
    ]
    
    list_filter = ['is_active', 'created_at', 'parent']
    search_fields = ['name', 'description', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['name']
    
    readonly_fields = ['created_at', 'updated_at', 'category_stats']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'description', 'image', 'parent')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
        ('Statistics', {
            'fields': ('category_stats',),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['activate_categories', 'deactivate_categories']
    
    @admin.display(description='Image')
    def category_image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; '
                'object-fit: cover; border-radius: 8px;" />',
                obj.image.url
            )
        return mark_safe(
            '<div style="width: 50px; height: 50px; background: #e5e7eb; '
            'border-radius: 8px; display: flex; align-items: center; '
            'justify-content: center; color: #9ca3af;">No Image</div>'
        )
    
    @admin.display(description='Parent Category')
    def parent_display(self, obj):
        if obj.parent:
            return obj.parent.name
        return '—'
    
    @admin.display(description='Products')
    def product_count_display(self, obj):
        count = obj.products.filter(is_active=True).count()
        if count > 0:
            url = reverse('admin:products_product_changelist') + f'?category__id__exact={obj.id}'
            return format_html(
                '<a href="{}" style="color: #2563eb; font-weight: 600;">{} products</a>',
                url,
                count
            )
        return '0 products'
    
    @admin.display(description='Active', boolean=True)
    def is_active_badge(self, obj):
        return obj.is_active
    
    @admin.display(description='Created')
    def created_date(self, obj):
        return obj.created_at.strftime('%b %d, %Y')
    
    @admin.display(description='Category Statistics')
    def category_stats(self, obj):
        products = obj.products.filter(is_active=True)
        total_products = products.count()
        total_stock = products.aggregate(Sum('stock'))['stock__sum'] or 0
        avg_price = products.aggregate(Avg('price'))['price__avg'] or 0
        
        return format_html(
            '<div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">'
            '<table style="width: 100%;">'
            '<tr><td><strong>Products:</strong></td><td>{}</td></tr>'
            '<tr><td><strong>Total Stock:</strong></td><td>{}</td></tr>'
            '<tr><td><strong>Avg Price:</strong></td><td>PKR {:,.2f}</td></tr>'
            '</table>'
            '</div>',
            total_products,
            total_stock,
            avg_price
        )
    
    @admin.action(description='Activate selected categories')
    def activate_categories(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} categories activated.')
    
    @admin.action(description='Deactivate selected categories')
    def deactivate_categories(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} categories deactivated.')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'product_image_preview',
        'name',
        'category_display',
        'price_display',
        'stock_display',
        'sold_count',
        'is_featured_badge',
        'is_active_badge',
        'created_date',
    ]
    
    list_filter = [
        'is_active',
        'is_featured',
        'is_bundle',
        'category',
        'created_at',
        ('price', NumericRangeFilter),
        ('stock', NumericRangeFilter),
    ]
    
    search_fields = ['name', 'description', 'sku', 'category__name']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['-created_at']
    
    readonly_fields = [
        'created_at',
        'updated_at',
        'product_stats',
        'revenue_stats',
    ]
    
    inlines = [ProductImageInline, ProductVariantInline, BundleItemInline] 
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'description', 'category')
        }),
        ('Pricing', {
            'fields': ('price', 'compare_price')
        }),
        ('Inventory', {
            'fields': ('stock', 'sku', 'weight')
        }),
        ('Bundle Settings', {           # new fieldset
            'fields': ('is_bundle', 'bundle_discount'),
            'classes': ('collapse',),
            'description': 'Enable if this product is a gift hamper/bundle.'
        }),
        ('Status', {
            'fields': ('is_active', 'is_featured')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
        ('Statistics', {
            'fields': ('product_stats', 'revenue_stats'),
            'classes': ('collapse',)
        }),
    )
    
    actions = [
        'mark_as_featured',
        'remove_featured',
        'activate_products',
        'deactivate_products',
        'duplicate_products',
        'export_products_csv',
    ]
    
    @admin.display(description='Image')
    def product_image_preview(self, obj):
        primary_image = obj.images.filter(is_primary=True).first()
        if primary_image:
            return format_html(
                '<img src="{}" style="width: 60px; height: 60px; '
                'object-fit: cover; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" />',
                primary_image.image.url
            )
        return mark_safe(
            '<div style="width: 60px; height: 60px; background: #e5e7eb; '
            'border-radius: 8px; display: flex; align-items: center; '
            'justify-content: center; color: #9ca3af; font-size: 10px;">No Image</div>'
        )
    
    @admin.display(description='Category')
    def category_display(self, obj):
        return format_html(
            '<span style="background: #dbeafe; color: #1e40af; padding: 4px 8px; '
            'border-radius: 4px; font-size: 12px; font-weight: 500;">{}</span>',
            obj.category.name
        )
    
    

    @admin.display(description='Price')
    def price_display(self, obj):
        html = f'<div><strong>PKR {obj.price:,.2f}</strong>'
        
        if obj.compare_price and obj.compare_price > obj.price:
            discount = int(((obj.compare_price - obj.price) / obj.compare_price) * 100)
            html += f'<br><small style="text-decoration: line-through; color: #9ca3af;">PKR {obj.compare_price:,.2f}</small>'
            html += f'<span style="background: #fee2e2; color: #991b1b; padding: 2px 6px; border-radius: 3px; font-size: 10px; margin-left: 4px;">-{discount}%</span>'
        
        html += '</div>'
        
        return mark_safe(html)
    
    @admin.display(description='Stock')
    def stock_display(self, obj):
        if obj.stock == 0:
            color = '#ef4444'
            bg = '#fee2e2'
            text = 'Out of Stock'
        elif obj.stock <= 10:
            color = '#f59e0b'
            bg = '#fef3c7'
            text = f'{obj.stock} left'
        else:
            color = '#10b981'
            bg = '#d1fae5'
            text = f'{obj.stock} in stock'
        
        return format_html(
            '<span style="background: {}; color: {}; padding: 4px 8px; '
            'border-radius: 4px; font-size: 12px; font-weight: 500;">{}</span>',
            bg, color, text
        )
    
    @admin.display(description='Sold')
    def sold_count(self, obj):
        from apps.orders.models import OrderItem
        sold = OrderItem.objects.filter(
            product=obj,
            order__status='delivered'
        ).aggregate(Sum('quantity'))['quantity__sum'] or 0
        
        return format_html(
            '<span style="font-weight: 600; color: #059669;">{}</span>',
            sold
        )
    
    @admin.display(description='Featured', boolean=True)
    def is_featured_badge(self, obj):
        return obj.is_featured
    
    @admin.display(description='Active', boolean=True)
    def is_active_badge(self, obj):
        return obj.is_active
    
    @admin.display(description='Created')
    def created_date(self, obj):
        return obj.created_at.strftime('%b %d, %Y')
    
    @admin.display(description='Product Statistics')
    def product_stats(self, obj):
        from apps.orders.models import OrderItem
        
        order_items = OrderItem.objects.filter(product=obj)
        total_sold = order_items.aggregate(Sum('quantity'))['quantity__sum'] or 0
        total_orders = order_items.values('order').distinct().count()
        
        return format_html(
            '<div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">'
            '<table style="width: 100%;">'
            '<tr><td><strong>Units Sold:</strong></td><td>{}</td></tr>'
            '<tr><td><strong>Orders:</strong></td><td>{}</td></tr>'
            '<tr><td><strong>Current Stock:</strong></td><td>{}</td></tr>'
            '<tr><td><strong>Variants:</strong></td><td>{}</td></tr>'
            '</table>'
            '</div>',
            total_sold,
            total_orders,
            obj.stock,
            obj.variants.count()
        )
    
    @admin.display(description='Revenue Statistics')
    def revenue_stats(self, obj):
        from apps.orders.models import OrderItem
        
        order_items = OrderItem.objects.filter(product=obj, order__is_paid=True)
        total_revenue = sum(item.price * item.quantity for item in order_items)
        
        return format_html(
            '<div style="background: #ecfdf5; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">'
            '<div style="font-size: 24px; font-weight: bold; color: #059669;">PKR {:,.2f}</div>'
            '<div style="color: #047857; font-size: 12px; margin-top: 4px;">Total Revenue</div>'
            '</div>',
            total_revenue
        )
    
    @admin.action(description='⭐ Mark as featured')
    def mark_as_featured(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f'{updated} products marked as featured.')
    
    @admin.action(description='Remove featured status')
    def remove_featured(self, request, queryset):
        updated = queryset.update(is_featured=False)
        self.message_user(request, f'{updated} products removed from featured.')
    
    @admin.action(description='Activate selected products')
    def activate_products(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} products activated.')
    
    @admin.action(description='Deactivate selected products')
    def deactivate_products(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} products deactivated.')
    
    @admin.action(description='Duplicate selected products')
    def duplicate_products(self, request, queryset):
        for product in queryset:
            product.pk = None
            product.name = f"{product.name} (Copy)"
            product.slug = f"{product.slug}-copy"
            product.sku = f"{product.sku}-COPY"
            product.save()
        
        self.message_user(request, f'{queryset.count()} products duplicated.')
    
    @admin.action(description='Export to CSV')
    def export_products_csv(self, request, queryset):
        import csv
        from django.http import HttpResponse
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="products.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Name', 'SKU', 'Category', 'Price', 'Stock', 'Status'])
        
        for product in queryset:
            writer.writerow([
                product.name,
                product.sku,
                product.category.name,
                product.price,
                product.stock,
                'Active' if product.is_active else 'Inactive'
            ])
        
        return response
    @admin.display(description='Bundle', boolean=True)
    def is_bundle_badge(self, obj):
        return obj.is_bundle

    @admin.display(description='Available Bundles (from components)')
    def available_bundles_display(self, obj):
        if obj.is_bundle:
            count = obj.available_bundles()
            if count is None:
                return "N/A (no bundle items defined)"
            return format_html('<span style="font-weight:bold;color:#059669;">{}</span>', count)
        return "—"


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['image_preview', 'product', 'is_primary', 'alt_text', 'created_at']
    list_filter = ['is_primary', 'created_at']
    search_fields = ['product__name', 'alt_text']
    
    @admin.display(description='Preview')
    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="width: 80px; height: 80px; '
                'object-fit: cover; border-radius: 8px;" />',
                obj.image.url
            )
        return '—'


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ['product', 'color', 'size', 'price', 'stock', 'sku']
    list_filter = ['color', 'size', 'product__category']
    search_fields = ['product__name', 'sku', 'color', 'size']
    
@admin.register(BundleItem)
class BundleItemAdmin(admin.ModelAdmin):
    list_display = ['bundle', 'product', 'quantity']
    list_filter = ['bundle__category']
    search_fields = ['bundle__name', 'product__name']    