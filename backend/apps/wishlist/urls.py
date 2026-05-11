# apps/wishlist/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('wishlist/', views.get_wishlist, name='wishlist'),
    path('wishlist/add/', views.add_to_wishlist, name='add-to-wishlist'),
    path('wishlist/remove/<int:item_id>/', views.remove_from_wishlist, name='remove-from-wishlist'),
    path('wishlist/clear/', views.clear_wishlist, name='clear-wishlist'),
    path('wishlist/move-to-cart/<int:item_id>/', views.move_to_cart, name='move-to-cart'),
]