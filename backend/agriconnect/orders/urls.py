from django.urls import path
from .views import (
    OrderListCreateView,
    OrderDetailView,
    FarmOrdersView,
    UpdateOrderStatusView,
    OrderDetailView,
    OrderDeleteView
)

urlpatterns = [
    path('', OrderListCreateView.as_view(), name='order-list-create'),
    path('<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('farm/', FarmOrdersView.as_view(), name='farm-orders'),
    path('<int:order_id>/status/', UpdateOrderStatusView.as_view(), name='update-order-status'),
    path('orders/<int:pk>/delete/', OrderDeleteView.as_view(), name='order-delete'),
]