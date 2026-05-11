from django.contrib import admin
from django.utils.html import format_html
from .models import Cart, CartItem, Coupon, StoreSettings
import re
from django.utils.safestring import mark_safe


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ['product', 'variant', 'quantity', 'price_display', 'total_display']
    can_delete = True
    
    fields = ['product', 'variant', 'quantity', 'price_display', 'total_display']
    
    @admin.display(description='Price')
    def price_display(self, obj):
        return f'PKR {obj.price:,.2f}'
    
    @admin.display(description='Total')
    def total_display(self, obj):
        return format_html(
            '<strong>PKR {:,.2f}</strong>',
            float(obj.total_price)
        )


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = [
        'cart_id_display',
        'user_info',
        'items_count',
        'subtotal_display',
        'last_updated',
        'cart_age',
    ]
    
    list_filter = ['created_at', 'updated_at']
    search_fields = ['user__email', 'user__username', 'session_key']
    ordering = ['-updated_at']
    date_hierarchy = 'created_at'
    
    readonly_fields = ['created_at', 'updated_at', 'cart_summary']
    
    inlines = [CartItemInline]
    
    fieldsets = (
        ('Cart Information', {
            'fields': ('user', 'session_key')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
        ('Summary', {
            'fields': ('cart_summary',),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['clear_empty_carts', 'export_carts_csv']
    
    def _get_raw_subtotal(self, obj):
        """Extract numeric value from subtotal (handles PKR, commas, HTML)."""
        subtotal = obj.subtotal
        if hasattr(subtotal, '__html__'):  # it's a SafeString
            subtotal = str(subtotal)
        if isinstance(subtotal, str):
            # Remove any non-numeric characters except dot and minus
            clean = re.sub(r'[^\d.-]', '', subtotal)
            return float(clean) if clean else 0.0
        return float(subtotal)
        
    @admin.display(description='Cart ID')
    def cart_id_display(self, obj):
        return format_html(
            '<span style="font-family: monospace; background: #f3f4f6; '
            'padding: 4px 8px; border-radius: 4px; font-size: 12px;">#{}</span>',
            obj.id
        )
    
    @admin.display(description='User')
    def user_info(self, obj):
        if obj.user:
            return format_html(
                '<div style="line-height: 1.5;">'
                '<div style="font-weight: 600;">{}</div>'
                '<div style="font-size: 12px; color: #6b7280;">{}</div>'
                '</div>',
                obj.user.get_full_name() or obj.user.username,
                obj.user.email
            )
        else:
            return format_html(
                '<span style="color: #9ca3af; font-style: italic;">Guest</span><br>'
                '<span style="font-size: 11px; font-family: monospace;">{}</span>',
                obj.session_key[:20] if obj.session_key else 'N/A'
            )
    
    @admin.display(description='Items')
    def items_count(self, obj):
        count = obj.items.count()
        return mark_safe(
            f'<span style="background: {"#dbeafe" if count > 0 else "#f3f4f6"}; '
            f'color: {"#1e40af" if count > 0 else "#6b7280"}; padding: 4px 10px; '
            f'border-radius: 4px; font-size: 12px; font-weight: 600;">{count}</span>'
        )
    
    @admin.display(description='Subtotal')
    def subtotal_display(self, obj):
        subtotal = sum(float(item.total_price) for item in obj.items.all())
        return mark_safe(
            f'<span style="font-weight: 700; font-size: 15px; color: #059669;">PKR {subtotal:,.2f}</span>'
        )
    
    @admin.display(description='Last Updated')
    def last_updated(self, obj):
        from django.utils import timezone
        time_diff = timezone.now() - obj.updated_at
        
        if time_diff.days == 0:
            if time_diff.seconds < 3600:
                minutes = time_diff.seconds // 60
                relative = f'{minutes}m ago'
            else:
                hours = time_diff.seconds // 3600
                relative = f'{hours}h ago'
        elif time_diff.days == 1:
            relative = 'Yesterday'
        else:
            relative = f'{time_diff.days}d ago'
        
        return format_html(
            '<div style="line-height: 1.5;">'
            '<div style="font-weight: 500;">{}</div>'
            '<div style="font-size: 11px; color: #9ca3af;">{}</div>'
            '</div>',
            relative,
            obj.updated_at.strftime('%I:%M %p')
        )
    
    @admin.display(description='Age')
    def cart_age(self, obj):
        from django.utils import timezone
        age = (timezone.now() - obj.created_at).days
        
        if age == 0:
            color = '#10b981'
            text = 'Today'
        elif age <= 7:
            color = '#3b82f6'
            text = f'{age}d old'
        elif age <= 30:
            color = '#f59e0b'
            text = f'{age}d old'
        else:
            color = '#ef4444'
            text = 'Abandoned'
        
        return format_html(
            '<span style="color: {}; font-weight: 600;">{}</span>',
            color, text
        )
    

    @admin.display(description='Cart Summary')
    def cart_summary(self, obj):
        items_html = ''
        for item in obj.items.all():
            item_total = float(item.total_price)
            items_html += f'''
                <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 8px;">
                        <div style="font-weight: 500;">{item.product.name}</div>
                        {f'<div style="font-size: 12px; color: #6b7280;">{item.variant}</div>' if item.variant else ''}
                    </td>
                    <td style="padding: 10px 8px; text-align: center;">x{item.quantity}</td>
                    <td style="padding: 10px 8px; text-align: right; font-weight: 600;">PKR {item_total:,.2f}</td>
                </tr>
            '''
        
        subtotal = sum(float(item.total_price) for item in obj.items.all())
        
        return mark_safe(
            '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">'
            '<table style="width: 100%; border-collapse: collapse;">'
            '<thead style="background: #f9fafb;">'
            '<tr>'
            '<th style="padding: 10px 8px; text-align: left; font-size: 12px; color: #6b7280;">PRODUCT</th>'
            '<th style="padding: 10px 8px; text-align: center; font-size: 12px; color: #6b7280;">QTY</th>'
            '<th style="padding: 10px 8px; text-align: right; font-size: 12px; color: #6b7280;">TOTAL</th>'
            '</tr>'
            '</thead>'
            f'<tbody>{items_html}</tbody>'
            '<tfoot style="background: #f9fafb; border-top: 2px solid #d1d5db;">'
            '<tr>'
            '<td colspan="2" style="padding: 12px 8px; font-weight: 700;">Subtotal:</td>'
            f'<td style="padding: 12px 8px; text-align: right; color: #059669; font-weight: 700; font-size: 16px;">PKR {subtotal:,.2f}</td>'
            '</tr>'
            '</tfoot>'
            '</table>'
            '</div>'
        )
    @admin.action(description='Clear empty carts')
    def clear_empty_carts(self, request, queryset):
        empty_carts = queryset.filter(items__isnull=True)
        count = empty_carts.count()
        empty_carts.delete()
        self.message_user(request, f'{count} empty carts cleared.')
    
    @admin.action(description='📊 Export to CSV')
    def export_carts_csv(self, request, queryset):
        import csv
        from django.http import HttpResponse
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="carts.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Cart ID', 'User', 'Email', 'Items', 'Subtotal', 'Created', 'Updated'])
        
        for cart in queryset:
            writer.writerow([
                cart.id,
                cart.user.get_full_name() if cart.user else 'Guest',
                cart.user.email if cart.user else 'N/A',
                cart.total_items,
                cart.subtotal,
                cart.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                cart.updated_at.strftime('%Y-%m-%d %H:%M:%S')
            ])
        
        return response


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['cart', 'product', 'variant', 'quantity', 'price', 'total_price']
    list_filter = ['cart__user', 'product__category', 'created_at']
    search_fields = ['cart__user__email', 'product__name']
    

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ['code', 'discount_type', 'discount_value', 'valid_from', 'valid_to', 'active', 'used_count']
    list_filter = ['active', 'discount_type', 'valid_from', 'valid_to']
    search_fields = ['code']
    fieldsets = (
        ('Basic Info', {
            'fields': ('code', 'discount_type', 'discount_value')
        }),
        ('Validity', {
            'fields': ('valid_from', 'valid_to', 'active')
        }),
        ('Usage Limits', {
            'fields': ('usage_limit', 'used_count', 'per_user_limit', 'min_cart_amount')
        }),
    )

 

# Add to your admin.py
@admin.register(StoreSettings)
class StoreSettingsAdmin(admin.ModelAdmin):
    list_display = ['shipping_cost', 'tax_percentage', 'tax_name', 'is_active', 'updated_at']
    fieldsets = (
        ('Shipping Settings', {
            'fields': ('shipping_cost',)
        }),
        ('Tax Settings', {
            'fields': ('tax_percentage', 'tax_name')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
    )
    
    def has_add_permission(self, request):
        # Only allow one settings record
        if self.model.objects.exists():
            return False
        return super().has_add_permission(request)  