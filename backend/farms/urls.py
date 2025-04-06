from django.urls import path
from .views import FarmList, FarmDetail, FarmCreateView, MyFarmView, FarmProductsView, SubmitRatingView, GetRatingView, UserRatingView, RatingInfoView, RateView

urlpatterns = [
    path('', FarmList.as_view()),
    path('my-farm/', MyFarmView.as_view(), name='my-farm'),
    path('<int:pk>/', FarmDetail.as_view()),
    path('create/', FarmCreateView.as_view(), name='farm-create'),
    path('<int:pk>/products/', FarmProductsView.as_view(), name='farm-products'),
    path('<int:farm_id>/submit-rating/', SubmitRatingView.as_view(), name='submit-rating'),
    path('<int:farm_id>/get-rating/', GetRatingView.as_view(), name='get-rating'),
    path('<int:farm_id>/user-rating/', UserRatingView.as_view(), name='user-rating'),
    path('<int:farm_id>/rating-info/', RatingInfoView.as_view(), name='rating-info'),
    path('<int:farm_id>/rate/', RateView.as_view(), name='rate'),
]