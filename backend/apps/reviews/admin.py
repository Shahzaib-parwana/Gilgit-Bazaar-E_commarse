# apps/reviews/admin.py
from django.contrib import admin
from django.utils.html import format_html
from .models import Review, ReviewHelpfulVote

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['id', 'product_link', 'user_link', 'rating_stars', 'status', 'helpful_count', 'created_at']
    list_filter = ['status', 'rating', 'created_at']
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'product__name', 'comment']
    readonly_fields = ['helpful_count', 'created_at', 'updated_at', 'moderated_at']
    list_per_page = 25
    
    fieldsets = (
        ('Review Information', {
            'fields': ('user', 'product', 'order', 'rating', 'title', 'comment', 'images')
        }),
        ('Moderation', {
            'fields': ('status', 'moderated_by', 'moderated_at', 'moderation_notes'),
            'classes': ('collapse',)
        }),
        ('Statistics', {
            'fields': ('helpful_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    actions = ['approve_reviews', 'reject_reviews']
    
    def product_link(self, obj):
        return format_html(
            '<a href="/admin/products/product/{}/change/" style="color: #f0a500;">{}</a>',
            obj.product.id, obj.product.name[:50]
        )
    product_link.short_description = 'Product'
    
    def user_link(self, obj):
        return format_html(
            '<a href="/admin/auth/user/{}/change/">{}</a>',
            obj.user.id, obj.user.email
        )
    user_link.short_description = 'User'
    
    def rating_stars(self, obj):
        stars = '★' * obj.rating + '☆' * (5 - obj.rating)
        return format_html('<span style="color: #f0a500; font-size: 14px; letter-spacing: 2px;">{}</span>', stars)
    rating_stars.short_description = 'Rating'
    
    def approve_reviews(self, request, queryset):
        from django.utils import timezone
        count = queryset.update(status='approved', moderated_by=request.user, moderated_at=timezone.now())
        self.message_user(request, f'{count} review(s) approved successfully.')
    approve_reviews.short_description = '✅ Approve selected reviews'
    
    def reject_reviews(self, request, queryset):
        from django.utils import timezone
        count = queryset.update(status='rejected', moderated_by=request.user, moderated_at=timezone.now())
        self.message_user(request, f'{count} review(s) rejected.')
    reject_reviews.short_description = '❌ Reject selected reviews'


@admin.register(ReviewHelpfulVote)
class ReviewHelpfulVoteAdmin(admin.ModelAdmin):
    list_display = ['id', 'review_preview', 'user', 'created_at']
    list_filter = ['created_at']
    search_fields = ['review__comment', 'user__email']
    readonly_fields = ['created_at']
    
    def review_preview(self, obj):
        return f"Review #{obj.review.id} - {obj.review.product.name[:30]}"
    review_preview.short_description = 'Review'