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
git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git
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

# API

## Autenticación

```
POST /api/auth/login
```

---

## Usuarios

```
GET    /api/usuarios
GET    /api/usuarios/:id
POST   /api/usuarios
PUT    /api/usuarios/:id
DELETE /api/usuarios/:id
```

---

## Incidentes

```
GET    /api/incidentes
GET    /api/incidentes/:id
POST   /api/incidentes
PUT    /api/incidentes/:id
DELETE /api/incidentes/:id
```

---

## Observaciones

```
GET  /api/incidentes/:id/observaciones
POST /api/incidentes/:id/observaciones
```

---

## Estado

```
PATCH /api/incidentes/:id/estado
```

---

## Evidencias

```
POST /api/incidentes/:id/evidencias
```

---

## Bitácora

```
GET /api/bitacora
```

---

# Autor

Kenneth Josué Campos Soto

Universidad Técnica Nacional