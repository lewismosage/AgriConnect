from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count, Q
from orders.models import Order, OrderItem
from products.models import Product
from django.utils import timezone
from datetime import timedelta

class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Get the farmer's farm
            farmer_profile = request.user.farmer_profile
            farm = farmer_profile.farm
            
            if not farm:
                return Response(
                    {'error': 'No farm associated with this user'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Calculate total sales (sum of completed orders containing products from this farm)
            total_sales = Order.objects.filter(
                orderitem__product__farm=farm,
                status='completed'
            ).aggregate(total=Sum('total_amount'))['total'] or 0

            # Count active products (products belonging to this farm with quantity > 0)
            active_products = Product.objects.filter(
                farm=farm,
                quantity__gt=0
            ).count()

            # Count pending orders (orders containing products from this farm that are pending)
            pending_orders = Order.objects.filter(
                orderitem__product__farm=farm,
                status='pending'
            ).distinct().count()

            # Calculate growth percentage (compared to previous period)
            today = timezone.now()
            last_month = today - timedelta(days=30)
            
            # Current period sales
            current_sales = Order.objects.filter(
                orderitem__product__farm=farm,
                status='completed',
                created_at__gte=last_month,
                created_at__lte=today
            ).aggregate(total=Sum('total_amount'))['total'] or 0
            
            # Previous period sales
            previous_period_start = last_month - timedelta(days=30)
            previous_sales = Order.objects.filter(
                orderitem__product__farm=farm,
                status='completed',
                created_at__gte=previous_period_start,
                created_at__lt=last_month
            ).aggregate(total=Sum('total_amount'))['total'] or 0
            
            # Calculate growth percentage
            if previous_sales > 0:
                growth = ((current_sales - previous_sales) / previous_sales) * 100
            else:
                growth = 100 if current_sales > 0 else 0

            return Response({
                'totalSales': float(total_sales),
                'activeProducts': active_products,
                'pendingOrders': pending_orders,
                'growth': round(growth, 2)
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )