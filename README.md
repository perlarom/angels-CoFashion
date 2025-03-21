
## Tecnologías Utilizadas

- Backend: Django (Python)
- Frontend: React.js
- API: Django REST Framework

## Estructura del Proyecto

### Backend (Django)

La estructura del backend está organizada para facilitar la gestión de datos y la creación de APIs. Los principales archivos incluyen:
- apps/api/: Lógica principal del proyecto (modelos, vistas, serializadores).
- core/: Configuración general de la aplicación (rutas, configuración del servidor).
- manage.py: Comando principal para administrar el proyecto Django.

### Frontend (React.js)

El frontend está organizado para construir una interfaz de usuario dinámica e interactiva. Los principales archivos incluyen:
- src/components/: Componentes reutilizables para la interfaz de usuario (lista de productos, tarjetas de productos, botones "me gusta").
- src/App.js: Componente principal que gestiona la estructura de la aplicación.

## Instrucciones de Instalación

1. Clona este repositorio:  
   `git clone https://github.com/perlarom/angels-CoFashion.git`

DJANGO
2. Activar el MySQL:  

3. Abrir la carpeta del repositorio y navegar hasta la carpeta de 'acf':  

4. Activar el entorno virtual:  
   `env\Scripts\activate`

5. Meterse a la carpeta de api:  
   `cd src/api`
6. Ejecutar el siguiente comando para hacer las migraciones:
   `python manage.py makemigrations`

7. Ejecutar el siguiente comando para aplicar las migraciones:
   `python manage.py migrate`
 
8. Activar el servidor:
   `python manage.py runserver`

REACT
9. Abrir en otra termminal si cerra la anterior.

10. Entrar a 'acf'.
    
11. Ejecutar el siguiente comando para activar el servidor:
   `npm run start`


## Cómo Contribuir

1. Realiza un fork del repositorio.
2. Crea una rama con el nombre de la característica o corrección (`git checkout -b nueva-caracteristica`).
3. Realiza los cambios y haz commit (`git commit -m 'Agrega nueva característica'`).
4. Envía un pull request.
