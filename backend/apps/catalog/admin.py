# /opt/leman/backend/apps/catalog/admin.py
from django.contrib import admin
from django.contrib.postgres.search import SearchVector
from django.db.models import Count, Avg, Q
from django.utils.html import format_html
from django.urls import reverse
from import_export.admin import ImportExportModelAdmin
from import_export.resources import ModelResource
from .models import City, Store, Category, Product, ProductReview, UserInteraction


# ── Resources для django-import-export ──────────────────
class ProductResource(ModelResource):
    class Meta:
        model = Product
        exclude = ('search_vector', 'updated_at')
        import_id_fields = ('xml_id',)


# ── Admin для City ──────────────────
@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'population', 'stores_count', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    
    def stores_count(self, obj):
        return obj.stores.count()
    stores_count.short_description = 'Магазинов'


# ── Admin для Store ──────────────────
@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    list_display = ['name', 'city', 'address', 'phone', 'avg_rating', 'is_active']
    list_filter = ['city', 'is_active']
    search_fields = ['name', 'address']
    prepopulated_fields = {'slug': ('name',)}
    
    def stores_count(self, obj):
        return obj.stores.count() if hasattr(obj, 'stores') else 0


# ── Admin для Category ──────────────────
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'level', 'slug', 'products_count']
    list_filter = ['level', 'parent']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['level', 'path']
    
    def products_count(self, obj):
        return obj.products.count() if obj.pk else 0
    products_count.short_description = 'Товаров'


# ── Admin для Product (ИСПРАВЛЕННЫЙ) ──────────────────
@admin.register(Product)
class ProductAdmin(ImportExportModelAdmin):
    resource_class = ProductResource
    
    list_display = [
        'name_link', 
        'xml_id', 
        'price_badge', 
        'in_stock_badge', 
        'brand', 
        'categories_preview', 
        'rating_badge', 
        'updated_at'
    ]
    
    # ✅ Исправленный list_filter (без params__Бренд)
    list_filter = [
        'in_stock', 
        'pickup_available', 
        'delivery_available',
        ('categories', admin.RelatedOnlyFieldListFilter),
    ]
    
    # ✅ Исправленный list_editable (поле должно быть в list_display)
    # Вариант 1: Убрать list_editable совсем (рекомендуется)
    # list_editable = []
    
    # Вариант 2: Если нужно редактировать наличие, добавьте in_stock в list_display
    list_display = [
        'name_link', 
        'xml_id', 
        'price_badge', 
        'in_stock',  # ← Добавьте само поле (не badge)
        'in_stock_badge', 
        'brand', 
        'categories_preview', 
        'rating_badge', 
        'updated_at'
    ]
    list_editable = ['in_stock']  # ← Теперь работает
    
    search_fields = ['name', 'xml_id', 'barcode', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_per_page = 50
    readonly_fields = ['search_vector', 'updated_at']
    
    # Custom display methods
    def name_link(self, obj):
        url = reverse('admin:catalog_product_change', args=[obj.pk])
        return format_html('<a href="{}">{}</a><br><small class="text-muted">{}</small>', 
                          url, obj.name[:60], obj.xml_id)
    name_link.short_description = 'Товар'
    
    def price_badge(self, obj):
        return format_html('<strong>{}</strong>', f'{int(obj.price)} ₽')
    price_badge.short_description = 'Цена'
    
    def in_stock_badge(self, obj):
        color = 'green' if obj.in_stock else 'red'
        icon = '✓' if obj.in_stock else '✗'
        return format_html('<span style="color: {};">{} {}</span>', 
                          color, icon, 'В наличии' if obj.in_stock else 'Нет')
    in_stock_badge.short_description = 'Наличие'
    
    def brand(self, obj):
        return obj.params.get('Бренд', '–') if obj.params else '–'
    brand.short_description = 'Бренд'
    
    def categories_preview(self, obj):
        cats = list(obj.categories.values_list('name', flat=True)[:2])
        return ', '.join(cats) + ('...' if obj.categories.count() > 2 else '')
    categories_preview.short_description = 'Категории'
    
    def rating_badge(self, obj):
        if obj.avg_rating:
            return format_html('★ <strong>{}</strong> <small class="text-muted">({})</small>', 
                              obj.avg_rating, obj.reviews_count)
        return '–'
    rating_badge.short_description = 'Рейтинг'


# ── Admin для ProductReview ──────────────────
@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ['product_name', 'user_name', 'city', 'rating', 'is_approved', 'created_at']
    list_filter = ['is_approved', 'is_verified_purchase', 'city', 'rating']
    search_fields = ['text', 'title', 'user_name', 'product__name']
    list_editable = ['is_approved']
    
    def product_name(self, obj):
        return obj.product.name[:40] + '...' if obj.product and len(obj.product.name) > 40 else (obj.product.name if obj.product else '–')
    product_name.short_description = 'Товар'


# ── Admin для UserInteraction (только просмотр) ──────────────────
@admin.register(UserInteraction)
class UserInteractionAdmin(admin.ModelAdmin):
    list_display = ['content_type', 'object_id', 'interaction_type', 'converted', 'created_at', 'user_ip']
    list_filter = ['content_type', 'interaction_type', 'converted']
    readonly_fields = [f.name for f in UserInteraction._meta.fields]
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False