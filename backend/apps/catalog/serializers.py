# /opt/leman/backend/apps/catalog/serializers.py
from rest_framework import serializers
from django.contrib.postgres.search import SearchQuery
from .models import Product, Category, City, Store, ProductReview

# ── City Serializers ────────────────────────────────────────
class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name', 'slug', 'latitude', 'longitude', 'population']
        read_only_fields = fields

# ── Store Serializers ───────────────────────────────────────
class StoreListSerializer(serializers.ModelSerializer):
    city = CitySerializer(read_only=True)
    
    class Meta:
        model = Store
        fields = ['id', 'name', 'slug', 'city', 'address', 'phone', 
                  'likes_count', 'avg_rating', 'reviews_count']
        read_only_fields = fields

class StoreDetailSerializer(serializers.ModelSerializer):
    city = CitySerializer(read_only=True)
    
    class Meta:
        model = Store
        fields = ['id', 'name', 'slug', 'city', 'address', 'phone', 
                  'working_hours', 'coordinates', 'likes_count', 
                  'views_count', 'reviews_count', 'avg_rating']
        read_only_fields = fields

# Алиас для совместимости
StoreSerializer = StoreDetailSerializer

# ── Category Serializers ────────────────────────────────────
class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    product_count = serializers.IntegerField(source='products_count', read_only=True)
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'parent', 'level', 'path', 
                  'meta_title', 'meta_description', 'product_count', 'children']
        read_only_fields = fields
    
    def get_children(self, obj) -> list:
        if obj.level >= 2:
            return []
        children = obj.children.filter(is_active=True)[:10]
        return CategorySerializer(children, many=True, context=self.context).data

# ── Product Serializers ─────────────────────────────────────
class ProductListSerializer(serializers.ModelSerializer):
    """Краткий сериализатор для списков товаров"""
    url = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    price_formatted = serializers.SerializerMethodField()
    rating = serializers.DecimalField(source='avg_rating', max_digits=3, decimal_places=2, read_only=True)
    
    # Параметры для фильтров (из XML <param>)
    brand = serializers.CharField(source='params.Бренд', read_only=True)
    material = serializers.CharField(source='params.Материал', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'xml_id', 'name', 'slug', 'url', 'image', 
            'price', 'price_formatted', 'currency', 'in_stock',
            'rating', 'likes_count', 'reviews_count',
            'brand', 'material',
        ]
        read_only_fields = fields
    
    def get_url(self, obj) -> str:
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(f'/product/{obj.slug}/')
        return f'/product/{obj.slug}/'
    
    def get_image(self, obj) -> str:
        if obj.images:
            return obj.images[0]
        return 'https://cdn.lemanapro.ru/lmru/image/upload/d_photoiscoming.png'
    
    def get_price_formatted(self, obj) -> str:
        return f"{int(obj.price)} ₽" if obj.price else 'Цена по запросу'

class ProductSerializer(serializers.ModelSerializer):
    """Полный сериализатор для карточки товара"""
    images = serializers.ListField(child=serializers.URLField(), read_only=True)
    params = serializers.JSONField(source='params', read_only=True)
    categories = CategorySerializer(many=True, read_only=True)
    recent_reviews = serializers.SerializerMethodField()
    partner_url = serializers.SerializerMethodField()
    available_in_cities = CitySerializer(many=True, read_only=True)
    price_formatted = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'xml_id', 'barcode', 'url', 'partner_url',
            'name', 'slug', 'description', 'description_raw',
            'images', 'categories',
            'price', 'price_formatted', 'currency', 'in_stock',
            'pickup_available', 'delivery_available',
            'params', 'weight', 'dimensions',
            'available_in_cities',
            'likes_count', 'views_count', 'reviews_count', 
            'avg_rating', 'recent_reviews',
            'updated_at',
        ]
        read_only_fields = fields
    
    def get_price_formatted(self, obj) -> str:
        return f"{int(obj.price)} ₽" if obj.price else 'Цена по запросу'
    
    def get_partner_url(self, obj) -> str:
        base_url = obj.url
        separator = '&' if '?' in base_url else '?'
        return f"{base_url}{separator}utm_source=affiliate&utm_medium=referral"
    
    def get_recent_reviews(self, obj) -> list:
        reviews = obj.reviews.filter(is_approved=True).order_by('-created_at')[:3]
        return ProductReviewSerializer(reviews, many=True, context=self.context).data

# ── Review Serializers ──────────────────────────────────────
class ProductReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(read_only=True)
    city = CitySerializer(read_only=True)
    store = StoreListSerializer(read_only=True)
    created_at = serializers.DateTimeField(format='%d.%m.%Y %H:%M', read_only=True)
    
    class Meta:
        model = ProductReview
        fields = [
            'id', 'user_name', 'city', 'store', 'rating', 
            'title', 'text', 'likes_count', 'created_at',
            'is_verified_purchase'
        ]
        read_only_fields = fields

# Алиас для совместимости
ReviewSerializer = ProductReviewSerializer