# apps/wishlist/views.py
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Wishlist
from .serializers import WishlistSerializer, AddToWishlistSerializer
from apps.products.models import Product


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_wishlist(request):
    """Get user's wishlist"""
    wishlist_items = Wishlist.objects.filter(user=request.user)
    # Pass the request context to the serializer
    serializer = WishlistSerializer(
        wishlist_items, 
        many=True, 
        context={'request': request}  # ← Pass request in context
    )
    return Response({
        'items': serializer.data,
        'total_items': wishlist_items.count()
    })

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_to_wishlist(request):
    """Add item to wishlist"""
    serializer = AddToWishlistSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    product_id = serializer.validated_data['product_id']
    variant_id = serializer.validated_data.get('variant_id')
    
    # Check if product exists
    product = get_object_or_404(Product, id=product_id, is_active=True)
    
    # Check if variant exists (if provided)
    variant = None
    if variant_id:
        from apps.products.models import ProductVariant
        variant = get_object_or_404(ProductVariant, id=variant_id, product=product)
    
    # Create or get wishlist item
    wishlist_item, created = Wishlist.objects.get_or_create(
        user=request.user,
        product=product,
        variant=variant
    )
    
    # Pass context when serializing
    serializer = WishlistSerializer(
        wishlist_item, 
        context={'request': request}  # ← Pass request in context
    )
    
    if created:
        return Response({
            'message': 'Item added to wishlist',
            'item': serializer.data
        }, status=status.HTTP_201_CREATED)
    else:
        return Response({
            'message': 'Item already in wishlist',
            'item': serializer.data
        }, status=status.HTTP_200_OK)



@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def remove_from_wishlist(request, item_id):
    """Remove item from wishlist"""
    wishlist_item = get_object_or_404(Wishlist, id=item_id, user=request.user)
    wishlist_item.delete()
    return Response({'message': 'Item removed from wishlist'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def clear_wishlist(request):
    """Clear entire wishlist"""
    Wishlist.objects.filter(user=request.user).delete()
    return Response({'message': 'Wishlist cleared'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def move_to_cart(request, item_id):
    """Move wishlist item to cart"""
    from apps.cart.views import add_to_cart as add_to_cart_function
    
    wishlist_item = get_object_or_404(Wishlist, id=item_id, user=request.user)
    
    # Create a mock request to add to cart
    from django.http import QueryDict
    mock_request = type('obj', (object,), {
        'user': request.user,
        'data': {
            'product_id': wishlist_item.product.id,
            'variant_id': wishlist_item.variant.id if wishlist_item.variant else None,
            'quantity': 1
        }
    })()
    
    # Add to cart
    response = add_to_cart_function(mock_request)
    
    if response.status_code == 200 or response.status_code == 201:
        # Remove from wishlist after adding to cart
        wishlist_item.delete()
        return Response({
            'message': 'Item moved to cart successfully',
            'cart_updated': True
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            'message': 'Failed to move item to cart'
        }, status=status.HTTP_400_BAD_REQUEST)