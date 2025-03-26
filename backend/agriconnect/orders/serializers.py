from rest_framework import serializers
from accounts.serializers import UserSerializer 
from products.models import Product 
from .models import Order, OrderItem
from products.serializers import ProductSerializer
from farms.serializers import FarmSerializer
from farms.models import Farm  # Added this import

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
    items = OrderItemSerializer(many=True, source='items', required=True)
    
    class Meta:
        model = Order
        fields = [
            'farm_id', 'shipping_address', 'payment_method', 'items'
        ]
    
    def validate(self, data):
        farm = data['farm']
        items = data['items']
        
        product_ids = [item['product'].id for item in items]
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
        
        # Calculate order totals
        subtotal = sum(
            item['quantity'] * item['product'].price
            for item in items_data
        )
        shipping_cost = 5.99  # Could be dynamic based on farm
        tax = subtotal * 0.08  # Example tax calculation
        
        order = Order.objects.create(
            customer=request.user,
            subtotal=subtotal,
            shipping_cost=shipping_cost,
            tax=tax,
            total=subtotal + shipping_cost + tax,
            **validated_data
        )
        
        # Create order items
        for item_data in items_data:
            OrderItem.objects.create(
                order=order,
                product=item_data['product'],
                quantity=item_data['quantity'],
                price=item_data['product'].price
            )
        
        return order