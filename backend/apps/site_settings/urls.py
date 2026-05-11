# site_settings/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('announcements/', views.ActiveAnnouncementsListView.as_view(), name='active-announcements'),
    path('flash-sale/active/', views.ActiveFlashSaleView.as_view(), name='active-flash-sale'),
    path('flash-sales/', views.AllFlashSalesListView.as_view(), name='all-flash-sales'),
    path('settings/<str:key>/', views.SiteSettingView.as_view(), name='site-setting'),
    path('home-banners/', views.get_home_banners, name='home-banners'),
]