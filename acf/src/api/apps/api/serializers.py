from rest_framework import serializers
from .models import UserProfile, Category, Subcategory, Product, Size, ProductSize, ProductImage, Like

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