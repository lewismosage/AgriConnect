from rest_framework import serializers
from accounts.serializers import UserSerializer 
from products.models import Product 
from .models import Order, OrderItem, TrackingUpdate
from products.serializers import ProductSerializer
from farms.serializers import FarmSerializer
from farms.models import Farm
from decimal import Decimal

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source='product',
        write_only=True
    )
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_id', 'quantity', 'price']
        extra_kwargs = {
            'price': {'read_only': True}
        }

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    farm = FarmSerializer(read_only=True)
    customer = UserSerializer(read_only=True)
    farm_id = serializers.PrimaryKeyRelatedField(
        queryset=Farm.objects.all(),
        source='farm',
        write_only=True,
        required=True
    )
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'customer', 'farm', 'farm_id', 'status', 
            'created_at', 'updated_at', 'shipping_address', 
            'payment_method', 'subtotal', 'shipping_cost', 
            'tax', 'total', 'items'
        ]
        read_only_fields = [
            'id', 'order_number', 'created_at', 'updated_at', 
            'subtotal', 'shipping_cost', 'tax', 'total', 'status'
        ]

class CreateOrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, required=True)
    farm_id = serializers.PrimaryKeyRelatedField(
        queryset=Farm.objects.all(),
        source='farm',
        write_only=True
    )
    
    class Meta:
        model = Order
        fields = [
            'farm_id', 'shipping_address', 'payment_method', 'items'
        ]
    
    def validate(self, data):
        farm = data.get('farm')
        items = data.get('items', [])
        
        if not farm:
            raise serializers.ValidationError("Farm is required")
        
        if not items:
            raise serializers.ValidationError("At least one item is required")
        
        product_ids = [item.get('product').id for item in items if item.get('product')]
        products = Product.objects.filter(id__in=product_ids)
        
        if products.count() != len(product_ids):
            raise serializers.ValidationError("Some products don't exist")
        
        for product in products:
            if product.farm != farm:
                raise serializers.ValidationError(
                    f"Product {product.id} doesn't belong to farm {farm.id}"
                )
        
        return data
    
    def create(self, validated_data):
        request = self.context.get('request')
        items_data = validated_data.pop('items')
        
        subtotal = sum(
            Decimal(str(item['quantity'])) * Decimal(str(item['product'].price))
            for item in items_data
        )
        shipping_cost = Decimal('5.99')
        tax_rate = Decimal('0.08')
        tax = subtotal * tax_rate
        total = subtotal + shipping_cost + tax
        
        order = Order.objects.create(
            customer=request.user,
            subtotal=subtotal,
            shipping_cost=shipping_cost,
            tax=tax,
            total=total,
            **validated_data
        )
        
        for item_data in items_data:
            OrderItem.objects.create(
                order=order,
                product=item_data['product'],
                quantity=item_data['quantity'],
                price=item_data['product'].price
            )
        
        return order
    
class TrackingUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrackingUpdate
        fields = ['id', 'status', 'location', 'latitude', 'longitude', 'notes', 'timestamp', 'updated_by']
        read_only_fields = ['id', 'timestamp', 'updated_by']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['updated_by'] = instance.updated_by.get_full_name() if instance.updated_by else 'System'
        return representation