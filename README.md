# Sistema de Gestión de Incidentes

Sistema web desarrollado con React, Express y Firebase para la gestión de incidentes, evidencias, observaciones, bitácora y control de usuarios mediante autenticación JWT.

---

# Tecnologías utilizadas

## Backend

- Node.js
- Express
- Firebase Firestore
- Firebase Storage
- JWT (JSON Web Token)
- Multer

## Frontend

- React
- Vite
- React Router DOM
- Axios

---

# Clonar el proyecto

```bash
git clone https://github.com/Integrador3-Mt-Agiles/kennethSubiloaQUI.git
```

Entrar al proyecto

```bash
cd integrador
```

---

# Instalación del Backend

Entrar al proyecto principal

```bash
npm install
```

Instalar dependencias utilizadas

```bash
npm install express
npm install cors
npm install firebase-admin
npm install multer
npm install jsonwebtoken
npm install dotenv
npm install nodemon --save-dev
```

---

# Configuración de Firebase

Crear la carpeta:

```
credentials/
```

Dentro colocar el archivo:

```
serviceAccount.json
```

Este archivo debe descargarse desde Firebase Console.

---

# Variables de entorno

Crear un archivo:

```
.env
```

Con el siguiente contenido:

```
JWT_SECRET=TuClaveSecreta
PORT=3000
```

---

# Ejecutar Backend

```bash
npm run dev
```

Servidor disponible en:

```
http://localhost:3000
```

---

# Instalación del Frontend

Entrar a la carpeta web

```bash
cd web
```

Instalar dependencias

```bash
npm install
```

Si fuera necesario instalar manualmente

```bash
npm install react-router-dom
npm install axios
```

---

# Ejecutar Frontend

```bash
npm run dev
```

Disponible en

```
http://localhost:5173
```

---

# Funcionalidades

- Inicio de sesión mediante JWT.
- Gestión de usuarios.
- Registro de incidentes.
- Registro de accidentes.
- Adjuntar evidencias.
- Observaciones por responsables.
- Cambio de estado de incidentes.
- Bitácora de acciones.
- Gestión de roles.
- Autenticación mediante Token.

---

# Roles del sistema

## Administrador

- Gestionar usuarios.
- Consultar bitácora.
- Consultar incidentes.

## Responsable

- Consultar incidentes.
- Agregar observaciones.
- Cambiar estado.
- Consultar evidencias.

## Reportante

- Registrar incidentes.
- Consultar sus incidentes.
- Consultar evidencias.

---

# API y seguridad

La API utiliza autenticación JWT. Excepto el login, las solicitudes deben incluir el token en el encabezado:

```http
Authorization: Bearer <token>
```

Los endpoints responden:

- `401 Unauthorized`: no se proporcionó un token válido o la sesión expiró.
- `403 Forbidden`: el usuario está autenticado, pero su rol o propiedad del recurso no le permite ejecutar la operación.
- `404 Not Found`: el recurso o endpoint solicitado no existe.

La respuesta contiene un mensaje legible para mostrar en el frontend:

```json
{
  "mensaje": "No tiene permisos para realizar esta acción."
}
```

## Autenticación

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/api/auth/login` | Público | Valida las credenciales y devuelve el JWT y el perfil del usuario. |

## Usuarios

Todos los endpoints de usuarios requieren el rol `Administrador`.

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/usuarios` | Lista usuarios sin devolver contraseñas. |
| `GET` | `/api/usuarios/rol/:rol` | Lista usuarios de un rol determinado. |
| `GET` | `/api/usuarios/:id` | Consulta un usuario. |
| `POST` | `/api/usuarios` | Crea un usuario. |
| `PUT` | `/api/usuarios/:id` | Actualiza los campos permitidos de un usuario. |
| `DELETE` | `/api/usuarios/:id` | Elimina un usuario. |

## Incidentes

| Método | Endpoint | Roles permitidos | Descripción |
|---|---|---|---|
| `GET` | `/api/incidentes` | Administrador, Responsable | Lista todos los incidentes. |
| `POST` | `/api/incidentes` | Reportante | Crea un incidente asociado al usuario del JWT. |
| `GET` | `/api/incidentes/reportante/:id` | Administrador, Responsable, Reportante | Lista incidentes de un reportante; un Reportante solo puede consultar su propio ID. |
| `GET` | `/api/incidentes/estado/:estado` | Administrador, Responsable | Filtra incidentes por estado. |
| `GET` | `/api/incidentes/tipo/:tipo` | Administrador, Responsable | Filtra incidentes por tipo. |
| `GET` | `/api/incidentes/:id` | Administrador, Responsable, Reportante propietario | Consulta el detalle de un incidente permitido. |
| `PUT` | `/api/incidentes/:id` | Administrador | Actualiza los campos generales permitidos. |
| `DELETE` | `/api/incidentes/:id` | Administrador | Elimina un incidente. |

## Observaciones y estado

| Método | Endpoint | Roles permitidos | Descripción |
|---|---|---|---|
| `GET` | `/api/incidentes/:id/observaciones` | Usuario con acceso al incidente | Lista las observaciones. |
| `POST` | `/api/incidentes/:id/observaciones` | Responsable | Agrega una observación. |
| `PATCH` | `/api/incidentes/:id/estado` | Responsable | Cambia el estado según la transición permitida. |

## Evidencias

| Método | Endpoint | Roles permitidos | Descripción |
|---|---|---|---|
| `POST` | `/api/incidentes/:id/evidencias` | Usuario con acceso al incidente | Adjunta una imagen JPG, PNG o WEBP de hasta 5 MB. |

## Bitácora

| Método | Endpoint | Roles permitidos | Descripción |
|---|---|---|---|
| `GET` | `/api/bitacora` | Administrador | Consulta la bitácora de acciones. |

## Pruebas de seguridad

Ejecutar desde la raíz:

```bash
npm test
```

Las pruebas comprueban respuestas `401` sin token o con token inválido y respuestas `403` cuando un Reportante intenta ejecutar operaciones administrativas.

---

# Autor

Kenneth Josué Campos Soto

Universidad Técnica Nacional
