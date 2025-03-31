from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count
from orders.models import Order
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

            # 1. TOTAL SALES (Sum of all completed orders for this farm)
            total_sales = Order.objects.filter(
                farm=farm,
                status='completed'
            ).aggregate(total_sales=Sum('total'))['total_sales'] or 0

            # 2. ACTIVE PRODUCTS (Products with quantity > 0)
            active_products = Product.objects.filter(
                farm=farm,
                quantity__gt=0
            ).count()

            # 3. PENDING ORDERS (Orders with status 'pending')
            pending_orders = Order.objects.filter(
                farm=farm,
                status='pending'
            ).count()

            # 4. GROWTH PERCENTAGE (Current vs. previous 30-day period)
            today = timezone.now()
            last_30_days = today - timedelta(days=30)
            previous_30_days = last_30_days - timedelta(days=30)

            # Current period sales (last 30 days)
            current_period_sales = Order.objects.filter(
                farm=farm,
                status='completed',
                created_at__gte=last_30_days,
                created_at__lte=today
            ).aggregate(total=Sum('total'))['total'] or 0

            # Previous period sales (30 days before last 30 days)
            previous_period_sales = Order.objects.filter(
                farm=farm,
                status='completed',
                created_at__gte=previous_30_days,
                created_at__lt=last_30_days
            ).aggregate(total=Sum('total'))['total'] or 0

            # Calculate growth percentage
            if previous_period_sales > 0:
                growth = ((current_period_sales - previous_period_sales) / previous_period_sales) * 100
            else:
                growth = 100 if current_period_sales > 0 else 0

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