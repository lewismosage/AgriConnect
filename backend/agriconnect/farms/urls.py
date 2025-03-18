from django.urls import path
from .views import FarmList, FarmDetail, FarmCreateView

urlpatterns = [
    path('farms/', FarmList.as_view()),
    path('farms/<int:pk>/', FarmDetail.as_view()),
    path('create/', FarmCreateView.as_view(), name='farm-create'),
]