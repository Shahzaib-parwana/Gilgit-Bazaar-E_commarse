from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Category, Product
from .serializers import (
    CategorySerializer, ProductListSerializer, ProductDetailSerializer
)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(is_active=True, parent=None)
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticatedOrReadOnly()]

    @action(detail=True, methods=['get'])
    def products(self, request, slug=None):
        category = self.get_object()
        products = Product.objects.filter(category=category, is_active=True)
        
        serializer = ProductListSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'is_featured']
    search_fields = ['name', 'description', 'sku']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticatedOrReadOnly()]

    # def get_queryset(self):
    #     queryset = super().get_queryset()
        
    #     # Filter by price range
    #     min_price = self.request.query_params.get('min_price')
    #     max_price = self.request.query_params.get('max_price')
        
    #     if min_price:
    #         queryset = queryset.filter(price__gte=min_price)
    #     if max_price:
    #         queryset = queryset.filter(price__lte=max_price)
        
    #     return queryset
    
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Get search query
        search_query = self.request.query_params.get('search', '')
        
        if search_query:
            # Enhanced search with fuzzy matching
            queryset = queryset.filter(
                Q(name__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(sku__icontains=search_query) |
                Q(category__name__icontains=search_query) |
                Q(tags__name__icontains=search_query)  # If you have tags
            )
            
            # If no results, try partial matching on related categories
            if not queryset.exists():
                # Get products from related categories
                category_matches = Category.objects.filter(
                    Q(name__icontains=search_query) |
                    Q(description__icontains=search_query)
                )
                if category_matches:
                    queryset = Product.objects.filter(
                        category__in=category_matches,
                        is_active=True
                    )
        
        # Filter by bundle/exclude gift hampers
        if not self.request.query_params.get('is_bundle'):
            queryset = queryset.filter(is_bundle=False)
        
        # Filter by price range
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        return queryset

    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_products = self.queryset.filter(is_featured=True)[:8]
        serializer = self.get_serializer(featured_products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        
        if not query:
            return Response({'error': 'Search query is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        products = self.queryset.filter(
            Q(name__icontains=query) | 
            Q(description__icontains=query) |
            Q(category__name__icontains=query)
        )
        
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='gift-hampers')
    def gift_hampers(self, request):
        hampers = self.queryset.filter(is_bundle=True)
        serializer = self.get_serializer(hampers, many=True)
        return Response(serializer.data)
    
    def get_queryset(self):
        qs = super().get_queryset()
        if not self.request.query_params.get('is_bundle'):
            qs = qs.filter(is_bundle=False)
        return qs