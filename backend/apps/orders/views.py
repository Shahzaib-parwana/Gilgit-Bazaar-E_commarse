# orders/views.py

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderCreateSerializer, OrderStatusUpdateSerializer
from apps.products.models import Product, ProductVariant


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        elif self.action == 'update_status':
            return OrderStatusUpdateSerializer
        return OrderSerializer

    def _validate_stock_for_item(self, product, variant, quantity):
        """
        Validate stock for a single cart item (supports bundles).
        Returns (is_valid, error_message).
        """
        if product.is_bundle:
            # Bundle: check component availability
            if variant is not None:
                return False, "Gift hampers do not support variants"
            available = product.available_bundles()
            if available is None:
                return False, "This hamper has no items defined"
            if available < quantity:
                return False, f'Only {available} units of "{product.name}" available'
        else:
            # Regular product (existing logic)
            if variant:
                if variant.stock < quantity:
                    return False, f'Insufficient stock for {product.name} - {variant.color} {variant.size}'
            else:
                if product.stock < quantity:
                    return False, f'Insufficient stock for {product.name}'
        return True, None

    def _deduct_stock_for_item(self, order_item):
        """Deduct stock for a single order item (supports bundles)."""
        product = order_item.product
        quantity = order_item.quantity

        if product.is_bundle:
            # Bundle: iterate over components and deduct each
            for bundle_item in product.bundle_items.all():
                component = bundle_item.product
                component.stock -= (bundle_item.quantity * quantity)
                component.save()
        else:
            # Regular product (existing logic)
            if order_item.variant:
                order_item.variant.stock -= quantity
                order_item.variant.save()
            else:
                product.stock -= quantity
                product.save()

    def _restore_stock_for_item(self, order_item):
        """Restore stock for a single order item (used on cancellation)."""
        product = order_item.product
        quantity = order_item.quantity

        if product.is_bundle:
            for bundle_item in product.bundle_items.all():
                component = bundle_item.product
                component.stock += (bundle_item.quantity * quantity)
                component.save()
        else:
            if order_item.variant:
                order_item.variant.stock += quantity
                order_item.variant.save()
            else:
                product.stock += quantity
                product.save()

    def create(self, request, *args, **kwargs):
        serializer = OrderCreateSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        # 1. Validate stock for all items (including bundles)
        items_data = serializer.validated_data['items']
        for item in items_data:
            product = get_object_or_404(Product, id=item['product_id'])
            variant = None
            if item.get('variant_id'):
                variant = get_object_or_404(ProductVariant, id=item['variant_id'])

            valid, error_msg = self._validate_stock_for_item(product, variant, item['quantity'])
            if not valid:
                return Response({'error': error_msg}, status=status.HTTP_400_BAD_REQUEST)

        # 2. Create the order (OrderCreateSerializer handles order and order items)
        order = serializer.save()

        # 3. Deduct stock for each order item (bundles expanded, regular unchanged)
        for order_item in order.items.all():
            self._deduct_stock_for_item(order_item)

        # 4. Trigger order confirmation email (your existing task)
        from apps.notifications.tasks import send_order_confirmation_email
        send_order_confirmation_email.delay(order.id)

        return Response(
            OrderSerializer(order, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAdminUser])
    def update_status(self, request, pk=None):
        order = self.get_object()
        serializer = OrderStatusUpdateSerializer(order, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()

            from apps.notifications.tasks import send_order_status_update_email
            send_order_status_update_email.delay(order.id)

            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        order = self.get_object()

        if order.status in ['shipped', 'delivered']:
            return Response(
                {'error': 'Cannot cancel order that has been shipped or delivered'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Restore stock for each item (bundles expanded, regular unchanged)
        for item in order.items.all():
            self._restore_stock_for_item(item)

        order.status = 'cancelled'
        order.save()

        return Response({'message': 'Order cancelled successfully'})