from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Order
from .serializers import OrderSerializer, CreateOrderSerializer
from django.shortcuts import get_object_or_404
from farms.models import Farm
from accounts.models import User

class OrderListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateOrderSerializer
        return OrderSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'farmer':
            return Order.objects.filter(farm__farmer=user)
        return Order.objects.filter(customer=user)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        
        headers = self.get_success_headers(serializer.data)
        return Response({
            'id': order.id,
            'order_number': order.order_number,
            'status': order.status,
            'total': str(order.total)
        }, status=status.HTTP_201_CREATED, headers=headers)

class OrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'farmer':
            return Order.objects.filter(farm__farmer=user)
        return Order.objects.filter(customer=user)

class FarmOrdersView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderSerializer
    
    def get_queryset(self):
        farm_id = self.kwargs['farm_id']
        farm = get_object_or_404(Farm, id=farm_id)
        
        if self.request.user != farm.farmer:
            return Order.objects.none()
        
        return Order.objects.filter(farm=farm)

class UpdateOrderStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def patch(self, request, order_id):
        order = get_object_or_404(Order, id=order_id)
        
        if request.user != order.farm.farmer:
            return Response(
                {'detail': 'You do not have permission to update this order.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        new_status = request.data.get('status')
        if new_status not in dict(Order.STATUS_CHOICES).keys():
            return Response(
                {'detail': 'Invalid status.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = new_status
        order.save()
        
        return Response(
            {'detail': f'Order status updated to {new_status}.'},
            status=status.HTTP_200_OK
        )