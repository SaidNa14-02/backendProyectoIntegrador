# backendProyectoIntegrador

## Descripción del Proyecto

Este proyecto es el backend de una aplicación para compartir viajes en vehículo particular. La aplicación permite a los usuarios registrarse, crear rutas, ofrecer viajes compartidos, y reservar asientos en viajes de otros usuarios.

## Requisitos

*   Node.js
*   PostgreSQL
*   Dependencias de npm (listadas en `package.json`)

## Instalación

1.  Clonar el repositorio.
2.  Instalar las dependencias con `npm install`.
3.  Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:
    *   `DB_URL`: La URL de conexión a la base de datos de PostgreSQL.
    *   `JWT_SECRET`: Un secreto para firmar los JSON Web Tokens.
4.  Correr las migraciones de la base de datos (si aplica).
5.  Iniciar el servidor con `npm start` o `node index.js`.

## Endpoints de la API

A continuación se detallan los endpoints disponibles en la API.

### Autenticación

La mayoría de los endpoints requieren autenticación mediante un JSON Web Token (JWT). Para autenticarse, el usuario debe primero registrarse y luego iniciar sesión. El token JWT devuelto en el inicio de sesión debe ser incluido en la cabecera `Authorization` de las solicitudes subsiguientes como un "Bearer token".

`Authorization: Bearer <token>`

---

### Usuarios (`/api/usuarios`)

#### **POST** `/register`

Registra un nuevo usuario en el sistema.

*   **Autenticación:** No requerida.
*   **Cuerpo de la Solicitud:**
    *   `nombre` (string, requerido): Nombre del usuario.
    *   `apellido` (string, requerido): Apellido del usuario.
    *   `correo` (string, requerido): Correo electrónico institucional (`@puce.edu.ec`).
    *   `cedula` (string, requerido): Cédula de identidad.
    *   `password` (string, requerido): Contraseña (mínimo 6 caracteres, con mayúsculas, minúsculas y números).
    *   `conductor` (boolean, opcional): Indica si el usuario es conductor.
    *   `placa` (string, opcional): Placa del vehículo (requerido si `conductor` es `true`).
    *   `capacidadvehiculo` (integer, opcional): Capacidad del vehículo (requerido si `conductor` es `true`).
*   **Ejemplo de Solicitud:**
    ```json
    {
        "nombre": "Juan",
        "apellido": "Perez",
        "correo": "juan.perez@puce.edu.ec",
        "cedula": "1712345678",
        "password": "Password123",
        "conductor": true,
        "placa": "ABC-1234",
        "capacidadvehiculo": 4
    }
    ```

#### **POST** `/login`

Inicia sesión de un usuario.

*   **Autenticación:** No requerida.
*   **Cuerpo de la Solicitud:**
    *   `correo` (string, requerido): Correo electrónico del usuario.
    *   `password` (string, requerido): Contraseña del usuario.
*   **Ejemplo de Solicitud:**
    ```json
    {
        "correo": "juan.perez@puce.edu.ec",
        "password": "Password123"
    }
    ```
*   **Respuesta Exitosa:**
    ```json
    {
        "message": "login exitoso",
        "token": "ey..."
    }
    ```

#### **GET** `/me/profile`

Obtiene el perfil del usuario autenticado.

*   **Autenticación:** Requerida.

#### **PATCH** `/me/password`

Cambia la contraseña del usuario autenticado.

*   **Autenticación:** Requerida.
*   **Cuerpo de la Solicitud:**
    *   `newPassword` (string, requerido): Nueva contraseña.

#### **PATCH** `/:id`

Actualiza el perfil de un usuario.

*   **Autenticación:** Requerida. El usuario solo puede actualizar su propio perfil.
*   **Parámetros:**
    *   `id` (integer, requerido): ID del usuario.
*   **Cuerpo de la Solicitud:** Campos opcionales a actualizar (ver `POST /register`).

#### **DELETE** `/:id`

Elimina un usuario.

*   **Autenticación:** Requerida. El usuario solo puede eliminar su propio perfil.
*   **Parámetros:**
    *   `id` (integer, requerido): ID del usuario.

---

### Rutas (`/api/rutas`)

#### **POST** `/`

Crea una nueva ruta.

*   **Autenticación:** Requerida.
*   **Cuerpo de la Solicitud:**
    *   `titulo` (string, requerido): Título de la ruta.
    *   `descripcion` (string, requerido): Descripción de la ruta.
    *   `punto_inicio` (string, requerido): Punto de inicio de la ruta.
    *   `punto_destino` (string, requerido): Punto de destino de la ruta.
    *   `tipo_transporte` (enum, requerido): "A pie", "Transporte publico", "Auto".
*   **Ejemplo de Solicitud:**
    ```json
    {
        "titulo": "Ruta a la universidad",
        "descripcion": "Ruta desde mi casa a la PUCE",
        "punto_inicio": "Mi casa",
        "punto_destino": "PUCE",
        "tipo_transporte": "Auto"
    }
    ```

#### **GET** `/`

Obtiene todas las rutas de forma paginada.

*   **Autenticación:** Requerida.
*   **Query Params:**
    *   `page` (integer, opcional, default: 1): Número de página.
    *   `limit` (integer, opcional, default: 10): Número de resultados por página.

#### **GET** `/me`

Obtiene todas las rutas creadas por el usuario autenticado.

*   **Autenticación:** Requerida.

#### **GET** `/:id`

Obtiene una ruta por su ID.

*   **Autenticación:** Requerida.
*   **Parámetros:**
    *   `id` (integer, requerido): ID de la ruta.

#### **PUT** `/:id`

Actualiza una ruta.

*   **Autenticación:** Requerida. El usuario solo puede actualizar sus propias rutas.
*   **Parámetros:**
    *   `id` (integer, requerido): ID de la ruta.
*   **Cuerpo de la Solicitud:** Campos opcionales a actualizar (ver `POST /`).

#### **DELETE** `/:id`

Elimina una ruta.

*   **Autenticación:** Requerida. El usuario solo puede eliminar sus propias rutas.
*   **Parámetros:**
    *   `id` (integer, requerido): ID de la ruta.

---

### Rutas Favoritas (`/api/rutas-favoritas`)

#### **POST** `/`

Guarda una ruta como favorita.

*   **Autenticación:** Requerida.
*   **Cuerpo de la Solicitud:**
    *   `rutaId` (integer, requerido): ID de la ruta a guardar.

#### **GET** `/`

Obtiene las rutas favoritas del usuario autenticado.

*   **Autenticación:** Requerida.

#### **GET** `/check/:rutaId`

Verifica si una ruta está guardada como favorita.

*   **Autenticación:** Requerida.
*   **Parámetros:**
    *   `rutaId` (integer, requerido): ID de la ruta.

#### **DELETE** `/:rutaId`

Elimina una ruta de favoritos.

*   **Autenticación:** Requerida.
*   **Parámetros:**
    *   `rutaId` (integer, requerido): ID de la ruta.

---

### Viajes Compartidos (`/api/viajes`)

#### **POST** `/`

Crea un nuevo viaje compartido.

*   **Autenticación:** Requerida.
*   **Cuerpo de la Solicitud:**
    *   `origen` (string, requerido): Origen del viaje.
    *   `destino` (string, requerido): Destino del viaje.
    *   `fecha_hora_salida` (datetime, requerido): Fecha y hora de salida (formato ISO8601).
    *   `asientos_ofrecidos` (integer, requerido): Número de asientos disponibles.
*   **Ejemplo de Solicitud:**
    ```json
    {
        "origen": "Mi casa",
        "destino": "PUCE",
        "fecha_hora_salida": "2025-09-01T07:00:00Z",
        "asientos_ofrecidos": 3
    }
    ```

#### **GET** `/`

Obtiene todos los viajes compartidos.

*   **Autenticación:** Requerida.

#### **GET** `/my/viajes`

Obtiene los viajes compartidos creados por el usuario autenticado.

*   **Autenticación:** Requerida.

#### **GET** `/:id`

Obtiene un viaje compartido por su ID.

*   **Autencticación:** Requerida.
*   **Parámetros:**
    *   `id` (integer, requerido): ID del viaje.

#### **GET** `/:id/passengers`

Lista los pasajeros de un viaje.

*   **Autenticación:** Requerida. Solo el conductor del viaje puede ver los pasajeros.
*   **Parámetros:**
    *   `id` (integer, requerido): ID del viaje.

#### **PATCH** `/:id`

Actualiza un viaje compartido.

*   **Autenticación:** Requerida. Solo el conductor puede actualizar su viaje.
*   **Parámetros:**
    *   `id` (integer, requerido): ID del viaje.
*   **Cuerpo de la Solicitud:** Campos opcionales a actualizar (ver `POST /`). También se puede actualizar el `estado` (enum: 'PROGRAMADO', 'EN_CURSO', 'FINALIZADO', 'CANCELADO').

#### **DELETE** `/:id`

Elimina un viaje compartido.

*   **Autenticación:** Requerida. Solo el conductor puede eliminar su viaje.
*   **Parámetros:**
    *   `id` (integer, requerido): ID del viaje.

---

### Reservas (`/api/reservas`)

#### **POST** `/`

Crea una nueva reserva en un viaje.

*   **Autenticación:** Requerida.
*   **Cuerpo de la Solicitud:**
    *   `viajeId` (integer, requerido): ID del viaje a reservar.

#### **GET** `/`

Obtiene las reservas del usuario autenticado.

*   **Autenticación:** Requerida.

#### **DELETE** `/:id`

Elimina una reserva.

*   **Autenticación:** Requerida.
*   **Parámetros:**
    *   `id` (integer, requerido): ID del viaje del que se quiere eliminar la reserva.

---

### Integración de Mapas (OpenStreetMap - Nominatim)

Este proyecto ha sido extendido para integrar funcionalidades de geocodificación utilizando datos de OpenStreetMap a través del servicio Nominatim. Esto permite convertir direcciones de texto (ej. "Torre Eiffel") en coordenadas geográficas (latitud y longitud) para su almacenamiento y uso en funcionalidades de mapas.


#### **Dependencias Adicionales**

*   **`axios`**: Para realizar peticiones HTTP al servicio Nominatim. Instálalo si aún no lo tienes:
    ```bash
    npm install axios
    ```

#### **Implementación**

1.  **Servicio de Geocodificación (`utils/nominatimService.js`):**
    Se ha creado un nuevo archivo `utils/nominatimService.js` que encapsula la lógica para llamar a la API de Nominatim. Este servicio convierte una dirección de texto en sus coordenadas de latitud y longitud.

    **¡Importante!** Debes actualizar el `User-Agent` en `utils/nominatimService.js` con el nombre de tu aplicación y tu correo electrónico, según la política de uso de Nominatim:
    ```javascript
    'User-Agent': 'backendProyectoIntegrador/1.0 (tu-email@example.com)' // ¡Actualiza esto!
    ```

2.  **Modelos (`models/Ruta.js` y `models/ViajeCompartido.js`):**
    Los métodos `create` y `updateById` en estos modelos han sido modificados para aceptar y almacenar las nuevas columnas de latitud y longitud en la base de datos.

3.  **Controladores (`controllers/rutaControllers.js` y `controllers/viajeCompartidoController.js`):**
    Las funciones `createRuta`, `updateRuta`, `createViajeCompartido` y `updateViajeCompartido` ahora utilizan el servicio `nominatimService.js` para geocodificar las direcciones (`punto_inicio`, `punto_destino`, `origen`, `destino`) antes de guardar o actualizar los datos en la base de datos. Si la geocodificación falla, se devolverá un error 400.

#### **Uso**

Al crear o actualizar una ruta o un viaje compartido a través de los endpoints correspondientes, simplemente proporciona las direcciones de inicio/origen y destino como texto. El backend se encargará automáticamente de geocodificarlas y almacenar las coordenadas asociadas.

#### **Atribución**

Este proyecto utiliza datos de OpenStreetMap y el servicio Nominatim para la geocodificación. Al utilizar esta funcionalidad, aceptas las condiciones de uso de OpenStreetMap y Nominatim.

*   **Datos de OpenStreetMap:** © OpenStreetMap contributors. Disponible bajo la [Open Data Commons Open Database License (ODbL)](https://opendatacommons.org/licenses/odbl/1-0/).
*   **Servicio Nominatim:** Proporcionado por la comunidad de OpenStreetMap.
=======

*   **Autenticación:** Requerida. Solo el conductor puede eliminar su viaje.
*   **Parámetros:**
    *   `id` (integer, requerido): ID del viaje.

---

### Reservas (`/api/reservas`)

#### **POST** `/`

Crea una nueva reserva en un viaje.

*   **Autenticación:** Requerida.
*   **Cuerpo de la Solicitud:**
    *   `viajeId` (integer, requerido): ID del viaje a reservar.

#### **GET** `/`

Obtiene las reservas del usuario autenticado.

*   **Autenticación:** Requerida.

#### **DELETE** `/:id`

Elimina una reserva.

*   **Autenticación:** Requerida.
*   **Parámetros:**
    *   `id` (integer, requerido): ID del viaje del que se quiere eliminar la reserva.

