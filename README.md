
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

## Modelos

### Usuario

*   **Archivo:** `models/Usuario.js`
*   **Campos:**
    *   `id` (PK)
    *   `nombre`
    *   `apellido`
    *   `correo` (único)
    *   `cedula` (único)
    *   `password_hash`
    *   `conductor` (booleano)
    *   `placa`
    *   `capacidadvehiculo`
*   **Métodos:**
    *   `create(nuevoUsuario)`: Crea un nuevo usuario.
    *   `findAll()`: Devuelve todos los usuarios.
    *   `getById(id)`: Devuelve un usuario por su ID.
    *   `deleteById(id)`: Elimina un usuario por su ID.
    *   `updateById(id, updatedBody)`: Actualiza un usuario por su ID.
    *   `updatePasswordById(id, newPasswordHash)`: Actualiza la contraseña de un usuario.
    *   `checkCredential(email, password)`: Verifica las credenciales de un usuario.
    *   `findByEmail(email)`: Busca un usuario por su correo.

### Ruta

*   **Archivo:** `models/Ruta.js`
*   **Campos:**
    *   `id` (PK)
    *   `titulo`
    *   `descripcion`
    *   `punto_inicio`
    *   `punto_destino`
    *   `tipo_transporte`
    *   `creador_id` (FK a `usuario.id`)
*   **Métodos:**
    *   `create(nuevaRuta)`: Crea una nueva ruta.
    *   `findAll()`: Devuelve todas las rutas.
    *   `findById(id)`: Devuelve una ruta por su ID.
    *   `updateById(id, updatedBody, creadorId)`: Actualiza una ruta por su ID.
    *   `deleteById(rutaId, creadorId)`: Elimina una ruta por su ID.

### ViajeCompartido

*   **Archivo:** `models/ViajeCompartido.js`
*   **Campos:**
    *   `id` (PK)
    *   `origen`
    *   `destino`
    *   `fecha_hora_salida`
    *   `asientos_ofrecidos`
    *   `id_conductor` (FK a `usuario.id`)
    *   `estado` (ENUM: 'PROGRAMADO', 'EN_CURSO', 'FINALIZADO', 'CANCELADO')
*   **Métodos:**
    *   `createViajeCompartido(viaje)`: Crea un nuevo viaje compartido.
    *   `getViajesCompartidos()`: Devuelve todos los viajes compartidos.
    *   `getById(id)`: Devuelve un viaje compartido por su ID.
    *   `getViajeCompartidoByUserId(userId)`: Devuelve los viajes compartidos de un usuario.
    *   `deleteViajeCompartidoById(id)`: Elimina un viaje compartido por su ID.
    *   `updateViajeById(id, updatedBody, conductorId)`: Actualiza un viaje compartido por su ID.
    *   `updateStatus(viajeId, nuevoEstado)`: Actualiza el estado de un viaje.

### Reserva

*   **Archivo:** `models/Reserva.js`
*   **Campos:**
    *   `id` (PK)
    *   `viaje_id` (FK a `viajecompartido.id`)
    *   `pasajero_id` (FK a `usuario.id`)
*   **Métodos:**
    *   `create(viajeId, pasajeroId)`: Crea una nueva reserva.
    *   `findByPasajeroId(pasajeroId)`: Devuelve las reservas de un pasajero.
    *   `findByViajeId(viajeId)`: Devuelve las reservas de un viaje.
    *   `delete(viajeId, pasajeroId)`: Elimina una reserva.
    *   `getAllUsersInReserve(viajeId)`: Devuelve los usuarios de una reserva.

### RutasGuardadas

*   **Archivo:** `models/RutasGuardadas.js`
*   **Campos:**
    *   `usuario_id` (PK, FK a `usuario.id`)
    *   `ruta_id` (PK, FK a `ruta.id`)
*   **Métodos:**
    *   `guardarRuta(rutaId, usuarioId)`: Guarda una ruta como favorita para un usuario.
    *   `findRutasGuardadasByUsuario(usuarioId)`: Devuelve todas las rutas guardadas por un usuario.
    *   `eliminarRutaGuardada(rutaId, usuarioId)`: Elimina una ruta guardada por un usuario.
    *   `findRutaGuardada(rutaId, usuarioId)`: Verifica si una ruta específica está guardada por un usuario.

## Controladores

### usuarioController.js

*   `createUsuario`: Crea un nuevo usuario.
*   `getAllUsuarios`: Obtiene todos los usuarios.
*   `getUsuarioById`: Obtiene un usuario por su ID.
*   `deleteUsuario`: Elimina un usuario.
*   `updateUsuario`: Actualiza un usuario.
*   `loginUsuario`: Inicia sesión de un usuario.
*   `changePassword`: Cambia la contraseña de un usuario.
*   `getMyProfile`: Obtiene el perfil del usuario autenticado.
*   `getPublicProfile`: Obtiene el perfil público de un usuario.

### rutaControllers.js

*   `createRuta`: Crea una nueva ruta.
*   `getRutas`: Obtiene todas las rutas.
*   `deleteRuta`: Elimina una ruta.
*   `updateRuta`: Actualiza una ruta.

### viajeCompartidoController.js

*   `createViajeCompartido`: Crea un nuevo viaje compartido.
*   `getAllViajesCompartidos`: Obtiene todos los viajes compartidos.
*   `getViajeCompartidoByUserId`: Obtiene los viajes compartidos de un usuario.
*   `getViajeCompartidoById`: Obtiene un viaje compartido por su ID.
*   `deleteViajeCompartido`: Elimina un viaje compartido.
*   `updateViajeCompartido`: Actualiza un viaje compartido.
*   `listarPasajerosDeRuta`: Lista los pasajeros de un viaje.

### reservaController.js

*   `createReserva`: Crea una nueva reserva.
*   `getReservasByUser`: Obtiene las reservas de un usuario.
*   `deleteReserva`: Elimina una reserva.

### rutaFavoritaController.js

*   `guardarRutaFavorita`: Guarda una ruta como favorita para un usuario.
*   `obtenerRutasFavoritas`: Obtiene todas las rutas favoritas de un usuario.
*   `eliminarRutaFavorita`: Elimina una ruta favorita de un usuario.
*   `checkRutaFavorita`: Verifica si una ruta específica está guardada por un usuario.

## Rutas

### Rutas de Usuario (`/api/usuarios`)

*   `POST /register`: Crea un nuevo usuario.
*   `GET /`: Obtiene todos los usuarios (requiere autenticación).
*   `DELETE /:id`: Elimina un usuario (requiere autenticación).
*   `PATCH /:id`: Actualiza un usuario (requiere autenticación).
*   `PATCH /me/password`: Cambia la contraseña del usuario autenticado (requiere autenticación).
*   `GET /me/profile`: Obtiene el perfil del usuario autenticado (requiere autenticación).
*   `POST /login`: Inicia sesión de un usuario.
*   `GET /userprofile/:id`: Obtiene el perfil público de un usuario (requiere autenticación).

### Rutas de Ruta (`/api/rutas`)

*   `POST /`: Crea una nueva ruta (requiere autenticación).
*   `GET /`: Obtiene todas las rutas.
*   `DELETE /:id`: Elimina una ruta (requiere autenticación).
*   `PUT /:id`: Actualiza una ruta (requiere autenticación).

### Rutas de ViajeCompartido (`/api/viajes`)

*   `POST /`: Crea un nuevo viaje compartido (requiere autenticación).
*   `GET /`: Obtiene todos los viajes compartidos.
*   `GET /:id`: Obtiene un viaje compartido por su ID.
*   `GET /my/viajes`: Obtiene los viajes compartidos del usuario autenticado (requiere autenticación).
*   `DELETE /:id`: Elimina un viaje compartido (requiere autenticación).
*   `PATCH /:id`: Actualiza un viaje compartido (requiere autenticación).
*   `GET /:id/passengers`: Lista los pasajeros de un viaje (requiere autenticación).

### Rutas de Reserva (`/api/reservas`)

*   `POST /register`: Crea una nueva reserva (requiere autenticación).
*   `GET /`: Obtiene las reservas del usuario autenticado (requiere autenticación).
*   `DELETE /:id`: Elimina una reserva (requiere autenticación).

### Rutas de Rutas Guardadas (`/api/rutas-favoritas`)

*   `POST /`: Guarda una ruta como favorita para el usuario autenticado (requiere autenticación).
*   `GET /`: Obtiene todas las rutas favoritas del usuario autenticado (requiere autenticación).
*   `DELETE /:rutaId`: Elimina una ruta favorita del usuario autenticado (requiere autenticación).
*   `GET /check/:rutaId`: Verifica si una ruta específica está guardada por el usuario autenticado (requiere autenticación).

## Middleware

### authMiddleware.js

*   `isauthenticated`: Verifica que el usuario esté autenticado mediante un JSON Web Token.

## Validadores

### usuarioValidation.js

*   `usuarioValidate`: Valida los campos para crear un nuevo usuario.
*   `updateProfileValidate`: Valida los campos para actualizar un usuario.
*   `changePasswordValidate`: Valida los campos para cambiar la contraseña.

### rutaFavoritaValidation.js

*   `guardarRutaFavoritaValidate`: Valida los campos para guardar una ruta favorita.
*   `eliminarRutaFavoritaValidate`: Valida los campos para eliminar una ruta favorita.
*   `checkRutaFavoritaValidate`: Valida los campos para verificar una ruta favorita.
