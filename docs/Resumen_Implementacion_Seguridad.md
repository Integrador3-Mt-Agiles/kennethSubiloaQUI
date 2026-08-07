# Resumen de implementación de seguridad

## Objetivo

Se protegieron los endpoints del Sistema de Gestión de Incidentes para cumplir el Entregable n.° 6: autenticación con JWT, autorización por roles, control de acceso a recursos y respuestas HTTP `401` y `403` con mensajes comprensibles.

## Cambios realizados en el backend

### JWT

- Se eliminó el secreto JWT escrito directamente en el código.
- El secreto ahora se obtiene de `JWT_SECRET` en las variables de entorno.
- La aplicación no inicia si no existe `JWT_SECRET`.
- Los tokens se firman con `HS256` e incluyen emisor, audiencia y expiración de ocho horas.
- Los tokens emitidos antes de este cambio dejan de ser válidos y los usuarios deben iniciar sesión nuevamente.
- Se eliminó el registro del header `Authorization` para no exponer tokens en la consola.

### Respuestas de autenticación y autorización

- Sin token: HTTP `401` y mensaje `Debe iniciar sesión para continuar.`
- Token inválido o expirado: HTTP `401` y mensaje explicando que debe iniciar sesión nuevamente.
- Rol insuficiente: HTTP `403` y mensaje `No tiene permisos para realizar esta acción.`
- Recurso inexistente: HTTP `404` y un mensaje legible.
- El código HTTP permanece en la respuesta para que el frontend y las pruebas puedan interpretarlo; el usuario ve el texto del campo `mensaje`.

### Usuarios

- Todos los endpoints `/api/usuarios` requieren token de Administrador.
- Un usuario anónimo ya no puede crear administradores, editar roles o eliminar usuarios.
- Las respuestas de usuarios ya no incluyen el campo `password`.
- Las actualizaciones aceptan únicamente nombre, correo, contraseña, rol y estado activo.
- Se rechazan roles o datos inválidos.
- Los usuarios con `activo: false` no pueden iniciar sesión.

### Incidentes

- Todos los endpoints `/api/incidentes` requieren token.
- Administrador y Responsable pueden listar todos los incidentes.
- Reportante puede crear incidentes y consultar únicamente los suyos.
- El `reportanteId` de un incidente nuevo se obtiene del JWT, no del cuerpo enviado por el navegador.
- Solo Administrador puede editar o eliminar incidentes.
- La actualización general ya no acepta `estado`, `evidencias` o `fechaRegistro`; el estado debe cambiarse por su endpoint controlado.
- Se agregó un middleware de propiedad: un Reportante recibe `403` si intenta abrir un incidente ajeno.

### Observaciones y estados

- Consultar observaciones requiere token y acceso al incidente.
- Agregar observaciones requiere el rol Responsable y acceso al incidente.
- Cambiar estado requiere el rol Responsable y acceso al incidente.
- Las transiciones de estado existentes se mantienen.

### Evidencias

- La carga de evidencias requiere token y acceso al incidente.
- La autorización se ejecuta antes de que Multer procese el archivo.
- Se agregó límite de 5 MB por imagen.
- Solo se aceptan MIME JPG, PNG y WEBP.
- El incidente se verifica antes de guardar el archivo.
- Los archivos se organizan en una carpeta por incidente y ya no usan directamente el nombre suministrado por el usuario.

### API general

- Los endpoints inexistentes devuelven `404` con un mensaje legible.
- Los errores inesperados devuelven un mensaje genérico para no exponer detalles internos.
- El servidor utiliza `PORT` y el CORS puede configurarse con `FRONTEND_URL`.

## Cambios realizados en el frontend

- La pantalla pública se movió a `/login`.
- Después del login se navega a `/dashboard`.
- Las páginas privadas ahora usan `ProtectedRoute`.
- Usuarios y Bitácora solo pueden abrirse con rol Administrador.
- Un usuario sin sesión es enviado al login.
- Un usuario con rol incorrecto es enviado al dashboard.
- Cuando la API devuelve `401`, se elimina la sesión local y se vuelve al login.
- Los errores recibidos del backend se presentan mediante mensajes legibles.
- Reportante consulta sus propios incidentes y puede crear uno nuevo.
- Administrador puede editar y eliminar incidentes.
- Responsable puede agregar observaciones y cambiar estados.
- Los botones y formularios se muestran según el rol.
- Se corrigió la redirección que devolvía al usuario al login después de iniciar sesión.
- Se eliminó el mensaje duplicado “No hay evidencias”.
- El formulario de edición de usuario ya no recibe la contraseña existente; una contraseña nueva es opcional durante la edición.

## Matriz implementada

| Operación | Administrador | Responsable | Reportante |
|---|:---:|:---:|:---:|
| Administrar usuarios | Sí | No | No |
| Consultar bitácora | Sí | No | No |
| Listar todos los incidentes | Sí | Sí | No |
| Consultar incidente | Sí | Sí | Solo propio |
| Crear incidente | No | No | Sí |
| Editar/eliminar incidente | Sí | No | No |
| Consultar observaciones | Sí | Sí | Solo de incidente propio |
| Agregar observación | No | Sí | No |
| Cambiar estado | No | Sí | No |
| Adjuntar evidencia | Sí | Sí | Solo en incidente propio |

## Pruebas agregadas

Se agregó el comando:

```bash
npm test
```

Casos automáticos:

1. `401` al consultar usuarios sin token.
2. `401` al utilizar un token inválido.
3. `403` cuando un Reportante intenta administrar usuarios.
4. `403` cuando un Reportante intenta listar todos los incidentes.

Resultado actual: **4 pruebas aprobadas de 4**.

También se verificó:

- Sintaxis de todos los archivos del backend: correcta.
- Carga de la aplicación Express: correcta.
- Build de producción del frontend: correcto.

## Aspectos pendientes fuera de esta implementación

- Las contraseñas existentes continúan almacenadas en texto plano. Se recomienda migrar a Firebase Authentication o Argon2/bcrypt en una siguiente tarea controlada.
- Las evidencias todavía se vuelven públicas mediante `makePublic()`; se recomiendan URLs firmadas con expiración.
- El lint del frontend sigue fallando por errores React que ya existían en efectos y orden de funciones. El build sí termina correctamente.
- Falta probar manualmente con usuarios reales de los tres roles y capturar evidencia para el documento del profesor.
- La sesión de Firebase CLI está expirada, por lo que no se pudo consultar la edición de la base remota.

## Guion breve para demostrar al profesor

1. Iniciar sesión como Administrador y mostrar el token en la respuesta del login.
2. Consultar Bitácora con token de Administrador: `200`.
3. Repetir sin token: `401` con mensaje.
4. Repetir con token de Responsable: `403` con mensaje.
5. Mostrar que Reportante puede crear y consultar su propio incidente.
6. Intentar consultar un incidente ajeno como Reportante: `403`.
7. Mostrar que Responsable puede agregar una observación y cambiar el estado.
8. Mostrar que Reportante no puede administrar usuarios ni cambiar estados.
