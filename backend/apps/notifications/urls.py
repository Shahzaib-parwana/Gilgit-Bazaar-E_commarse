from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EmailTemplateViewSet,
    NotificationViewSet,
    EmailCampaignViewSet,
    EmailLogViewSet,
    unread_notification_count,  # Add this import
    mark_all_notifications_read , # Add this import
  
)

router = DefaultRouter()
router.register('email-templates', EmailTemplateViewSet, basename='email-template')
router.register('notifications', NotificationViewSet, basename='notification')
router.register('email-campaigns', EmailCampaignViewSet, basename='email-campaign')
router.register('email-logs', EmailLogViewSet, basename='email-log')

urlpatterns = [
    path('', include(router.urls)),
    # Custom endpoints outside the router (these will work for sure)
    path('unread-count/', unread_notification_count, name='unread-notification-count'),
    path('mark-all-read/', mark_all_notifications_read, name='mark-all-read'),


]