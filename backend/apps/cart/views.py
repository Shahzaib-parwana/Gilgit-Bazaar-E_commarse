# carts/views.py

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Cart, CartItem, Coupon, StoreSettings
from .serializers import CartSerializer, CouponApplySerializer, CouponResponseSerializer, StoreSettingsSerializer
from apps.products.models import Product, ProductVariant



class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Cart.objects.all()

    def get_or_create_cart(self, request):
        if request.user.is_authenticated:
            cart, created = Cart.objects.get_or_create(user=request.user)
        else:
            session_key = request.session.session_key
            if not session_key:
                request.session.create()
                session_key = request.session.session_key
            
            cart, created = Cart.objects.get_or_create(session_key=session_key)
        
        return cart

    def list(self, request):
        cart = self.get_or_create_cart(request)
        
        # Recalculate coupon discount in case cart subtotal changed
        if cart.coupon:
            if cart.coupon.is_valid(cart.subtotal):
                cart.coupon_discount = cart.coupon.calculate_discount(cart.subtotal)
                cart.save(update_fields=['coupon_discount'])
            else:
                # Clear invalid coupon
                cart.coupon = None
                cart.coupon_discount = 0
                cart.save(update_fields=['coupon', 'coupon_discount'])
        
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        cart = self.get_or_create_cart(request)
        
        product_id = request.data.get('product_id')
        variant_id = request.data.get('variant_id')
        quantity = int(request.data.get('quantity', 1))

        if not product_id:
            return Response({'error': 'Product ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        product = get_object_or_404(Product, id=product_id)
        variant = None

        # --- Bundle handling (new logic) ---
        if product.is_bundle:
            # Hampers cannot have variants
            if variant_id:
                return Response(
                    {'error': 'Gift hampers do not support variants'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            # Check component availability
            available_stock = product.available_bundles()
            if available_stock is None:
                return Response(
                    {'error': 'This hamper has no items defined'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            # Regular product: existing logic unchanged
            if variant_id:
                variant = get_object_or_404(ProductVariant, id=variant_id)
                available_stock = variant.stock
            else:
                available_stock = product.stock

        # --- Stock validation (same for both, but uses available_stock from above) ---
        cart_item = CartItem.objects.filter(cart=cart, product=product, variant=variant).first()
        current_quantity = cart_item.quantity if cart_item else 0
        
        if current_quantity + quantity > available_stock:
            return Response(
                {'error': f'Only {available_stock} items available in stock'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # --- Add or update cart item (unchanged logic) ---
        if cart_item:
            cart_item.quantity += quantity
            cart_item.save()
        else:
            cart_item = CartItem.objects.create(
                cart=cart,
                product=product,
                variant=variant,
                quantity=quantity
            )
        
        # Clear coupon when cart items change (optional - remove if you want to keep coupon)
        if cart.coupon:
            cart.coupon = None
            cart.coupon_discount = 0
            cart.save(update_fields=['coupon', 'coupon_discount'])

        serializer = self.get_serializer(cart)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['patch'])
    def update_item(self, request):
        cart = self.get_or_create_cart(request)
        
        item_id = request.data.get('item_id')
        quantity = request.data.get('quantity')

        if not item_id or quantity is None:
            return Response(
                {'error': 'Item ID and quantity are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
        
        # --- Determine available stock (bundle vs regular) ---
        if cart_item.product.is_bundle:
            available_stock = cart_item.product.available_bundles()
            if available_stock is None:
                return Response(
                    {'error': 'This hamper has no items defined'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            if cart_item.variant:
                available_stock = cart_item.variant.stock
            else:
                available_stock = cart_item.product.stock

        if int(quantity) > available_stock:
            return Response(
                {'error': f'Only {available_stock} items available'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if int(quantity) <= 0:
            cart_item.delete()
        else:
            cart_item.quantity = int(quantity)
            cart_item.save()
        
        # Clear coupon when cart items change
        if cart.coupon:
            cart.coupon = None
            cart.coupon_discount = 0
            cart.save(update_fields=['coupon', 'coupon_discount'])

        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['delete'])
    def remove_item(self, request):
        cart = self.get_or_create_cart(request)
        item_id = request.query_params.get('item_id')

        if not item_id:
            return Response({'error': 'Item ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
        cart_item.delete()
        
        # Clear coupon when cart items change
        if cart.coupon:
            cart.coupon = None
            cart.coupon_discount = 0
            cart.save(update_fields=['coupon', 'coupon_discount'])

        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['delete'])
    def clear(self, request):
        cart = self.get_or_create_cart(request)
        cart.items.all().delete()
        cart.coupon = None
        cart.coupon_discount = 0
        cart.save(update_fields=['coupon', 'coupon_discount'])

        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    # ---------- NEW PROMO CODE ACTIONS ----------
    
    @action(detail=False, methods=['post'], url_path='apply-coupon')
    def apply_coupon(self, request):
        """Apply a coupon code to the cart"""
        cart = self.get_or_create_cart(request)
        
        # Validate input
        serializer = CouponApplySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        code = serializer.validated_data['code']
        
        # Check if coupon exists and is active
        try:
            coupon = Coupon.objects.get(code=code, active=True)
        except Coupon.DoesNotExist:
            return Response({
                'valid': False,
                'message': 'Invalid coupon code'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Validate coupon
        if not coupon.is_valid(cart.subtotal):
            if coupon.used_count >= coupon.usage_limit:
                message = 'This coupon has reached its usage limit'
            elif timezone.now() < coupon.valid_from:
                message = f'This coupon will be active from {coupon.valid_from.strftime("%Y-%m-%d")}'
            elif timezone.now() > coupon.valid_to:
                message = 'This coupon has expired'
            elif cart.subtotal < coupon.min_cart_amount:
                message = f'Minimum purchase of PKR {coupon.min_cart_amount} required'
            else:
                message = 'Coupon is not valid'
            
            return Response({
                'valid': False,
                'message': message
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Apply coupon to cart
        discount_amount = coupon.calculate_discount(cart.subtotal)
        
        cart.coupon = coupon
        cart.coupon_discount = discount_amount
        cart.save(update_fields=['coupon', 'coupon_discount'])
        
        # Prepare response similar to what frontend expects
        response_data = {
            'valid': True,
            'code': coupon.code,
            'discount_type': coupon.discount_type,
            'discount_value': str(coupon.discount_value),
            'discount_amount': str(discount_amount),
            'final_subtotal': str(cart.subtotal - discount_amount),
            'message': f'Coupon applied! You saved PKR {discount_amount}'
        }
        
        # Also return updated cart data
        cart_serializer = self.get_serializer(cart)
        response_data['cart'] = cart_serializer.data
        
        return Response(response_data)
    
    @action(detail=False, methods=['post'], url_path='remove-coupon')
    def remove_coupon(self, request):
        """Remove applied coupon from cart"""
        cart = self.get_or_create_cart(request)
        
        cart.coupon = None
        cart.coupon_discount = 0
        cart.save(update_fields=['coupon', 'coupon_discount'])
        
        cart_serializer = self.get_serializer(cart)
        
        return Response({
            'message': 'Coupon removed successfully',
            'cart': cart_serializer.data
        })
    
    @action(detail=False, methods=['post'], url_path='validate-coupon')
    def validate_coupon(self, request):
        """Validate a coupon without applying it (for checking)"""
        cart = self.get_or_create_cart(request)
        
        serializer = CouponApplySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        code = serializer.validated_data['code']
        
        try:
            coupon = Coupon.objects.get(code=code, active=True)
        except Coupon.DoesNotExist:
            return Response({
                'valid': False,
                'message': 'Invalid coupon code'
            })
        
        if not coupon.is_valid(cart.subtotal):
            if coupon.used_count >= coupon.usage_limit:
                message = 'This coupon has reached its usage limit'
            elif timezone.now() < coupon.valid_from:
                message = f'This coupon will be active from {coupon.valid_from.strftime("%Y-%m-%d")}'
            elif timezone.now() > coupon.valid_to:
                message = 'This coupon has expired'
            elif cart.subtotal < coupon.min_cart_amount:
                message = f'Minimum purchase of PKR {coupon.min_cart_amount} required'
            else:
                message = 'Coupon is not valid'
            
            return Response({
                'valid': False,
                'message': message
            })
        
        discount_amount = coupon.calculate_discount(cart.subtotal)
        
        return Response({
            'valid': True,
            'code': coupon.code,
            'discount_type': coupon.discount_type,
            'discount_value': str(coupon.discount_value),
            'discount_amount': str(discount_amount),
            'final_subtotal': str(cart.subtotal - discount_amount),
            'message': f'Valid coupon! You will save PKR {discount_amount}'
        })
        
    @action(detail=False, methods=['get'], url_path='settings')
    def get_store_settings(self, request):
        """Get store settings (shipping cost and tax)"""
        settings = StoreSettings.get_settings()
        serializer = StoreSettingsSerializer(settings)
        return Response(serializer.data)        
    