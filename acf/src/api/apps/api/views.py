from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Mensaje

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

            return JsonResponse({"success": True, "message": "Mensaje guardado correctamente"})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)})
    return JsonResponse({"success": False, "message": "Metodo no permitido"}, status=405)
