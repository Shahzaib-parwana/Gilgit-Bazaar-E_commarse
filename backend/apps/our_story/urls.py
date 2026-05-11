from django.urls import path
from . import views

urlpatterns = [
    # Main endpoint for all story data
    path('', views.OurStoryDataView.as_view(), name='our-story-data'),
    # Individual section endpoints
    path('hero/', views.HeroSectionView.as_view(), name='hero-section'),
    path('intro/', views.IntroSectionView.as_view(), name='intro-section'),
    path('stats/', views.StatsView.as_view(), name='stats'),
    path('stats/<int:pk>/', views.StatDetailView.as_view(), name='stat-detail'),
    path('video/', views.VideoSectionView.as_view(), name='video-section'),
    path('stories/', views.ArtisanStoriesView.as_view(), name='stories'),
    path('stories/<int:pk>/', views.ArtisanStoryDetailView.as_view(), name='story-detail'),
    path('process/', views.ProcessStepsView.as_view(), name='process-steps'),
    path('process/<int:pk>/', views.ProcessStepDetailView.as_view(), name='process-step-detail'),
    path('cta/', views.CTASectionView.as_view(), name='cta-section'),
]