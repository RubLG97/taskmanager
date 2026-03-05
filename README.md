## Task Manager API (Spring Boot)

API REST para gestionar tareas personales, pensada como proyecto de portfolio.  
Cada usuario puede registrarse, iniciar sesión y gestionar **sus propias tareas** (crear, listar, actualizar y eliminar), protegidas con **JWT**.

### Tecnologías principales

- **Backend**: Spring Boot 3 (Java 17)
- **Persistencia**: Spring Data JPA + PostgreSQL
- **Seguridad**: Spring Security + JWT
- **Validación**: Jakarta Bean Validation
- **Documentación**: springdoc-openapi (Swagger UI)

### Arquitectura

- **`controller`**: expone los endpoints REST (`AuthController`, `TaskController`).
- **`service`**: contiene la lógica de negocio (`AuthService`, `TaskService`).
- **`repository`**: acceso a base de datos con JPA (`UserRepository`, `TaskRepository`).
- **`model`**: entidades JPA (`User`, `Task`, `TaskStatus`, `TaskPriority`).
- **`dto`**: objetos de transporte (`LoginRequest`, `RegisterRequest`, `TaskRequest`, `TaskResponse`).
- **`security`**: configuración de seguridad, filtros JWT y utilidades (`SecurityConfig`, `JwtAuthFilter`, `JwtUtils`, `UserDetailsServiceImpl`).

### Endpoints principales

- **Autenticación (`/api/auth`)**
  - `POST /api/auth/register`  
    - Body: `RegisterRequest { username, email, password }`  
    - Respuesta: `{ "token": "JWT..." }`
  - `POST /api/auth/login`  
    - Body: `LoginRequest { username, password }`  
    - Respuesta: `{ "token": "JWT..." }`

- **Tareas (`/api/tasks`)** – requieren header `Authorization: Bearer <token>`
  - `POST /api/tasks` – crea una tarea (`TaskRequest`)
  - `GET /api/tasks` – lista las tareas del usuario autenticado (`List<TaskResponse>`)
  - `PUT /api/tasks/{id}` – actualiza una tarea del usuario
  - `DELETE /api/tasks/{id}` – elimina una tarea del usuario

### Ejemplo de flujo (con Postman o similar)

1. **Registro**
   - `POST http://localhost:8080/api/auth/register`
   - Body (JSON):
     ```json
     {
       "username": "ruben",
       "email": "ruben@example.com",
       "password": "password123"
     }
     ```
   - Respuesta: `{"token": "JWT..."}` → copia el token.

2. **Login** (opcional si ya te has registrado)
   - `POST http://localhost:8080/api/auth/login`
   - Body (JSON):
     ```json
     {
       "username": "ruben",
       "password": "password123"
     }
     ```
   - Respuesta: `{"token": "JWT..."}`.

3. **Crear tarea**
   - `POST http://localhost:8080/api/tasks`
   - Headers:
     - `Authorization: Bearer <JWT>`
     - `Content-Type: application/json`
   - Body (JSON):
     ```json
     {
       "title": "Estudiar Spring Boot",
       "description": "Revisar seguridad con JWT",
       "status": "PENDING",
       "priority": "MEDIUM"
     }
     ```

4. **Listar tareas**
   - `GET http://localhost:8080/api/tasks`
   - Header: `Authorization: Bearer <JWT>`

### Documentación con Swagger UI

Con la dependencia de `springdoc-openapi`, al arrancar la aplicación puedes acceder a:

- **Swagger UI**: `http://localhost:8080/swagger-ui/index.html`
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`

Desde Swagger UI podrás probar los endpoints directamente desde el navegador (enviar `Bearer <token>` en los endpoints protegidos).

### Cómo ejecutar el proyecto localmente

1. **Requisitos previos**
   - Java 17 instalado.
   - PostgreSQL en ejecución (por defecto en `localhost:5432`).
   - Base de datos creada, por ejemplo `taskmanager_db`.

2. **Configurar credenciales**
   - Editar `src/main/resources/application.properties` con:
     - URL de la base de datos.
     - Usuario y contraseña de PostgreSQL.
     - Clave y expiración JWT.

3. **Ejecutar con Maven**
   - Compilar:
     ```bash
     ./mvnw.cmd compile
     ```
   - Ejecutar la aplicación:
     ```bash
     ./mvnw.cmd spring-boot:run
     ```

### Próximas mejoras (roadmap)

- Añadir validaciones más completas en los DTO (anotaciones como `@NotBlank`, `@Email`, etc.).
- Manejo global de errores con `@ControllerAdvice` y respuestas JSON consistentes.
- Filtros para tareas por `status` y `priority`, y soporte de paginación.
- Separar configuración sensible (credenciales DB, secret JWT) en variables de entorno para despliegue.

