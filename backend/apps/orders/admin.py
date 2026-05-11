from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from django.db.models import Sum, Count, Q
from django.urls import reverse
from django.utils import timezone
from .models import Order, OrderItem
import csv
from django.http import HttpResponse
from rangefilter.filters import NumericRangeFilter


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'variant', 'quantity', 'price', 'total_price_display']
    can_delete = False
    
    fields = ['product', 'variant', 'quantity', 'price', 'total_price_display']
    
    @admin.display(description='Total')
    def total_price_display(self, obj):
        formatted = f"{obj.total_price:,.2f}"
        return format_html(
            
            '<strong>PKR {}</strong>',
            formatted
        )


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'order_number_display',
        'customer_info',
        'order_status_badge',
        'payment_method_badge',
        'payment_status_badge',
        'total_amount',
        'items_count',
        'order_date',
    ]
    
    list_filter = [
        'status',
        'payment_method',
        'is_paid',
        'created_at',
        ('total', NumericRangeFilter),
        'shipping_city',
        'shipping_state',
    ]
    
    search_fields = [
        'order_number',
        'user__email',
        'user__first_name',
        'user__last_name',
        'shipping_email',
        'shipping_name',
        'shipping_phone',
    ]
    
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    
    readonly_fields = [
        'order_number',
        'created_at',
        'updated_at',
        'order_timeline',
        'customer_details',
        'order_summary',
        'payment_details',
    ]
    
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('Order Information', {
            'fields': ('order_number', 'user', 'status', 'payment_method', 'notes')
        }),
        ('Shipping Details', {
            'fields': (
                'shipping_name',
                'shipping_email',
                'shipping_phone',
                'shipping_address',
                ('shipping_city', 'shipping_state', 'shipping_zip'),
            )
        }),
        ('Pricing', {
            'fields': (
                ('subtotal', 'shipping_cost'),
                ('tax', 'total'),
            )
        }),
        ('Payment Information', {
            'fields': ('is_paid', 'paid_at', 'payment_id'),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
        ('Additional Information', {
            'fields': ('order_timeline', 'customer_details', 'order_summary', 'payment_details'),
            'classes': ('collapse',)
        }),
    )
    
    actions = [
        'mark_as_processing',
        'mark_as_shipped',
        'mark_as_delivered',
        'mark_as_cancelled',
        'send_invoice_email',
        'export_orders_csv',
        'generate_shipping_labels',
    ]
    
    # Custom display methods
    @admin.display(description='Order #')
    def order_number_display(self, obj):
        url = reverse('admin:orders_order_change', args=[obj.pk])
        return format_html(
            '<a href="{}" style="font-weight: 600; color: #2563eb; '
            'text-decoration: none;">{}</a>',
            url,
            obj.order_number
        )
    
    @admin.display(description='Customer')
    def customer_info(self, obj):
        return format_html(
            '<div style="line-height: 1.5;">'
            '<div style="font-weight: 600;">{}</div>'
            '<div style="font-size: 12px; color: #6b7280;">{}</div>'
            '<div style="font-size: 12px; color: #6b7280;">{}</div>'
            '</div>',
            obj.shipping_name,
            obj.shipping_email,
            obj.shipping_phone
        )
    
    @admin.display(description='Status')
    def order_status_badge(self, obj):
        status_colors = {
            'pending': ('#fef3c7', '#92400e', '⏳'),
            'processing': ('#dbeafe', '#1e40af', '⚙️'),
            'shipped': ('#e0e7ff', '#4338ca', '🚚'),
            'delivered': ('#d1fae5', '#065f46', '✅'),
            'cancelled': ('#fee2e2', '#991b1b', '❌'),
        }
        
        bg, color, icon = status_colors.get(obj.status, ('#f3f4f6', '#374151', '•'))
        
        return format_html(
            '<span style="background: {}; color: {}; padding: 6px 12px; '
            'border-radius: 6px; font-size: 12px; font-weight: 600; '
            'display: inline-flex; align-items: center; gap: 4px;">'
            '{} {}</span>',
            bg, color, icon, obj.get_status_display()
        )
    
    @admin.display(description='Payment Method')
    def payment_method_badge(self, obj):
        if obj.payment_method == 'stripe':
            icon = '💳'
            bg = '#f0fdf4'
            color = '#166534'
        else:
            icon = '💵'
            bg = '#fef3c7'
            color = '#92400e'
        
        return format_html(
            '<span style="background: {}; color: {}; padding: 4px 10px; '
            'border-radius: 4px; font-size: 11px; font-weight: 500;">'
            '{} {}</span>',
            bg, color, icon, obj.get_payment_method_display()
        )
    
    @admin.display(description='Payment')
    def payment_status_badge(self, obj):
        if obj.is_paid:
            return mark_safe(
                '<span style="background: #d1fae5; color: #065f46; padding: 4px 10px; '
                'border-radius: 4px; font-size: 11px; font-weight: 600;">✓ PAID</span>'
            )
        else:
            return mark_safe(
                '<span style="background: #fee2e2; color: #991b1b; padding: 4px 10px; '
                'border-radius: 4px; font-size: 11px; font-weight: 600;">✗ UNPAID</span>'
            )
    
    @admin.display(description='Total')
    def total_amount(self, obj):
        formatted = f"{obj.total:,.2f}"
        return format_html(
            '<div style="font-weight: 700; font-size: 15px; color: #059669;">PKR {}</div>',
            formatted
        )
    
    @admin.display(description='Items')
    def items_count(self, obj):
        count = obj.items.count()
        return format_html(
            '<span style="background: #f3f4f6; color: #374151; padding: 4px 8px; '
            'border-radius: 4px; font-size: 12px; font-weight: 600;">{}</span>',
            count
        )
    
    @admin.display(description='Date')
    def order_date(self, obj):
        time_diff = timezone.now() - obj.created_at
        
        if time_diff.days == 0:
            if time_diff.seconds < 3600:
                minutes = time_diff.seconds // 60
                relative = f'{minutes}m ago'
            else:
                hours = time_diff.seconds // 3600
                relative = f'{hours}h ago'
        elif time_diff.days == 1:
            relative = 'Yesterday'
        elif time_diff.days < 7:
            relative = f'{time_diff.days}d ago'
        else:
            relative = obj.created_at.strftime('%b %d, %Y')
        
        return format_html(
            '<div style="line-height: 1.5;">'
            '<div style="font-weight: 500;">{}</div>'
            '<div style="font-size: 11px; color: #9ca3af;">{}</div>'
            '</div>',
            relative,
            obj.created_at.strftime('%I:%M %p')
        )
    
    @admin.display(description='Order Timeline')
    def order_timeline(self, obj):
        timeline_html = '<div style="background: #f9fafb; padding: 20px; border-radius: 8px;">'
        timeline_html += '<h3 style="margin: 0 0 15px 0; color: #374151;">Order Timeline</h3>'
        timeline_html += '<div style="position: relative; padding-left: 30px;">'
        
        events = [
            ('Created', obj.created_at, '#10b981'),
        ]
        
        if obj.is_paid and obj.paid_at:
            events.append(('Payment Received', obj.paid_at, '#3b82f6'))
        
        if obj.status in ['shipped', 'delivered']:
            events.append(('Shipped', obj.updated_at, '#8b5cf6'))
        
        if obj.status == 'delivered':
            events.append(('Delivered', obj.updated_at, '#059669'))
        
        if obj.status == 'cancelled':
            events.append(('Cancelled', obj.updated_at, '#ef4444'))
        
        for i, (event, timestamp, color) in enumerate(events):
            is_last = i == len(events) - 1
            
            timeline_html += f'''
                <div style="position: relative; padding-bottom: {'0' if is_last else '20px'};">
                    <div style="position: absolute; left: -22px; width: 12px; height: 12px; 
                                background: {color}; border-radius: 50%; border: 3px solid white;
                                box-shadow: 0 0 0 2px {color};"></div>
                    {'' if is_last else f'<div style="position: absolute; left: -17px; top: 12px; width: 2px; height: 100%; background: #e5e7eb;"></div>'}
                    <div style="margin-bottom: 8px;">
                        <div style="font-weight: 600; color: #111827;">{event}</div>
                        <div style="font-size: 12px; color: #6b7280;">
                            {timestamp.strftime('%b %d, %Y at %I:%M %p')}
                        </div>
                    </div>
                </div>
            '''
        
        timeline_html += '</div></div>'
        return mark_safe(timeline_html)
    
    @admin.display(description='Customer Details')
    def customer_details(self, obj):
        user_orders = Order.objects.filter(user=obj.user)
        total_orders = user_orders.count()
        total_spent = user_orders.filter(is_paid=True).aggregate(Sum('total'))['total__sum'] or 0
        
        return format_html(
            '<div style="background: #eff6ff; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">'
            '<h3 style="margin: 0 0 15px 0; color: #1e40af;">Customer Information</h3>'
            '<table style="width: 100%; border-collapse: collapse;">'
            '<tr style="border-bottom: 1px solid #bfdbfe;">'
            '<td style="padding: 8px 0; color: #1e40af; font-weight: 500;">Name:</td>'
            '<td style="padding: 8px 0; color: #1e3a8a;">{}</td>'
            '</tr>'
            '<tr style="border-bottom: 1px solid #bfdbfe;">'
            '<td style="padding: 8px 0; color: #1e40af; font-weight: 500;">Email:</td>'
            '<td style="padding: 8px 0; color: #1e3a8a;">{}</td>'
            '</tr>'
            '<tr style="border-bottom: 1px solid #bfdbfe;">'
            '<td style="padding: 8px 0; color: #1e40af; font-weight: 500;">Phone:</td>'
            '<td style="padding: 8px 0; color: #1e3a8a;">{}</td>'
            '</tr>'
            '<tr style="border-bottom: 1px solid #bfdbfe;">'
            '<td style="padding: 8px 0; color: #1e40af; font-weight: 500;">Address:</td>'
            '<td style="padding: 8px 0; color: #1e3a8a;">{}</td>'
            '</tr>'
            '<tr style="border-bottom: 1px solid #bfdbfe;">'
            '<td style="padding: 8px 0; color: #1e40af; font-weight: 500;">City:</td>'
            '<td style="padding: 8px 0; color: #1e3a8a;">{}, {} {}</td>'
            '</tr>'
            '<tr style="border-bottom: 1px solid #bfdbfe;">'
            '<td style="padding: 8px 0; color: #1e40af; font-weight: 500;">Total Orders:</td>'
            '<td style="padding: 8px 0; color: #1e3a8a; font-weight: 600;">{}</td>'
            '</tr>'
            '<tr>'
            '<td style="padding: 8px 0; color: #1e40af; font-weight: 500;">Total Spent:</td>'
            '<td style="padding: 8px 0; color: #059669; font-weight: 700;">PKR {:,.2f}</td>'
            '</tr>'
            '</table>'
            '</div>',
            obj.shipping_name,
            obj.shipping_email,
            obj.shipping_phone,
            obj.shipping_address,
            obj.shipping_city,
            obj.shipping_state,
            obj.shipping_zip,
            total_orders,
            total_spent
        )
    
    @admin.display(description='Order Summary')
    def order_summary(self, obj):
        items_html = ''
        for item in obj.items.all():
            items_html += f'''
                <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 12px 8px;">
                        <div style="font-weight: 500; color: #111827;">{item.product.name}</div>
                        {f'<div style="font-size: 12px; color: #6b7280;">{item.variant.color} - {item.variant.size}</div>' if item.variant else ''}
                    </td>
                    <td style="padding: 12px 8px; text-align: center; color: #6b7280;">x{item.quantity}</td>
                    <td style="padding: 12px 8px; text-align: right; font-weight: 600; color: #111827;">
                        PKR {item.total_price:,.2f}
                    </td>
                </tr>
            '''
        
        return format_html(
            '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">'
            '<div style="background: #f9fafb; padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">'
            '<h3 style="margin: 0; color: #111827;">Order Items</h3>'
            '</div>'
            '<table style="width: 100%; border-collapse: collapse;">'
            '<thead style="background: #f9fafb;">'
            '<tr>'
            '<th style="padding: 10px 8px; text-align: left; font-size: 12px; color: #6b7280; font-weight: 600;">PRODUCT</th>'
            '<th style="padding: 10px 8px; text-align: center; font-size: 12px; color: #6b7280; font-weight: 600;">QTY</th>'
            '<th style="padding: 10px 8px; text-align: right; font-size: 12px; color: #6b7280; font-weight: 600;">TOTAL</th>'
            '</tr>'
            '</thead>'
            '<tbody>{}</tbody>'
            '</table>'
            '<div style="padding: 16px; background: #f9fafb; border-top: 1px solid #e5e7eb;">'
            '<table style="width: 100%; max-width: 300px; margin-left: auto;">'
            '<tr><td style="padding: 4px 0; color: #6b7280;">Subtotal:</td>'
            '<td style="padding: 4px 0; text-align: right; font-weight: 500;">PKR {:,.2f}</td></tr>'
            '<tr><td style="padding: 4px 0; color: #6b7280;">Shipping:</td>'
            '<td style="padding: 4px 0; text-align: right; font-weight: 500;">PKR {:,.2f}</td></tr>'
            '<tr><td style="padding: 4px 0; color: #6b7280;">Tax:</td>'
            '<td style="padding: 4px 0; text-align: right; font-weight: 500;">PKR {:,.2f}</td></tr>'
            '<tr style="border-top: 2px solid #d1d5db;">'
            '<td style="padding: 8px 0 0 0; color: #111827; font-weight: 700; font-size: 16px;">Total:</td>'
            '<td style="padding: 8px 0 0 0; text-align: right; color: #059669; font-weight: 700; font-size: 18px;">PKR {:,.2f}</td>'
            '</tr>'
            '</table>'
            '</div>'
            '</div>',
            items_html,
            obj.subtotal,
            obj.shipping_cost,
            obj.tax,
            obj.total
        )
    
    @admin.display(description='Payment Details')
    def payment_details(self, obj):
        return format_html(
            '<div style="background: {}; padding: 20px; border-radius: 8px; border-left: 4px solid {};">'
            '<h3 style="margin: 0 0 15px 0; color: {};">Payment Information</h3>'
            '<table style="width: 100%;">'
            '<tr><td style="padding: 6px 0; color: {}; font-weight: 500;">Payment Method:</td>'
            '<td style="padding: 6px 0; color: {};">{}</td></tr>'
            '<tr><td style="padding: 6px 0; color: {}; font-weight: 500;">Payment Status:</td>'
            '<td style="padding: 6px 0; color: {}; font-weight: 600;">{}</td></tr>'
            '<tr><td style="padding: 6px 0; color: {}; font-weight: 500;">Payment ID:</td>'
            '<td style="padding: 6px 0; color: {}; font-family: monospace; font-size: 12px;">{}</td></tr>'
            '{}'
            '<tr><td style="padding: 6px 0; color: {}; font-weight: 500;">Amount:</td>'
            '<td style="padding: 6px 0; color: #059669; font-weight: 700; font-size: 18px;">PKR {:,.2f}</td></tr>'
            '</table>'
            '</div>',
            '#ecfdf5' if obj.is_paid else '#fef3c7',
            '#10b981' if obj.is_paid else '#f59e0b',
            '#065f46' if obj.is_paid else '#92400e',
            '#047857' if obj.is_paid else '#78350f',
            '#065f46' if obj.is_paid else '#92400e',
            obj.get_payment_method_display(),
            '#047857' if obj.is_paid else '#78350f',
            '#10b981' if obj.is_paid else '#dc2626',
            'PAID ✓' if obj.is_paid else 'UNPAID ✗',
            '#047857' if obj.is_paid else '#78350f',
            '#065f46' if obj.is_paid else '#92400e',
            obj.payment_id or 'N/A',
            f'<tr><td style="padding: 6px 0; color: {"#047857" if obj.is_paid else "#78350f"}; font-weight: 500;">Paid At:</td>'
            f'<td style="padding: 6px 0; color: {"#065f46" if obj.is_paid else "#92400e"};">{obj.paid_at.strftime("%b %d, %Y at %I:%M %p")}</td></tr>'
            if obj.is_paid and obj.paid_at else '',
            '#047857' if obj.is_paid else '#78350f',
            obj.total
        )
    
    # Custom actions
    @admin.action(description='⚙️ Mark as Processing')
    def mark_as_processing(self, request, queryset):
        updated = queryset.update(status='processing')
        self.message_user(request, f'{updated} orders marked as processing.')
        
        # Send email notifications
        for order in queryset:
            from apps.notifications.tasks import send_order_status_update_email
            send_order_status_update_email.delay(order.id)
    
    @admin.action(description='🚚 Mark as Shipped')
    def mark_as_shipped(self, request, queryset):
        updated = queryset.update(status='shipped')
        self.message_user(request, f'{updated} orders marked as shipped.')
        
        for order in queryset:
            from apps.notifications.tasks import send_order_status_update_email
            send_order_status_update_email.delay(order.id)
    
    @admin.action(description='✅ Mark as Delivered')
    def mark_as_delivered(self, request, queryset):
        updated = queryset.update(status='delivered')
        self.message_user(request, f'{updated} orders marked as delivered.')
        
        for order in queryset:
            from apps.notifications.tasks import send_order_status_update_email
            send_order_status_update_email.delay(order.id)
    
    @admin.action(description='❌ Mark as Cancelled')
    def mark_as_cancelled(self, request, queryset):
        for order in queryset:
            # Restore stock
            for item in order.items.all():
                if item.variant:
                    item.variant.stock += item.quantity
                    item.variant.save()
                else:
                    item.product.stock += item.quantity
                    item.product.save()
            
            order.status = 'cancelled'
            order.save()
        
        self.message_user(request, f'{queryset.count()} orders cancelled and stock restored.')
    
    @admin.action(description='📧 Send Invoice Email')
    def send_invoice_email(self, request, queryset):
        for order in queryset:
            from apps.notifications.tasks import send_order_confirmation_email
            send_order_confirmation_email.delay(order.id)
        
        self.message_user(request, f'Invoice emails sent for {queryset.count()} orders.')
    
    @admin.action(description='📊 Export to CSV')
    def export_orders_csv(self, request, queryset):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="orders.csv"'
        
        writer = csv.writer(response)
        writer.writerow([
            'Order Number', 'Customer', 'Email', 'Phone', 'Status',
            'Payment Method', 'Paid', 'Total', 'Items', 'Date'
        ])
        
        for order in queryset:
            writer.writerow([
                order.order_number,
                order.shipping_name,
                order.shipping_email,
                order.shipping_phone,
                order.get_status_display(),
                order.get_payment_method_display(),
                'Yes' if order.is_paid else 'No',
                order.total,
                order.items.count(),
                order.created_at.strftime('%Y-%m-%d %H:%M:%S')
            ])
        
        return response
    
    @admin.action(description='🏷️ Generate Shipping Labels')
    def generate_shipping_labels(self, request, queryset):
        # This is a placeholder - integrate with your shipping provider
        self.message_user(
            request,
            f'Shipping labels generated for {queryset.count()} orders.',
            level='success'
        )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product', 'variant', 'quantity', 'price', 'total']
    list_filter = ['order__status', 'product__category', 'created_at']
    search_fields = ['order__order_number', 'product__name']
    
    @admin.display(description='Total')
    def total(self, obj):
        formatted = f"{obj.total_price:,.2f}"
        return format_html(
            '<strong>PKR {}</strong>',
            formatted
        )