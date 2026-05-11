# apps/reviews/models.py
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone

class Review(models.Model):
    """
    Product Review Model
    """
    STATUS_CHOICES = [
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    # Relationships
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='reviews'
    )
    product = models.ForeignKey(
        'products.Product', 
        on_delete=models.CASCADE, 
        related_name='reviews'
    )
    order = models.ForeignKey(
        'orders.Order', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='reviews'
    )
    
    # Review content
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Rating from 1 to 5 stars"
    )
    title = models.CharField(max_length=200, blank=True, help_text="Review title (optional)")
    comment = models.TextField(help_text="Detailed review comment")
    
    # Images (store URLs)
    images = models.JSONField(default=list, blank=True, help_text="List of image URLs")
    
    # Status and moderation
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    moderated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='moderated_reviews'
    )
    moderated_at = models.DateTimeField(null=True, blank=True)
    moderation_notes = models.TextField(blank=True, help_text="Admin notes for moderation")
    
    # Helpfulness votes
    helpful_count = models.PositiveIntegerField(default=0)
    helpful_votes = models.ManyToManyField(
        settings.AUTH_USER_MODEL, 
        through='ReviewHelpfulVote',
        related_name='helpful_reviews'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['user', 'product']  # One review per user per product
        indexes = [
            models.Index(fields=['product', 'status', '-created_at']),
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['rating']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.product.name} - {self.rating}★"
    
    def approve(self, moderator, notes=""):
        """Approve review"""
        self.status = 'approved'
        self.moderated_by = moderator
        self.moderated_at = timezone.now()
        self.moderation_notes = notes
        self.save()
    
    def reject(self, moderator, notes=""):
        """Reject review"""
        self.status = 'rejected'
        self.moderated_by = moderator
        self.moderated_at = timezone.now()
        self.moderation_notes = notes
        self.save()


class ReviewHelpfulVote(models.Model):
    """
    Track helpful votes on reviews
    """
    review = models.ForeignKey(
        Review, 
        on_delete=models.CASCADE, 
        related_name='vote_records'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['review', 'user']  # One vote per user per review
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} found {self.review} helpful"