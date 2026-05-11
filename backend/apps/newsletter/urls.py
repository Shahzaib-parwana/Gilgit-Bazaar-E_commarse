from django.urls import path
from . import views

urlpatterns = [
    # Public endpoints
    path('subscribe/', views.subscribe_newsletter, name='subscribe'),
    path('verify/<uuid:token>/', views.verify_newsletter, name='verify'),
    path('unsubscribe/', views.unsubscribe_newsletter, name='unsubscribe'),
    
    # Admin endpoints
    path('admin/subscribers/', views.get_subscribers, name='get_subscribers'),
    path('admin/send-bulk-email/', views.send_bulk_email, name='send_bulk_email'),
    path('admin/stats/', views.get_newsletter_stats, name='newsletter_stats'),
]