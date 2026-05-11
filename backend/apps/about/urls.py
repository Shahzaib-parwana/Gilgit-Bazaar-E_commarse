from django.urls import path
from . import views

urlpatterns = [
    # Main endpoint for all about data
    path('', views.AboutPageDataView.as_view(), name='about-data'),
    
    # Individual section endpoints
    path('hero/', views.HeroSectionView.as_view(), name='about-hero'),
    path('story/', views.StorySectionView.as_view(), name='about-story'),
    path('values/', views.ValuesView.as_view(), name='about-values'),
    path('values/<int:pk>/', views.ValueDetailView.as_view(), name='about-value-detail'),
    path('timeline/', views.TimelineView.as_view(), name='about-timeline'),
    path('timeline/<int:pk>/', views.TimelineDetailView.as_view(), name='about-timeline-detail'),
    path('stats/', views.StatsView.as_view(), name='about-stats'),
    path('stats/<int:pk>/', views.StatDetailView.as_view(), name='about-stat-detail'),
    path('team/', views.TeamView.as_view(), name='about-team'),
    path('team/<int:pk>/', views.TeamDetailView.as_view(), name='about-team-detail'),
    path('spotlight/', views.SpotlightView.as_view(), name='about-spotlight'),
    path('newsletter/', views.NewsletterView.as_view(), name='about-newsletter'),
]