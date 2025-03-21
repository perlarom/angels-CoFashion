from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Mensaje, UserProfile, Category, Subcategory, Product, Size, ProductSize, ProductImage, Like
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.core.exceptions import ValidationError  
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status, viewsets, generics, permissions
from rest_framework.generics import ListAPIView
from apps.api.serializers import UserSerializer, CategorySerializer, SubcategorySerializer, ProductSerializer, SizeSerializer, ProductSizeSerializer, ProductImageSerializer, LikeSerializer
from rest_framework.permissions import IsAuthenticated

import json

@csrf_exempt
def enviar_mensaje(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            nombre = data.get("nombre")
            correo = data.get("correo")
            mensaje = data.get("mensaje")

            nuevo_mensaje = Mensaje(nombre=nombre, correo=correo, mensaje=mensaje)
            nuevo_mensaje.save()

            superuser = User.objects.filter(is_superuser=True).first()
            if superuser:
                email_admin = superuser.email 

                send_mail(
                    subject=f"Nuevo mensaje de {nombre}",
                    message=f"Nombre: {nombre}\nCorreo: {correo}\n\nMensaje:\n{mensaje}",
                    from_email="al222210580@gmail.com",  
                    recipient_list=[email_admin], 
                    fail_silently=False,
                )

            return JsonResponse({"success": True, "message": "Mensaje guardado correctamente"})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)})
    return JsonResponse({"success": False, "message": "Metodo no permitido"}, status=405)

def get_messages(request):
    messages = Mensaje.objects.all()
    message_list = [{"id": msg.id, "nombre": msg.nombre, "correo": msg.correo, "mensaje": msg.mensaje} for msg in messages]
    return JsonResponse({"messages": message_list, "total": len(message_list)})

def delete_message(request, id):
    try:
        message = Mensaje.objects.get(id=id)
        message.delete()
        return JsonResponse({"success": True})
    except Mensaje.DoesNotExist:
        return JsonResponse({"success": False, "message": "Mensaje no encontrado"}, status=404)

# Vista para iniciar sesión
@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'success': True,
            'access_token': str(refresh.access_token),  # Token de acceso
            'refresh_token': str(refresh),  # Token de refresco
            'user': {
                'username': user.username,
                'email': user.email,
                'is_admin': user.is_superuser,
            }
        })
    else:
        return Response({'success': False, 'error': 'Credenciales incorrectas'}, status=400)

# Vista para checar si el usuario existe 
@api_view(['POST'])
def check_username(request):
    username = request.data.get('username')
    if User.objects.filter(username=username).exists():
        return JsonResponse({'available': False})
    return JsonResponse({'available': True})

# Vista para registrar un usuario
@api_view(['POST'])
def register_user(request):
    if request.method == 'POST':
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        username = request.data.get('username')
        email = request.data.get('email')
        address = request.data.get('address')
        password = request.data.get('password')
        confirm_password = request.data.get('confirm_password')

        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'El nombre de usuario ya está en uso'}, status=status.HTTP_400_BAD_REQUEST)

        if password != confirm_password:
            return JsonResponse({'error': 'Las contraseñas no coinciden'}, status=status.HTTP_400_BAD_REQUEST)

        if len(password) < 6:
            return JsonResponse({'error': 'La contraseña debe tener al menos 6 caracteres'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.create_user(username=username, email=email, password=password)
            user.first_name = first_name
            user.last_name = last_name
            user.save()

            # Crear un perfil para el usuario
            user_profile = UserProfile.objects.create(
                user=user,
                first_name=first_name,
                last_name=last_name,
                username=username,
                email=email,
                password=password, 
                address=address,
                last_login=user.last_login
            )

        except ValidationError as e:
            return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return JsonResponse({'success': 'Usuario registrado correctamente'}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def obtener_superusuarios(request):
    superusuarios = User.objects.filter(is_staff=True)
    serializer = UserSerializer(superusuarios, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def obtener_usuarios(request):
    usuarios= UserProfile.objects.all()
    serializer = UserSerializer(usuarios, many=True)
    return Response(serializer.data)

# 📌 ViewSet de Categoría
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

# 📌 ViewSet de Subcategoría
class SubcategoryViewSet(viewsets.ModelViewSet):
    queryset = Subcategory.objects.all()
    serializer_class = SubcategorySerializer

# 📌 ViewSet de Producto
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer

# 📌 ViewSet de Tallas
class SizeViewSet(viewsets.ModelViewSet):
    queryset = Size.objects.all()
    serializer_class = SizeSerializer

# 📌 ViewSet de Stock por Talla
class ProductSizeViewSet(viewsets.ModelViewSet):
    queryset = ProductSize.objects.all()
    serializer_class = ProductSizeSerializer

# 📌 ViewSet de Imágenes de Producto
class ProductImageViewSet(viewsets.ModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer

@api_view(['POST'])
def create_product(request):
    try:
        print("Received Data:", request.data)

        name = request.data.get('name')
        price = request.data.get('price')
        description = request.data.get('description')
        subcategories = request.data.getlist('subcategories[]')  # Ahora obtiene correctamente una lista de subcategorías
        total_stock = request.data.get('total_stock')
        images = request.FILES.getlist('images')  # Recibir varias imágenes
        sizes = {}

        # Obtener tamaños y stock
        for key, value in request.data.items():
            if key.startswith("sizes["):
                size_id = key[6:-1]  # Extraemos el ID del tamaño
                try:
                    sizes[int(size_id)] = int(value)  # Almacenamos el stock para ese tamaño
                except ValueError:
                    return JsonResponse({"message": f"Invalid stock value for size ID {size_id}"}, status=400)

        # Validamos si se proporcionaron los campos necesarios
        if not all([name, price, description, subcategories, total_stock]):
            return JsonResponse({"message": "Missing required fields"}, status=400)

        # Creamos el producto
        product = Product.objects.create(
            name=name,
            price=price,
            description=description,
            total_stock=total_stock,
        )

        # Asociamos las subcategorías
        for subcategory_id in subcategories:
            try:
                subcategory = Subcategory.objects.get(id=subcategory_id)
                product.subcategories.add(subcategory)
            except Subcategory.DoesNotExist:
                return JsonResponse({"message": f"Subcategory ID {subcategory_id} does not exist"}, status=400)

        # Guardamos los tamaños y el stock
        total_stock = 0  # Para calcular el stock total
        for size_id, stock in sizes.items():
            try:
                size = Size.objects.get(id=size_id)
                ProductSize.objects.create(
                    product=product,
                    size=size,
                    stock=stock
                )
                total_stock += stock  # Sumar el stock de cada tamaño
            except Size.DoesNotExist:
                return JsonResponse({"message": f"Size ID {size_id} does not exist"}, status=400)

        # Actualizamos el stock total
        product.total_stock = total_stock
        product.save()

        # Guardamos las imágenes en la tabla ProductImage
        for image in images:
            ProductImage.objects.create(
                product=product,
                image_url=image
            )

        return JsonResponse({"message": "Product created successfully!"}, status=201)

    except ValidationError as e:
        return JsonResponse({"message": str(e)}, status=400)
    except Exception as e:
        return JsonResponse({"message": "Failed to create product", "error": str(e)}, status=500)

@api_view(['DELETE'])  # Asegúrate de que el método DELETE está permitido
def delete_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        product.delete()
        return Response({"message": "Product deleted successfully!"}, status=200)
    except Product.DoesNotExist:
        return Response({"message": "Product not found"}, status=404)

@api_view(['GET'])
def product_list(request):
    try:
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({"message": "Failed to retrieve products", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def products_by_subcategory(request, subcategory_name):
    try:
        # Filtrar productos por subcategoría
        subcategory = Subcategory.objects.get(name=subcategory_name)
        products = Product.objects.filter(subcategories=subcategory)

        # Formatear los productos con sus imágenes como URLs
        data = [
            {
                "id": product.id,
                "name": product.name,
                "price": product.price,
                "images": [image.image_url.url for image in product.images.all()] if product.images.exists() else None
            }
            for product in products
        ]
        
        return Response(data, status=status.HTTP_200_OK)

    except Subcategory.DoesNotExist:
        return Response({"message": "Subcategory not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"message": "Failed to retrieve products", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LikeToggleView(APIView):
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden dar like

    def post(self, request, product_id):
        user = request.user
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Producto no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        # Verificar si ya dio like
        like, created = Like.objects.get_or_create(user=user, product=product)

        if not created:
            like.delete()  # Si ya existe, elimina el "Me Gusta"
            return Response({"message": "Me gusta eliminado"}, status=status.HTTP_200_OK)

        return Response({"message": "Me gusta agregado"}, status=status.HTTP_201_CREATED)
        
class UserLikesView(ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(likes__user=self.request.user)

####EXTRAER LOS ULTIMOS PRODUCTOS######
def ultimos_productos(request):
    products = Product.objects.all().order_by('-id')[:4]  # Obtener los últimos 4 productos por ID
    data = [
        {
            "id": product.id,
            "name": product.name,
            "price": product.price,
            "images": [image.image_url.url for image in product.images.all()] if product.images.exists() else None  # Corregido
         }
        for product in products
    ]
    return JsonResponse(data, safe=False)

# @api_view(['GET'])
# def obtener_tallas(request):
#     sizes = Size.objects.all()
#     serializer = SizeSerializer(sizes, many=True)
#     return Response(serializer.data)

# def get_quantities(request):
#     quantities = list(Quantity.objects.values("id", "amount"))
#     return JsonResponse({"quantities": quantities})

