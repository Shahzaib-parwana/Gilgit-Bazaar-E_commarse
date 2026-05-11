# apps/reviews/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReviewViewSet, PendingReviewsView

router = DefaultRouter()
router.register('reviews', ReviewViewSet, basename='review')

urlpatterns = [
    path('', include(router.urls)),
    path('admin/pending-reviews/', PendingReviewsView.as_view(), name='pending-reviews'),
]