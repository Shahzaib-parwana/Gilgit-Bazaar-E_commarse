from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model
from django.utils.html import format_html
from django.db.models import Count, Q
from django.urls import reverse
from django.utils.safestring import mark_safe

User = get_user_model()


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = [
        'user_avatar',
        'email',
        'username',
        'full_name_display',
        'phone_display',
        'location_display',
        'is_verified_badge',
        'is_staff_badge',
        'order_count',
        'date_joined_display',
        'last_login_display',
    ]
    
    list_filter = [
        'is_staff',
        'is_superuser',
        'is_active',
        'is_verified',
        'date_joined',
        'last_login',
        'city',
        'state',
    ]
    
    search_fields = [
        'email',
        'username',
        'first_name',
        'last_name',
        'phone',
        'city',
    ]
    
    ordering = ['-date_joined']
    
    readonly_fields = [
        'date_joined',
        'last_login',
        'user_stats',
        'order_history_link',
    ]
    
    fieldsets = (
        ('Authentication', {
            'fields': ('email', 'username', 'password')
        }),
        ('Personal Information', {
            'fields': ('first_name', 'last_name', 'phone')
        }),
        ('Address', {
            'fields': ('address', 'city', 'state', 'zip_code'),
            'classes': ('collapse',)
        }),
        ('Permissions', {
            'fields': (
                'is_active',
                'is_staff',
                'is_superuser',
                'is_verified',
                'groups',
                'user_permissions'
            ),
            'classes': ('collapse',)
        }),
        ('Important Dates', {
            'fields': ('last_login', 'date_joined')
        }),
        ('Statistics', {
            'fields': ('user_stats', 'order_history_link'),
            'classes': ('collapse',)
        }),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email',
                'username',
                'first_name',
                'last_name',
                'password1',
                'password2',
                'is_staff',
                'is_superuser'
            ),
        }),
    )
    
    actions = [
        'verify_users',
        'unverify_users',
        'activate_users',
        'deactivate_users',
        'export_users_csv',
    ]
    
    # Custom display methods
    @admin.display(description='Avatar')
    def user_avatar(self, obj):
        initial = obj.first_name[0].upper() if obj.first_name else obj.email[0].upper()
        return format_html(
            '<div style="width: 40px; height: 40px; border-radius: 50%; '
            'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); '
            'color: white; display: flex; align-items: center; '
            'justify-content: center; font-weight: bold; font-size: 16px;">{}</div>',
            initial
        )
    
    @admin.display(description='Full Name')
    def full_name_display(self, obj):
        full_name = obj.get_full_name()
        return full_name if full_name else '—'
    
    @admin.display(description='Phone')
    def phone_display(self, obj):
        if obj.phone:
            return format_html(
                '<span style="font-family: monospace;">{}</span>',
                obj.phone
            )
        return '—'
    
    @admin.display(description='Location')
    def location_display(self, obj):
        if obj.city and obj.state:
            return f"{obj.city}, {obj.state}"
        return '—'
    
    @admin.display(description='Verified', boolean=True)
    def is_verified_badge(self, obj):
        return obj.is_verified
    
    @admin.display(description='Staff', boolean=True)
    def is_staff_badge(self, obj):
        return obj.is_staff
    
    @admin.display(description='Orders')
    def order_count(self, obj):
        count = obj.orders.count()
        if count > 0:
            url = reverse('admin:orders_order_changelist') + f'?user__id__exact={obj.id}'
            return format_html(
                '<a href="{}" style="color: #2563eb; font-weight: 600;">{} orders</a>',
                url,
                count
            )
        return '0 orders'
    
    @admin.display(description='Joined')
    def date_joined_display(self, obj):
        return obj.date_joined.strftime('%b %d, %Y')
    
    @admin.display(description='Last Login')
    def last_login_display(self, obj):
        if obj.last_login:
            return obj.last_login.strftime('%b %d, %Y')
        return 'Never'
    
    @admin.display(description='User Statistics')
    def user_stats(self, obj):
        from apps.orders.models import Order
        
        orders = obj.orders.all()
        total_orders = orders.count()
        completed_orders = orders.filter(status='delivered').count()
        total_spent = sum(order.total for order in orders.filter(is_paid=True))
        
        return format_html(
            '<div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">'
            '<table style="width: 100%;">'
            '<tr><td><strong>Total Orders:</strong></td><td>{}</td></tr>'
            '<tr><td><strong>Completed:</strong></td><td>{}</td></tr>'
            '<tr><td><strong>Total Spent:</strong></td><td>PKR {:,.2f}</td></tr>'
            '</table>'
            '</div>',
            total_orders,
            completed_orders,
            total_spent
        )
    
    @admin.display(description='Order History')
    def order_history_link(self, obj):
        url = reverse('admin:orders_order_changelist') + f'?user__id__exact={obj.id}'
        return format_html(
            '<a href="{}" class="button" style="padding: 8px 16px;">View All Orders</a>',
            url
        )
    
    # Custom actions
    @admin.action(description='✓ Verify selected users')
    def verify_users(self, request, queryset):
        updated = queryset.update(is_verified=True)
        self.message_user(request, f'{updated} users verified successfully.')
    
    @admin.action(description='✗ Unverify selected users')
    def unverify_users(self, request, queryset):
        updated = queryset.update(is_verified=False)
        self.message_user(request, f'{updated} users unverified.')
    
    @admin.action(description='Activate selected users')
    def activate_users(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} users activated.')
    
    @admin.action(description='Deactivate selected users')
    def deactivate_users(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} users deactivated.')
    
    @admin.action(description='Export to CSV')
    def export_users_csv(self, request, queryset):
        import csv
        from django.http import HttpResponse
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="users.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Email', 'Username', 'First Name', 'Last Name', 'Phone', 'City', 'State', 'Joined'])
        
        for user in queryset:
            writer.writerow([
                user.email,
                user.username,
                user.first_name,
                user.last_name,
                user.phone or '',
                user.city or '',
                user.state or '',
                user.date_joined.strftime('%Y-%m-%d')
            ])
        
        return response