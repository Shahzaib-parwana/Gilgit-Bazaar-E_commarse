from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Sum, Count
from .models import Payment
from rangefilter.filters import NumericRangeFilter


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = [
        'transaction_id_display',
        'order_link',
        'payment_method_badge',
        'amount_display',
        'status_badge',
        'payment_date',
    ]
    
    list_filter = [
        'payment_method',
        'status',
        'created_at',
        ('amount', NumericRangeFilter),
    ]
    
    search_fields = [
        'transaction_id',
        'order__order_number',
        'order__user__email',
    ]
    
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    
    readonly_fields = [
        'transaction_id',
        'created_at',
        'updated_at',
        'payment_response_display',
        'order_details',
    ]
    
    fieldsets = (
        ('Payment Information', {
            'fields': ('order', 'payment_method', 'transaction_id', 'amount', 'status')
        }),
        ('Response Data', {
            'fields': ('payment_response_display',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
        ('Order Information', {
            'fields': ('order_details',),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_completed', 'mark_as_failed', 'export_payments_csv']
    
    @admin.display(description='Transaction ID')
    def transaction_id_display(self, obj):
        return format_html(
            '<span style="font-family: monospace; background: #f3f4f6; '
            'padding: 4px 8px; border-radius: 4px; font-size: 12px;">{}</span>',
            obj.transaction_id
        )
    
    @admin.display(description='Order')
    def order_link(self, obj):
        from django.urls import reverse
        url = reverse('admin:orders_order_change', args=[obj.order.pk])
        return format_html(
            '<a href="{}" style="color: #2563eb; font-weight: 600;">{}</a>',
            url,
            obj.order.order_number
        )
    
    @admin.display(description='Method')
    def payment_method_badge(self, obj):
        colors = {
            'stripe': ('#dbeafe', '#1e40af', '💳'),
            'cod': ('#fef3c7', '#92400e', '💵'),
            'jazzcash': ('#fce7f3', '#831843', '📱'),
            'easypaisa': ('#dcfce7', '#14532d', '📱'),
        }
        
        bg, color, icon = colors.get(obj.payment_method, ('#f3f4f6', '#374151', '💰'))
        
        return format_html(
            '<span style="background: {}; color: {}; padding: 6px 10px; '
            'border-radius: 4px; font-size: 11px; font-weight: 600;">'
            '{} {}</span>',
            bg, color, icon, obj.payment_method.upper()
        )
    
    @admin.display(description='Amount')
    def amount_display(self, obj):
        return format_html(
            '<span style="font-weight: 700; font-size: 15px; color: #059669;">PKR {:,.2f}</span>',
            obj.amount
        )
    
    @admin.display(description='Status')
    def status_badge(self, obj):
        colors = {
            'pending': ('#fef3c7', '#92400e', '⏳'),
            'completed': ('#d1fae5', '#065f46', '✅'),
            'failed': ('#fee2e2', '#991b1b', '❌'),
            'refunded': ('#e0e7ff', '#3730a3', '↩️'),
        }
        
        bg, color, icon = colors.get(obj.status, ('#f3f4f6', '#374151', '•'))
        
        return format_html(
            '<span style="background: {}; color: {}; padding: 6px 12px; '
            'border-radius: 6px; font-size: 12px; font-weight: 600;">'
            '{} {}</span>',
            bg, color, icon, obj.get_status_display()
        )
    
    @admin.display(description='Date')
    def payment_date(self, obj):
        return format_html(
            '<div style="line-height: 1.5;">'
            '<div style="font-weight: 500;">{}</div>'
            '<div style="font-size: 11px; color: #9ca3af;">{}</div>'
            '</div>',
            obj.created_at.strftime('%b %d, %Y'),
            obj.created_at.strftime('%I:%M %p')
        )
    
    @admin.display(description='Payment Response')
    def payment_response_display(self, obj):
        if obj.payment_response:
            import json
            formatted_json = json.dumps(obj.payment_response, indent=2)
            return format_html(
                '<pre style="background: #1f2937; color: #10b981; padding: 15px; '
                'border-radius: 8px; overflow-x: auto; font-size: 12px; '
                'font-family: monospace;">{}</pre>',
                formatted_json
            )
        return '—'
    
    @admin.display(description='Order Details')
    def order_details(self, obj):
        return format_html(
            '<div style="background: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">'
            '<h3 style="margin: 0 0 15px 0; color: #111827;">Order Information</h3>'
            '<table style="width: 100%;">'
            '<tr><td style="padding: 6px 0; color: #6b7280; font-weight: 500;">Order Number:</td>'
            '<td style="padding: 6px 0; color: #111827; font-weight: 600;">{}</td></tr>'
            '<tr><td style="padding: 6px 0; color: #6b7280; font-weight: 500;">Customer:</td>'
            '<td style="padding: 6px 0; color: #111827;">{}</td></tr>'
            '<tr><td style="padding: 6px 0; color: #6b7280; font-weight: 500;">Email:</td>'
            '<td style="padding: 6px 0; color: #111827;">{}</td></tr>'
            '<tr><td style="padding: 6px 0; color: #6b7280; font-weight: 500;">Order Total:</td>'
            '<td style="padding: 6px 0; color: #059669; font-weight: 700;">PKR {:,.2f}</td></tr>'
            '<tr><td style="padding: 6px 0; color: #6b7280; font-weight: 500;">Order Status:</td>'
            '<td style="padding: 6px 0; color: #111827; text-transform: capitalize;">{}</td></tr>'
            '</table>'
            '</div>',
            obj.order.order_number,
            obj.order.shipping_name,
            obj.order.shipping_email,
            obj.order.total,
            obj.order.get_status_display()
        )
    
    @admin.action(description='✅ Mark as Completed')
    def mark_as_completed(self, request, queryset):
        updated = queryset.update(status='completed')
        self.message_user(request, f'{updated} payments marked as completed.')
    
    @admin.action(description='❌ Mark as Failed')
    def mark_as_failed(self, request, queryset):
        updated = queryset.update(status='failed')
        self.message_user(request, f'{updated} payments marked as failed.')
    
    @admin.action(description='📊 Export to CSV')
    def export_payments_csv(self, request, queryset):
        import csv
        from django.http import HttpResponse
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="payments.csv"'
        
        writer = csv.writer(response)
        writer.writerow([
            'Transaction ID', 'Order Number', 'Payment Method',
            'Amount', 'Status', 'Date'
        ])
        
        for payment in queryset:
            writer.writerow([
                payment.transaction_id,
                payment.order.order_number,
                payment.payment_method,
                payment.amount,
                payment.get_status_display(),
                payment.created_at.strftime('%Y-%m-%d %H:%M:%S')
            ])
        
        return response