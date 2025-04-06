from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView, PermissionDenied
from .models import Order, TrackingUpdate
from .serializers import OrderSerializer, CreateOrderSerializer, TrackingUpdateSerializer
from django.shortcuts import get_object_or_404
from farms.models import Farm
from accounts.models import User
from django.utils import timezone

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
        # Get the farmer's farm
        farmer_profile = self.request.user.farmer_profile
        if not farmer_profile or not hasattr(farmer_profile, 'farm'):
            return Order.objects.none()
        
        return Order.objects.filter(farm=farmer_profile.farm).order_by('-created_at')

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
    
# Add this to your existing views.py
class OrderDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'farmer':
            return Order.objects.filter(farm__farmer=user)
        return Order.objects.filter(customer=user)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class PaymentVerificationListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderSerializer
    
    def get_queryset(self):
        farmer_profile = self.request.user.farmer_profile
        if not farmer_profile or not hasattr(farmer_profile, 'farm'):
            return Order.objects.none()
        
        status_filter = self.request.query_params.get('status', 'pending')
        return Order.objects.filter(
            farm=farmer_profile.farm,
            status=status_filter
        ).order_by('-created_at')
    
class VerifyPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, order_id):
        order = get_object_or_404(Order, id=order_id)
        
        if request.user != order.farm.farmer:
            return Response(
                {'detail': 'You do not have permission to verify this payment.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Update order status and verified_at timestamp
        order.status = 'verified'
        order.verified_at = timezone.now()
        order.save()
        
        return Response({
            'verified': True,
            'order_id': order_id,
            'amount': str(order.total),
            'status': order.status  # Return the new status
        })
    
class TrackingUpdateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TrackingUpdateSerializer
    
    def perform_create(self, serializer):
        order = get_object_or_404(Order, id=self.kwargs['order_id'])
        
        # Verify permissions
        if self.request.user not in [order.customer, order.farm.farmer]:
            raise PermissionDenied("You don't have permission to update tracking for this order")
            
        serializer.save(
            order=order,
            updated_by=self.request.user,
            status=order.status  # Track the current order status
        )

class TrackingListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TrackingUpdateSerializer
    
    def get_queryset(self):
        order_id = self.kwargs['order_id']
        order = get_object_or_404(Order, id=order_id)
        
        # Verify permissions - customer or farmer can view
        if self.request.user not in [order.customer, order.farm.farmer]:
            raise PermissionDenied("You don't have permission to view tracking for this order")
            
        return TrackingUpdate.objects.filter(order=order).order_by('timestamp')