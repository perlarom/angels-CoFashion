from django.db import models
from django.contrib.auth.models import User, AbstractUser, Group, Permission
import uuid

class Mensaje(models.Model):
    nombre = models.CharField(max_length=100)
    correo = models.EmailField()
    mensaje = models.TextField()

    def __str__(self):
        return f"Mensaje de {self.nombre}"
#########USUARIO##########
class UserProfile(AbstractUser):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)  
    first_name = models.CharField(max_length=30, default='Sin nombre')
    last_name = models.CharField(max_length=50, null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    groups = models.ManyToManyField(Group, blank=True)
    user_permissions = models.ManyToManyField(Permission, blank=True)
    password = models.CharField(max_length=255, null=True, blank=True) 
    username = models.CharField(max_length=100, null=True, blank=True)  
    email = models.EmailField(null=True, blank=True)  

#######PRODUCTO########
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    
    def __str__(self):
        return self.name
    
class Subcategory(models.Model):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="subcategories")

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    subcategories = models.ManyToManyField(Subcategory)
    total_stock = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    sku = models.CharField(max_length=100, unique=True, blank=True, null=True)  

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)  # Primero guardamos el producto para que se cree el ID
        if not self.sku:
            self.sku = f"ACF{self.id:06d}"  # Luego generamos el SKU usando self.id
            super().save(update_fields=["sku"]) 

    def update_total_stock(self):
        self.total_stock = sum(size.stock for size in self.sizes.all())
        self.save()

    def __str__(self):
        return f"{self.name} ({self.sku})"

class Size(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} - {self.description}"

class ProductSize(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="sizes")
    size = models.ForeignKey(Size, on_delete=models.CASCADE)
    stock = models.PositiveIntegerField()

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.product.update_total_stock()

    def __str__(self):
        return f"{self.product.name} - {self.size.name}"

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image_url = models.ImageField(upload_to='products/')

    def __str__(self):
        return f"Image for {self.product.name}"

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='likes', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "product")  # Evita duplicados

    def __str__(self):
        return f"{self.user.username} le dio like a {self.product.name}"


class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="carts")
    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name="cart_items")
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product') 

    def __str__(self):
        return f"{self.user.username} - {self.product.name} (x{self.quantity})"

    def get_total_price(self):
        return self.product.price * self.quantity

#####CHATBOT#######
class ChatbotConversation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    user_message = models.TextField()
    bot_response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Conversation with {self.user.username if self.user else 'Guest'} on {self.created_at}"

    class Meta:
        ordering = ['-created_at']

class Intent(models.Model):
    name = models.CharField(max_length=100, unique=True)  # Nombre de la intención, por ejemplo "Preguntar por productos"
    response = models.TextField()  # Respuesta predefinida para esta intención
    is_frequently_asked = models.BooleanField(default=False)  # Si es una pregunta frecuente

    def __str__(self):
        return self.name
    
class FAQ(models.Model):
    question = models.CharField(max_length=255, unique=True)  # Pregunta frecuente
    answer = models.TextField()  # Respuesta a la pregunta

    def __str__(self):
        return self.question

class ProductResponse(models.Model):
    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name='product_responses')
    response = models.TextField()  # Respuesta sobre el producto, por ejemplo, detalles o disponibilidad

    def __str__(self):
        return f"Respuesta para {self.product.name}"

class ChatbotConfig(models.Model):
    is_active = models.BooleanField(default=True)  # Si el chatbot está activo o inactivo
    default_response = models.TextField(default="Lo siento, no entendí tu pregunta.")  # Respuesta predeterminada si el chatbot no entiende la consulta

    def __str__(self):
        return "Configuración del Chatbot"

#######AVATAR#######
class Gender(models.Model):
    name = models.CharField(max_length=50, unique=True)
    
    def __str__(self):
        return self.name

class SkinTone(models.Model):
    tone = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.tone

class BodyType(models.Model):
    type_name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.type_name

class Avatar(models.Model):
    user_profile = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name="avatar")
    body_type = models.ForeignKey(BodyType, on_delete=models.SET_NULL, null=True)
    skin_tone = models.ForeignKey(SkinTone, on_delete=models.SET_NULL, null=True)
    gender = models.ForeignKey(Gender, on_delete=models.SET_NULL, null=True)
    height = models.DecimalField(max_digits=4, decimal_places=2)  # Altura del usuario en metros
    avatar_image = models.ImageField(upload_to='avatars/', null=True, blank=True)  # Foto subida por el usuario

    def __str__(self):
        return f"Avatar for {self.user_profile.first_name} {self.user_profile.last_name}"
