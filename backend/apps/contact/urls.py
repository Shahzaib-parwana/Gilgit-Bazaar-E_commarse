from django.urls import path
from . import views

urlpatterns = [
    # Main endpoint for all contact page data
    path('', views.ContactPageDataView.as_view(), name='contact-data'),
    
    # Form submission endpoint
    path('submit/', views.SubmitContactFormView.as_view(), name='submit-contact'),
    
    # Individual section endpoints
    path('hero/', views.HeroSectionView.as_view(), name='contact-hero'),
    path('channels/', views.ChannelsView.as_view(), name='contact-channels'),
    path('channels/<int:pk>/', views.ChannelDetailView.as_view(), name='contact-channel-detail'),
    path('hours/', views.HoursView.as_view(), name='contact-hours'),
    path('hours/<int:pk>/', views.HourDetailView.as_view(), name='contact-hour-detail'),
    path('social-links/', views.SocialLinksView.as_view(), name='contact-social-links'),
    path('social-links/<int:pk>/', views.SocialLinkDetailView.as_view(), name='contact-social-link-detail'),
    path('form-settings/', views.FormSettingsView.as_view(), name='contact-form-settings'),
    path('map-settings/', views.MapSettingsView.as_view(), name='contact-map-settings'),
    
    # Admin endpoints for viewing messages
    path('messages/', views.ContactMessagesView.as_view(), name='contact-messages'),
    path('messages/<int:pk>/', views.ContactMessagesView.as_view(), name='contact-message-detail'),
]