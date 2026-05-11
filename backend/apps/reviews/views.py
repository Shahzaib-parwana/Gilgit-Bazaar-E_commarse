# apps/reviews/views.py
from rest_framework import viewsets, status, generics, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.db.models import Avg, Count, Q
from django.shortcuts import get_object_or_404
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os
from .models import Review, ReviewHelpfulVote
from .serializers import (
    ReviewSerializer, ReviewCreateSerializer, ReviewUpdateSerializer,
    ReviewHelpfulVoteSerializer, ReviewStatsSerializer, 
    ReviewModerationSerializer, CanReviewResponseSerializer,
    ReviewImageUploadSerializer
)
from apps.products.models import Product
from apps.utils.permissions import IsAdminOrReadOnly
import uuid
from django.utils import timezone


class ReviewViewSet(viewsets.ModelViewSet):
    """
    Review ViewSet with full CRUD operations
    """
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            # Staff can see all reviews
            queryset = Review.objects.all()
        else:
            # Regular users only see approved reviews
            queryset = Review.objects.filter(status='approved')
        
        # Filter by product
        product_id = self.request.query_params.get('product')
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        
        # Filter by rating
        rating = self.request.query_params.get('rating')
        if rating and rating.isdigit():
            queryset = queryset.filter(rating=int(rating))
        
        # Filter by status (staff only)
        if self.request.user.is_staff:
            status_filter = self.request.query_params.get('status')
            if status_filter:
                queryset = queryset.filter(status=status_filter)
        
        # Ordering
        ordering = self.request.query_params.get('ordering', '-created_at')
        allowed_orderings = ['created_at', '-created_at', 'rating', '-rating', 'helpful_count', '-helpful_count']
        if ordering in allowed_orderings:
            queryset = queryset.order_by(ordering)
        else:
            queryset = queryset.order_by('-created_at')
        
        return queryset
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ReviewCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return ReviewUpdateSerializer
        return ReviewSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'], url_path='my-reviews')
    def my_reviews(self, request):
        """Get current user's reviews"""
        reviews = Review.objects.filter(user=request.user)
        page = self.paginate_queryset(reviews)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='product/(?P<product_id>[^/.]+)/stats')
    def product_stats(self, request, product_id=None):
        """Get review statistics for a product"""
        product = get_object_or_404(Product, id=product_id, is_active=True)
        reviews = Review.objects.filter(product=product, status='approved')
        
        total_reviews = reviews.count()
        
        if total_reviews == 0:
            stats_data = {
                'average_rating': 0,
                'total_reviews': 0,
                'rating_distribution': {1: 0, 2: 0, 3: 0, 4: 0, 5: 0},
                'rating_percentages': {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
            }
            serializer = ReviewStatsSerializer(stats_data)
            return Response(serializer.data)
        
        # Calculate distribution
        distribution = {}
        percentages = {}
        for i in range(1, 6):
            count = reviews.filter(rating=i).count()
            distribution[i] = count
            percentages[i] = round((count / total_reviews) * 100, 1)
        
        avg_rating = reviews.aggregate(avg=Avg('rating'))['avg']
        
        stats_data = {
            'average_rating': round(avg_rating, 1),
            'total_reviews': total_reviews,
            'rating_distribution': distribution,
            'rating_percentages': percentages
        }
        
        serializer = ReviewStatsSerializer(stats_data)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def helpful(self, request, pk=None):
        """Mark review as helpful/unhelpful"""
        review = self.get_object()
        
        # Check if user already voted
        vote = ReviewHelpfulVote.objects.filter(review=review, user=request.user).first()
        
        if vote:
            # Remove vote
            vote.delete()
            review.helpful_count = review.vote_records.count()
            review.save()
            return Response({
                'message': 'Vote removed',
                'helpful_count': review.helpful_count,
                'is_helpful': False
            })
        else:
            # Add vote
            ReviewHelpfulVote.objects.create(review=review, user=request.user)
            review.helpful_count = review.vote_records.count()
            review.save()
            return Response({
                'message': 'Vote added',
                'helpful_count': review.helpful_count,
                'is_helpful': True
            })
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def moderate(self, request, pk=None):
        """Admin moderation endpoint"""
        if not request.user.is_staff:
            return Response(
                {'error': 'Admin access required'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        review = get_object_or_404(Review, pk=pk)
        serializer = ReviewModerationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        action_taken = serializer.validated_data['action']
        notes = serializer.validated_data.get('notes', '')
        
        if action_taken == 'approve':
            review.status = 'approved'
            review.moderated_by = request.user
            review.moderated_at = timezone.now()
            review.moderation_notes = notes
            review.save()
            return Response({'message': 'Review approved successfully'})
        else:
            review.status = 'rejected'
            review.moderated_by = request.user
            review.moderated_at = timezone.now()
            review.moderation_notes = notes
            review.save()
            return Response({'message': 'Review rejected successfully'})
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def can_review(self, request):
        """Check if user can review a product"""
        product_id = request.query_params.get('product')
        
        if not product_id:
            return Response(
                {'error': 'Product ID is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            product = Product.objects.get(id=product_id, is_active=True)
        except Product.DoesNotExist:
            return Response(
                {'error': 'Product not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if already reviewed
        already_reviewed = Review.objects.filter(
            user=request.user, 
            product=product
        ).exists()
        
        # Check if purchased
        has_purchased = request.user.orders.filter(
            items__product=product,
            status='delivered'
        ).exists()
        
        response_data = {
            'can_review': has_purchased and not already_reviewed,
            'has_purchased': has_purchased,
            'already_reviewed': already_reviewed
        }
        
        serializer = CanReviewResponseSerializer(response_data)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def upload_images(self, request):
        """Upload review images"""
        serializer = ReviewImageUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        images = serializer.validated_data['images']
        uploaded_urls = []
        
        for image in images:
            # Generate unique filename
            ext = os.path.splitext(image.name)[1]
            filename = f"reviews/{uuid.uuid4().hex}{ext}"
            
            # Save file
            path = default_storage.save(filename, ContentFile(image.read()))
            url = default_storage.url(path)
            
            # Build absolute URL
            if request.is_secure():
                url = url.replace('http://', 'https://')
            uploaded_urls.append(url)
        
        return Response({
            'urls': uploaded_urls,
            'message': f'{len(uploaded_urls)} images uploaded successfully'
        })


class PendingReviewsView(generics.ListAPIView):
    """Admin view for pending reviews"""
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = ReviewSerializer
    
    def get_queryset(self):
        return Review.objects.filter(status='pending').order_by('-created_at')