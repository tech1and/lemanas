# /opt/leman/backend/apps/catalog/models.py
from django.db import models
#from django.contrib.gis.db import models as gis_models  # ← Для GeoDjango
from django.contrib.postgres.fields import ArrayField
from django.contrib.postgres.indexes import GinIndex
from django.contrib.postgres.search import SearchVectorField


class City(models.Model):
    """66 городов присутствия Лемана Про"""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    population = models.IntegerField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['name']
        indexes = [models.Index(fields=['slug'])]
    
    def __str__(self):
        return self.name


class Store(models.Model):
    """112 физических магазинов"""
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='stores')
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    address = models.TextField()
    phone = models.CharField(max_length=50, blank=True)
    working_hours = models.JSONField(default=dict, blank=True)
    
    # ✅ GeoDjango поле для координат
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    # Метрики вовлеченности
    likes_count = models.PositiveIntegerField(default=0)
    views_count = models.PositiveIntegerField(default=0)
    reviews_count = models.PositiveIntegerField(default=0)
    avg_rating = models.DecimalField(max_digits=3, decimal_places=2, null=True)
    
    is_active = models.BooleanField(default=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['city', 'slug']),
            GinIndex(fields=['name']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.city.name})"


# ... остальные модели (Category, Product, etc.)

class Category(models.Model):
    """Дерево категорий из XML: Дача и сад → Садовый инвентарь → ..."""
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='children')
    level = models.PositiveSmallIntegerField(default=0)  # 0, 1, 2, 3
    path = ArrayField(models.CharField(max_length=200), default=list)  # ['dachai-sad', 'sadovyy-inventar']
    
    # SEO
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True)
    
    # Метрики
    products_count = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['path']
        indexes = [
            models.Index(fields=['parent', 'level']),
            models.Index(fields=['slug']),
        ]
    
    def __str__(self):
        return ' → '.join(self.path) if self.path else self.name

class Product(models.Model):
    """Товары из XML-каталога"""
    # Идентификаторы
    xml_id = models.CharField(max_length=100, unique=True)  # 86100863
    barcode = models.CharField(max_length=100, blank=True, db_index=True)
    url = models.URLField(max_length=500)  # Официальная ссылка Лемана Про
    
    # Основные данные
    name = models.CharField(max_length=300)
    slug = models.SlugField(max_length=300, unique=True)
    description = models.TextField()  # Уникализированное описание
    description_raw = models.TextField(blank=True)  # Исходное из XML
    
    # Категории
    categories = models.ManyToManyField(Category, related_name='products')
    
    # Цена и наличие
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='RUR')
    in_stock = models.BooleanField(default=True)
    pickup_available = models.BooleanField(default=True)
    delivery_available = models.BooleanField(default=True)
    
    # Медиа
    images = ArrayField(models.URLField(max_length=500), default=list)
    
    # Параметры из <param> (JSONB для гибкости)
    params = models.JSONField(default=dict, blank=True)  
    # Пример: {"Бренд": "ПОЛИТЭК", "Материал": "Полипропилен", "Размер": "32 мм"}
    
    # Габариты
    weight = models.DecimalField(max_digits=8, decimal_places=3, null=True)  # кг
    dimensions = models.CharField(max_length=50, blank=True)  # "8.5/8.3/4.9"
    
    # Гео-присутствие (кэшированное)
    available_in_cities = ArrayField(
        models.IntegerField(), 
        default=list,
        help_text="ID городов, где товар есть в наличии"
    )
    
    # Метрики вовлеченности
    likes_count = models.PositiveIntegerField(default=0)
    views_count = models.PositiveIntegerField(default=0)
    reviews_count = models.PositiveIntegerField(default=0)
    avg_rating = models.DecimalField(max_digits=3, decimal_places=2, null=True)
    
    # SEO
    search_vector = SearchVectorField(null=True)  # Для полнотекстового поиска
    
    # Системные
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        indexes = [
            GinIndex(fields=['params']),  # Поиск по параметрам
            GinIndex(fields=['search_vector']),  # Полнотекстовый поиск
            models.Index(fields=['slug']),
            models.Index(fields=['price']),
            models.Index(fields=['-likes_count']),
            models.Index(fields=['-views_count']),
        ]
    
    def __str__(self):
        return self.name

class ProductReview(models.Model):
    """Отзывы пользователей с гео-привязкой"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    store = models.ForeignKey(Store, null=True, blank=True, on_delete=models.SET_NULL)
    city = models.ForeignKey(City, on_delete=models.CASCADE)
    
    user_name = models.CharField(max_length=100)  # Или связь с User, если есть регистрация
    rating = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)])
    title = models.CharField(max_length=200, blank=True)
    text = models.TextField()
    
    # Модерация
    is_approved = models.BooleanField(default=False)
    is_verified_purchase = models.BooleanField(default=False)
    
    # Метрики
    likes_count = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['product', '-created_at']),
            models.Index(fields=['city', 'is_approved']),
        ]

class UserInteraction(models.Model):
    """Лайки, просмотры, клики по партнерским ссылкам"""
    INTERACTION_TYPES = [
        ('view', 'Просмотр'),
        ('like', 'Лайк'),
        ('click', 'Клик по партнерской ссылке'),
        ('share', 'Поделиться'),
    ]
    
    user_ip = models.GenericIPAddressField(unpack_ipv4=True)
    user_agent = models.CharField(max_length=500, blank=True)
    
    content_type = models.CharField(max_length=20, choices=[
        ('product', 'Товар'), ('store', 'Магазин'), ('category', 'Категория')
    ])
    object_id = models.IntegerField()
    
    interaction_type = models.CharField(max_length=20, choices=INTERACTION_TYPES)
    city_id = models.IntegerField(null=True, blank=True)  # Для аналитики
    
    # Партнёрская аналитика
    partner_click_id = models.CharField(max_length=100, blank=True)
    converted = models.BooleanField(default=False)
    commission_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['content_type', 'object_id', 'interaction_type']),
            models.Index(fields=['-created_at']),
        ]
        # Уникальность: один пользователь не может лайкнуть дважды
        constraints = [
            models.UniqueConstraint(
                fields=['user_ip', 'content_type', 'object_id', 'interaction_type'],
                name='unique_user_interaction',
                condition=models.Q(interaction_type='like')
            ),
        ]