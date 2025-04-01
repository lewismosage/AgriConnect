# products/urls.py
from django.urls import path
from .views import ProductListCreateView, ProductDetailView, FarmerInventoryView

urlpatterns = [
    path('', ProductListCreateView.as_view(), name='product-list-create'),
    path('<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('inventory/', FarmerInventoryView.as_view(), name='farmer-inventory'),
]