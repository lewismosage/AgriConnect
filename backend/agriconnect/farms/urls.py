from django.urls import path
from .views import FarmList, FarmDetail, FarmCreateView, MyFarmView, FarmProductsView

urlpatterns = [
    path('', FarmList.as_view()),
    path('my-farm/', MyFarmView.as_view(), name='my-farm'),
    path('<int:pk>/', FarmDetail.as_view()),
    path('create/', FarmCreateView.as_view(), name='farm-create'),
    path('<int:pk>/products/', FarmProductsView.as_view(), name='farm-products'),
]