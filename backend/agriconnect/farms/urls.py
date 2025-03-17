from django.urls import path
from .views import FarmList, FarmDetail

urlpatterns = [
    path('farms/', FarmList.as_view()),
    path('farms/<int:pk>/', FarmDetail.as_view()),
]