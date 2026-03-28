# /opt/leman/backend/apps/catalog/views.py
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.postgres.search import SearchQuery, SearchRank
from django.db.models import Count, Avg, Q
from django.utils import timezone
from .models import Product, Category, City, Store, ProductReview
from .serializers import (
    ProductSerializer, 
    ProductListSerializer, 
    CategorySerializer, 
    CitySerializer, 
    StoreDetailSerializer as StoreSerializer,  # ← Алиас при импорте
    StoreListSerializer,
    ProductReviewSerializer as ReviewSerializer
)

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """Публичный API для товаров"""
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductListSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'params__Бренд', 'params__Материал']
    ordering_fields = ['price', 'likes_count', 'views_count', 'avg_rating', 'updated_at']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductSerializer
        return ProductListSerializer
    
    def get_queryset(self):
        qs = super().get_queryset()
        
        # Фильтр по городу (наличие)
        city_id = self.request.query_params.get('city')
        if city_id and city_id.isdigit():
            qs = qs.filter(available_in_cities__contains=[int(city_id)])
        
        # Фильтр по параметрам
        params = self.request.query_params.get('params')
        if params:
            for param in params.split(';'):
                if ':' in param:
                    key, value = param.split(':', 1)
                    qs = qs.filter(params__contains={key: value})
        
        # Полнотекстовый поиск
        query = self.request.query_params.get('q')
        if query:
            qs = qs.annotate(
                rank=SearchRank('search_vector', SearchQuery(query))
            ).filter(rank__gt=0).order_by('-rank')
        
        return qs
    
    @action(detail=True, methods=['post'], url_path='like')
    def like(self, request, pk=None):
        """Лайк товара"""
        product = self.get_object()
        product.likes_count += 1
        product.save(update_fields=['likes_count'])
        return Response({'likes_count': product.likes_count})
    
    @action(detail=True, methods=['post'], url_path='track-click')
    def track_click(self, request, pk=None):
        """Отслеживание клика по партнерской ссылке"""
        product = self.get_object()
        base_url = product.url
        separator = '&' if '?' in base_url else '?'
        redirect_url = f"{base_url}{separator}utm_source=affiliate&utm_medium=referral&utm_campaign=product_{product.xml_id}"
        
        return Response({
            'redirect_url': redirect_url,
            'tracking_id': product.id
        })

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """API для категорий"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    
    @action(detail=True, methods=['get'], url_path='products')
    def products(self, request, slug=None):
        """Товары категории"""
        category = self.get_object()
        products = Product.objects.filter(categories=category, is_active=True)
        
        page = self.paginate_queryset(products)
        if page is not None:
            serializer = ProductListSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        
        serializer = ProductListSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)

class CityViewSet(viewsets.ReadOnlyModelViewSet):
    """API для городов"""
    queryset = City.objects.filter(is_active=True)
    serializer_class = CitySerializer
    lookup_field = 'slug'

class StoreViewSet(viewsets.ReadOnlyModelViewSet):
    """API для магазинов"""
    queryset = Store.objects.filter(is_active=True)
    serializer_class = StoreSerializer
    lookup_field = 'slug'