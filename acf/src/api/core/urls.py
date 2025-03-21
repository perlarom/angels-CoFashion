from django.contrib import admin
from django.urls import path
from django.conf import settings 
from django.conf.urls.static import static
from apps.api.views import enviar_mensaje, get_messages, delete_message, create_product, product_list, ultimos_productos, products_by_subcategory, delete_product
from apps.api.views import login_user, check_username, register_user, obtener_usuarios, obtener_superusuarios
from apps.api.views import CategoryViewSet, SubcategoryViewSet, ProductViewSet, SizeViewSet, ProductSizeViewSet, ProductImageViewSet, LikeToggleView, UserLikesView

urlpatterns = [
    path('admin/', admin.site.urls),
    # Mensajes
    path('api/enviar-mensaje/', enviar_mensaje, name="enviar_mensaje"),
    path('api/messages/', get_messages, name='get_messages'),
    path('api/messages/<int:id>/', delete_message, name='delete_message'),
    # Usuarios
    path('api/login/', login_user, name='login'),
    path('api/check-username', check_username, name='check_username'),
    path("api/usuarios/", obtener_usuarios, name="obtener_usuarios"),
    path('api/register', register_user, name='register_user'),
    path('api/superusuarios/', obtener_superusuarios, name='obtener_superusuarios'),
    # Categorias
    path('api/categories/', CategoryViewSet.as_view({'get': 'list'}), name='category-list'),
    path('api/categories/<int:pk>/', CategoryViewSet.as_view({'get': 'retrieve'}), name='category-detail'),
    path('api/categories/create/', CategoryViewSet.as_view({'post': 'create'}), name='category-create'),
    path('api/categories/<int:pk>/update/', CategoryViewSet.as_view({'put': 'update'}), name='category-update'),
    path('api/categories/<int:pk>/delete/', CategoryViewSet.as_view({'delete': 'destroy'}), name='category-delete'),
    # Subcategorías
    path('api/subcategories/', SubcategoryViewSet.as_view({'get': 'list'}), name='subcategory-list'),
    path('api/subcategories/<int:pk>/', SubcategoryViewSet.as_view({'get': 'retrieve'}), name='subcategory-detail'),
    path('api/subcategories/create/', SubcategoryViewSet.as_view({'post': 'create'}), name='subcategory-create'),
    path('api/subcategories/<int:pk>/update/', SubcategoryViewSet.as_view({'put': 'update'}), name='subcategory-update'),
    path('api/subcategories/<int:pk>/delete/', SubcategoryViewSet.as_view({'delete': 'destroy'}), name='subcategory-delete'),
    # Productos
    path('api/products/', product_list, name='product-list'),
    path('api/products/<int:pk>/', ProductViewSet.as_view({'get': 'retrieve'}), name='product-detail'),
    path('api/products/create/', create_product, name='create_product'),
    # path('api/products/create/', ProductViewSet.as_view({'post': 'create'}), name='product-create'),
    path('api/products/<int:pk>/update/', ProductViewSet.as_view({'put': 'update'}), name='product-update'),
    path('api/products/<int:product_id>/', delete_product, name='delete_product'),
    # Tallas
    path('api/sizes/', SizeViewSet.as_view({'get': 'list'}), name='size-list'),
    path('api/sizes/<int:pk>/', SizeViewSet.as_view({'get': 'retrieve'}), name='size-detail'),
    path('api/sizes/create/', SizeViewSet.as_view({'post': 'create'}), name='size-create'),
    path('api/sizes/<int:pk>/update/', SizeViewSet.as_view({'put': 'update'}), name='size-update'),
    path('api/sizes/<int:pk>/delete/', SizeViewSet.as_view({'delete': 'destroy'}), name='size-delete'),
    # 🚀 Listado de Stock por Talla
    path('api/product-sizes/', ProductSizeViewSet.as_view({'get': 'list'}), name='product-size-list'),
    path('api/product-sizes/<int:pk>/', ProductSizeViewSet.as_view({'get': 'retrieve'}), name='product-size-detail'),
    path('api/product-sizes/create/', ProductSizeViewSet.as_view({'post': 'create'}), name='product-size-create'),
    path('api/product-sizes/<int:pk>/update/', ProductSizeViewSet.as_view({'put': 'update'}), name='product-size-update'),
    path('api/product-sizes/<int:pk>/delete/', ProductSizeViewSet.as_view({'delete': 'destroy'}), name='product-size-delete'),
    path('api/ultimos-productos/', ultimos_productos, name='ultimos_productos'),

    # 🚀 Listado de Imágenes de Producto
    path('api/product-images/', ProductImageViewSet.as_view({'get': 'list'}), name='product-image-list'),
    path('api/product-images/<int:pk>/', ProductImageViewSet.as_view({'get': 'retrieve'}), name='product-image-detail'),
    path('api/product-images/create/', ProductImageViewSet.as_view({'post': 'create'}), name='product-image-create'),
    path('api/product-images/<int:pk>/update/', ProductImageViewSet.as_view({'put': 'update'}), name='product-image-update'),
    path('api/product-images/<int:pk>/delete/', ProductImageViewSet.as_view({'delete': 'destroy'}), name='product-image-delete'),
    path('api/products/subcategory/<str:subcategory_name>/', products_by_subcategory, name='products_by_subcategory'),

    path("api/products/<int:product_id>/like/", LikeToggleView.as_view(), name="like-toggle"),
    path('api/products/likes/', UserLikesView.as_view(), name='user-likes'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)