from django.contrib import admin
from django.urls import path, include
from django.conf import settings 
from rest_framework.routers import DefaultRouter
from django.conf.urls.static import static
from apps.api.views import enviar_mensaje
from apps.api.views import login_user
from apps.api.views import check_username
from apps.api.views import register_user
from apps.api.views import ProductDetailView
from apps.api.views import CategoryList, SubcategoryListView
from apps.api.views import create_product
from apps.api.views import get_products, get_quantities
from apps.api.views import ultimos_productos
from apps.api.views import obtener_usuarios
from apps.api.views import obtener_tallas
from apps.api.views import get_messages
from apps.api.views import delete_message

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/enviar-mensaje/', enviar_mensaje, name="enviar_mensaje"),
    path('api/login/', login_user, name='login'),
    path('api/check-username', check_username, name='check_username'),
    path("api/usuarios/", obtener_usuarios, name="obtener_usuarios"),
    path('api/register', register_user, name='register_user'),
    path("api/create-products/", create_product, name="create_product"),
    path("api/products/", get_products, name="get_products"),
    path("api/sizes/", obtener_tallas, name="obtener_tallas"),
    path('api/categories/', CategoryList.as_view(), name='category-list'),
    path('api/categories/<int:category_id>/subcategories/', SubcategoryListView.as_view(), name='subcategory-list'),
    path('api/ultimos-productos/', ultimos_productos, name='ultimos_productos'),
    path('product/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('api/messages/', get_messages, name='get_messages'),
    path('api/messages/<int:id>/', delete_message, name='delete_message'),
    path('api/quantities/', get_quantities, name='get_quantities'),
] 

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)