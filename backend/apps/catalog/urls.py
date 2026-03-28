# /opt/leman/backend/apps/catalog/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryViewSet, CityViewSet, StoreViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'cities', CityViewSet, basename='city')
router.register(r'stores', StoreViewSet, basename='store')

urlpatterns = [
    path('', include(router.urls)),
]