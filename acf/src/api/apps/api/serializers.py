from rest_framework import serializers
from .models import UserProfile, Category, Subcategory, Product, Size, ProductSize, ProductImage, Like, Quantity, Cart

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['first_name', 'last_name', 'username', 'email', 'address', 'password', 'is_superuser']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = UserProfile(**validated_data)
        user.set_password(validated_data['password'])  
        user.save()
        return user

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

class SubcategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Subcategory
        fields = "__all__"

class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = "__all__"

class ProductSizeSerializer(serializers.ModelSerializer):
    size = SizeSerializer()

    class Meta:
        model = ProductSize
        fields = ['size', 'stock']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = "__all__"

class ProductSerializer(serializers.ModelSerializer):
    subcategories = serializers.PrimaryKeyRelatedField(queryset=Subcategory.objects.all(), many=True)
    sizes = ProductSizeSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'total_stock', 'sku', 
            'subcategories', 'sizes', 'images', 'created_at', 'updated_at'
        ]

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['user', 'product', 'created_at']

class QuantitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Quantity
        fields = ['id', 'value']

class CartSerializer(serializers.ModelSerializer):
    quantity = QuantitySerializer() 
    product_name = serializers.CharField(source='product.name')
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2)
    product_image = serializers.SerializerMethodField()
    size_description = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'product_name', 'product_price', 'product_image', 'size_description', 'quantity', 'added_at']

    def create(self, validated_data):
        user = validated_data['user']
        product = validated_data['product']
        quantity = validated_data['quantity']
        
        cart_item, created = Cart.objects.get_or_create(
            user=user, 
            product=product, 
            quantity=quantity
        )
    
    def get_product_image(self, obj):
        if obj.product.images.exists():
            return obj.product.images.first().image_url.url
        return None

    def get_size_description(self, obj):
        return obj.get_size_description()
        
