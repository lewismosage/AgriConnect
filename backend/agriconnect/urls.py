# agriconnect/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from farms.views import SearchView
from . import views
from .healthchecks import health_check

urlpatterns = [
    path('', views.home, name='home'),
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/farms/', include('farms.urls')),
    path('api/products/', include('products.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/subscriptions/', include('subscriptions.urls')),
    path('api/farm/', include('analytics.urls')),   
    path('api/search/', SearchView.as_view(), name='search'),
    path('health/', health_check),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)