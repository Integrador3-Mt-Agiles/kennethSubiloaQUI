# Análisis del Entregable n.° 6: Seguridad del sistema

**Proyecto:** Sistema de Registro y Seguimiento de Incidentes y Accidentes  
**Entregable:** Seguridad con JWT, roles y permisos  
**Fecha del análisis:** 6 de agosto de 2026  
**Estado evaluado:** Código fuente actual del repositorio

---

## 1. Propósito de este documento

Este documento compara el estado real del proyecto con lo solicitado en el material del profesor para el Entregable n.° 6. También registra los errores de seguridad, funcionalidad, calidad y despliegue encontrados en el proyecto.

El requisito central del entregable no consiste únicamente en generar un JWT. El sistema debe demostrar:

1. Inicio de sesión.
2. Obtención de un token JWT.
3. Envío y validación del token.
4. Protección de endpoints.
5. Autorización según roles y operaciones.
6. Respuesta HTTP `401 Unauthorized` cuando no existe un token válido.
7. Respuesta HTTP `403 Forbidden` cuando el usuario está autenticado, pero no tiene permiso.
8. Evidencia clara de qué rol puede utilizar cada endpoint.

La idea fundamental expresada en la guía es: **autenticarse no es lo mismo que estar autorizado**.

---

## 2. Resumen ejecutivo

El proyecto tiene una implementación parcial de JWT y roles, pero no satisface todavía el Entregable n.° 6. El login genera un token y algunos endpoints comprueban el token y el rol; sin embargo, la mayoría de las operaciones sensibles están abiertas al público.

Los problemas de mayor gravedad son:

- Las contraseñas se almacenan y devuelven en texto plano.
- El secreto JWT está escrito directamente en el código.
- Cualquier persona puede crear un usuario Administrador sin autenticarse.
- Cualquier persona puede modificar el rol o la contraseña de un usuario.
- Todos los endpoints de incidentes están abiertos.
- La carga de evidencias está abierta y no limita tamaño ni tipo real de archivo.
- Los roles se ocultan parcialmente en la interfaz, pero no se aplican consistentemente en la API.
- El frontend no protege sus rutas.
- No existen pruebas automatizadas ni evidencia sistemática de respuestas `401` y `403`.

Por lo anterior, el proyecto permite demostrar la generación y uso básico de un JWT, pero **no permite afirmar que el sistema tiene un control de acceso completo o que sea seguro**.

### Evaluación por requisito

| Requisito del profesor | Estado | Observación |
|---|---:|---|
| Login | Parcial | El endpoint existe, pero las contraseñas se comparan en texto plano. |
| Obtención de token | Cumple parcialmente | Se genera un JWT con duración de 8 horas. |
| Uso del token | Parcial | Axios envía `Authorization: Bearer`, pero muchas rutas no lo validan. |
| Validación del token | Parcial | El middleware valida firma y expiración, pero usa un secreto hardcodeado. |
| Protección de endpoints | No cumple | La mayoría de endpoints sensibles están públicos. |
| Roles | Parcial | Existen tres roles, pero no se aplican a todas las operaciones. |
| Permisos por operación | No cumple | No hay una política completa y uniforme. |
| HTTP 401 sin token | Parcial | Solo se demuestra en las pocas rutas protegidas. |
| HTTP 403 sin permiso | Parcial | Solo se demuestra donde se usa `verificarRol`. |
| Frontend protegido | No cumple | `ProtectedRoute` existe, pero no se utiliza. |
| Evidencia de pruebas | No cumple | No hay pruebas automatizadas ni colección documentada de casos. |

---

## 3. Arquitectura de seguridad actual

El frontend React envía las credenciales al endpoint `POST /api/auth/login`. El backend consulta la colección `usuarios` en Firestore, compara la contraseña recibida con la almacenada y genera un JWT propio.

El token contiene estos claims:

- `id`: identificador del documento del usuario.
- `nombre`: nombre del usuario.
- `correo`: correo del usuario.
- `rol`: rol utilizado para autorizar operaciones.
- `iat`: fecha de emisión agregada por la biblioteca JWT.
- `exp`: fecha de expiración agregada por la biblioteca JWT.

La duración configurada es de ocho horas. El frontend guarda el token en `localStorage` y un interceptor de Axios lo agrega a las solicitudes como:

```http
Authorization: Bearer <token>
```

El middleware `verificarToken` valida la firma y expiración. Cuando la ruta también incorpora `verificarRol`, se compara el rol del token con la lista de roles permitidos.

### Autenticación frente a autorización

**Autenticación** responde: “¿Quién es el usuario?”. En este proyecto corresponde al login y a la validación del JWT.

**Autorización** responde: “¿Qué puede hacer ese usuario?”. En este proyecto debería corresponder a `verificarRol` y, cuando aplique, a controles de propiedad como “un Reportante solo puede consultar sus propios incidentes”.

La autenticación existe parcialmente. La autorización es incompleta porque muchos endpoints nunca ejecutan los middlewares.

---

## 4. Roles del sistema y responsabilidades esperadas

Los roles reales definidos por el proyecto son:

### Administrador

- Crear, consultar, actualizar y desactivar usuarios.
- Asignar roles.
- Consultar la bitácora.
- Consultar todos los incidentes.
- Realizar tareas administrativas expresamente autorizadas.

### Responsable

- Consultar incidentes asignados o disponibles para atención.
- Agregar observaciones de seguimiento.
- Cambiar el estado siguiendo la transición permitida.
- Consultar evidencias.

### Reportante

- Registrar incidentes propios.
- Consultar sus propios incidentes.
- Adjuntar evidencias a incidentes propios, si esa es la regla de negocio acordada.
- Consultar el progreso y las observaciones permitidas de sus incidentes.

No basta con mostrar u ocultar botones según el rol. Los permisos siempre deben comprobarse en el backend.

---

## 5. Matriz de permisos recomendada

Esta matriz debe confirmarse con el profesor o el Product Owner y luego aplicarse literalmente en las rutas.

| Operación | Administrador | Responsable | Reportante |
|---|:---:|:---:|:---:|
| Iniciar sesión | Sí | Sí | Sí |
| Listar todos los usuarios | Sí | No | No |
| Consultar un usuario | Sí | Propio, si se necesita | Propio, si se necesita |
| Crear usuario | Sí | No | No |
| Cambiar rol | Sí | No | No |
| Desactivar usuario | Sí | No | No |
| Consultar todos los incidentes | Sí | Sí | No |
| Consultar incidentes propios | Sí | Según asignación | Sí |
| Crear incidente | Opcional | No | Sí |
| Editar datos generales de incidente | Sí | Según regla | Solo propio y campos permitidos |
| Eliminar incidente | Sí | No | No |
| Agregar observación | Opcional | Sí | No |
| Cambiar estado | Opcional | Sí | No |
| Adjuntar evidencia | Sí | Sí | Solo en incidente propio |
| Consultar bitácora | Sí | No | No |

Además del rol, algunas operaciones requieren verificar la propiedad del recurso. Un Reportante autenticado no debe poder usar el ID de otro usuario en la URL o el cuerpo para consultar o alterar incidentes ajenos.

---

## 6. Inventario real de endpoints y brechas

### Autenticación

| Método y endpoint | Protección actual | Estado |
|---|---|---|
| `POST /api/auth/login` | Público | Correcto que sea público, pero el manejo de contraseñas es inseguro. |

### Usuarios

| Método y endpoint | Protección actual | Protección requerida |
|---|---|---|
| `GET /api/usuarios` | Solo token, cualquier rol | Token + Administrador |
| `GET /api/usuarios/:id` | Ninguna | Administrador o dueño del perfil |
| `POST /api/usuarios` | Ninguna | Token + Administrador |
| `PUT /api/usuarios/:id` | Ninguna | Token + Administrador; DTO estricto |
| `DELETE /api/usuarios/:id` | Ninguna | Token + Administrador |
| `GET /api/usuarios/rol/:rol` | Ninguna | Token + rol autorizado |

La brecha más grave es `POST /api/usuarios`: una persona sin sesión puede enviar `rol: "Administrador"` y crear una cuenta privilegiada.

### Incidentes

| Método y endpoint | Protección actual | Protección requerida |
|---|---|---|
| `GET /api/incidentes` | Ninguna | Token + Administrador/Responsable; filtrar para Reportante |
| `POST /api/incidentes` | Ninguna | Token + Reportante; obtener `reportanteId` del token |
| `GET /api/incidentes/:id` | Ninguna | Token + rol y propiedad/asignación |
| `PUT /api/incidentes/:id` | Ninguna | Token + permisos y campos permitidos |
| `DELETE /api/incidentes/:id` | Ninguna | Token + Administrador |
| `GET /api/incidentes/reportante/:id` | Ninguna | Token; evitar que un Reportante consulte otro ID |
| `GET /api/incidentes/estado/:estado` | Ninguna | Token + Administrador/Responsable |
| `GET /api/incidentes/tipo/:tipo` | Ninguna | Token y filtro según alcance del usuario |

El `PUT` acepta cualquier objeto y permite cambiar directamente `estado`, eludiendo el endpoint protegido y las transiciones de estado.

### Observaciones, estados, evidencias y bitácora

| Método y endpoint | Protección actual | Estado/recomendación |
|---|---|---|
| `GET /api/incidentes/:id/observaciones` | Token | Agregar autorización sobre el incidente. |
| `POST /api/incidentes/:id/observaciones` | Token + Responsable | Bien encaminado; comprobar acceso al incidente. |
| `PATCH /api/incidentes/:id/estado` | Token + Responsable | Bien encaminado; usar transacción y validar asignación. |
| `POST /api/incidentes/:id/evidencias` | Ninguna | Debe requerir token, rol/propiedad y límites de archivo. |
| `GET /api/bitacora` | Token + Administrador | Es el endpoint mejor alineado con el entregable. |

---

## 7. Fallos críticos de seguridad

### 7.1 Contraseñas en texto plano

Las contraseñas se guardan directamente en Firestore y se comparan como strings. No existe hashing, salt ni un proveedor de identidad.

Impacto:

- Una filtración expone inmediatamente todas las cuentas.
- Los endpoints de usuarios pueden devolver contraseñas.
- El formulario de edición recibe y muestra internamente la contraseña existente.
- Un Administrador u atacante puede conocer credenciales reutilizadas en otros servicios.

Corrección:

- Recomendado: usar Firebase Authentication y almacenar en Firestore únicamente perfil, rol y estado.
- Alternativa: usar Argon2id o bcrypt, nunca devolver el hash y crear un flujo separado para cambiar contraseña.
- Migrar o restablecer todas las contraseñas existentes.

### 7.2 Secreto JWT hardcodeado

El valor `ProyectoIntegradorJWT` está escrito en `src/utils/jwt.js`. La variable `JWT_SECRET` de `.env` no se usa.

Impacto: cualquier persona que conozca el código puede firmar un token que declare el rol `Administrador`.

Corrección:

- Leer `process.env.JWT_SECRET`.
- Exigir un secreto largo y aleatorio.
- Impedir que la aplicación arranque si falta.
- Rotar el secreto después de corregirlo; todos los tokens actuales deben considerarse comprometidos.
- Validar explícitamente algoritmo, emisor y audiencia.

### 7.3 Confianza excesiva en los claims del token

El middleware acepta el ID y el rol firmados durante ocho horas, pero no comprueba nuevamente que el usuario exista, esté activo o conserve el rol.

Impacto: borrar, desactivar o cambiar el rol de un usuario no revoca inmediatamente su acceso.

Corrección:

- Consultar el estado actual del usuario para operaciones sensibles o implementar una estrategia de revocación/versionado.
- No permitir login cuando `activo !== true`.
- Considerar tokens de menor duración y refresh tokens controlados.

### 7.4 Exposición del token en registros

`auth.middleware.js` imprime el header `Authorization` completo. Esto puede copiar JWT válidos a logs locales o de producción.

Corrección: eliminar ese registro o, para diagnóstico controlado, registrar únicamente que el header estaba presente sin mostrar el token.

### 7.5 Actualizaciones masivas sin DTO

Los servicios de usuarios e incidentes pasan `req.body` directamente a Firestore.

Impacto:

- Escalada de rol.
- Cambio de contraseña sin verificación.
- Alteración de `activo` y `fechaRegistro`.
- Cambio directo del estado de un incidente.
- Reemplazo de `reportanteId` o `evidencias`.

Corrección: crear DTOs separados por operación y construir explícitamente el objeto que se actualizará.

### 7.6 Carga insegura de evidencias

La carga usa memoria, no limita tamaño, no autentica al usuario y confía en el MIME declarado por el cliente. Después ejecuta `makePublic()`.

Impacto:

- Denegación de servicio por consumo de memoria.
- Consumo de almacenamiento y costos.
- Archivos maliciosos con extensión o MIME falsificado.
- Evidencias permanentemente públicas.
- Archivos huérfanos: se sube el archivo antes de comprobar que el incidente existe.

Corrección:

- Autenticar y autorizar antes de procesar Multer.
- Verificar primero el incidente.
- Limitar tamaño, cantidad y tipos permitidos.
- Validar la firma real del archivo.
- Evitar `makePublic()`; utilizar URLs firmadas con expiración.
- Asociar cada ruta de almacenamiento al incidente y usar nombres no controlados por el usuario.

### 7.7 Ausencia de rate limiting

El login y las cargas no tienen límites de frecuencia.

Impacto: ataques de fuerza bruta y denegación de servicio.

Corrección: agregar rate limiting, retraso progresivo, monitoreo de intentos y límites específicos para login y archivos.

### 7.8 Validación incompleta

Los DTOs validan solo algunos campos obligatorios. Faltan:

- Longitudes máximas.
- Formato normalizado de correo.
- Fortaleza de contraseña.
- Tipos de datos.
- Fechas válidas y no futuras, según regla de negocio.
- Catálogos permitidos para tipo y estado.
- Rechazo de campos adicionales.

---

## 8. Problemas de Firestore y Storage

Las reglas locales de Firestore y Storage niegan todo acceso directo. Esto es apropiado si únicamente el backend usa Firebase Admin. Sin embargo, Firebase Admin ignora esas reglas; por tanto, la seguridad efectiva depende completamente de Express.

Problemas adicionales:

- La escritura de una observación, el cambio automático de estado y la bitácora no son atómicos.
- El cambio de estado y su entrada de bitácora no se ejecutan en una transacción.
- Las evidencias usan leer-modificar-escribir; cargas concurrentes pueden perder URLs.
- Las fechas se guardan como strings en lugar de `Timestamp` de Firestore.
- La unicidad del correo se implementa con consulta seguida de inserción y tiene condición de carrera.
- Listar incidentes hace una consulta adicional por cada reportante.
- Listar bitácora hace una consulta adicional por cada incidente.
- No existe paginación; las colecciones se leen completas.
- Los índices están vacíos. La consulta de observaciones por `incidenteId` y orden por `fecha` puede necesitar un índice compuesto.

La edición real de la base remota no pudo confirmarse porque la sesión de Firebase CLI respondió `401 UNAUTHENTICATED`.

---

## 9. Problemas del frontend

### 9.1 Login y navegación

- Después de un login correcto se navega a `/`, que es la misma pantalla de login.
- La ruta `/login` no existe, aunque `ProtectedRoute` intenta redirigir hacia ella.
- `ProtectedRoute` nunca se utiliza en `AppRoutes`.
- Dashboard, usuarios, incidentes, bitácora y detalle pueden abrirse directamente sin sesión.
- La pantalla de login utiliza `MainLayout`, mostrando navegación de una sesión que todavía no existe.

### 9.2 Autorización visual incompleta

- El sidebar oculta Usuarios y Bitácora para no administradores, pero las rutas siguen disponibles manualmente.
- Todos los usuarios ven botones para crear, editar y eliminar incidentes.
- Todos los usuarios ven formularios para agregar observaciones y cambiar estado.
- Ocultar botones mejora la experiencia, pero nunca sustituye la autorización del backend.

### 9.3 Manejo del token

El token se guarda en `localStorage`. Cualquier vulnerabilidad XSS podría leerlo. Para una aplicación de mayor riesgo sería preferible una cookie `HttpOnly`, `Secure` y `SameSite`, acompañada de protección CSRF cuando corresponda.

### 9.4 Errores funcionales y visuales

- El detalle muestra siempre una segunda línea “No hay evidencias”, aunque sí existan.
- La página Observaciones es solo un placeholder.
- El dashboard no muestra información real.
- El modal no controla adecuadamente el desbordamiento vertical.
- Hay textos con codificación dañada: `GestiÃ³n`, `ContraseÃ±a`, `Â¿Desea...?`.
- Hay varios `console.log` y `console.error` de depuración.
- No existe un estado global de autenticación ni tratamiento centralizado de respuestas `401`.
- No se verifica la expiración antes de mostrar una sesión como activa.
- No existe manejo consistente de carga, error y estado vacío.

---

## 10. Problemas del backend y API

- `server.js` fija el puerto 3000 e ignora `process.env.PORT`.
- CORS está fijo a `http://localhost:5173`.
- No existe configuración separada para desarrollo, pruebas y producción.
- No hay middleware central de errores.
- Algunos errores de validación se responden como `500` en vez de `400`.
- Se expone `error.message` directamente al cliente.
- No hay validación de parámetros como IDs, roles, tipos o estados.
- No hay encabezados de seguridad mediante Helmet.
- No hay logs estructurados ni identificador de solicitud.
- El borrado de usuarios e incidentes es físico y no controla referencias asociadas.
- El borrado de un incidente puede dejar observaciones, bitácora y evidencias huérfanas.
- El README afirma capacidades de roles que la API no aplica realmente.

---

## 11. Calidad, pruebas y dependencias

### Resultados obtenidos

- El frontend compila correctamente con `npm run build`.
- El backend puede cargar sin error de sintaxis.
- El lint del frontend falla con 10 errores y 1 advertencia.
- No existen pruebas unitarias.
- No existen pruebas de integración de la API.
- No existen pruebas end-to-end.
- No existe un script de test o lint para el backend.

### Fallos de lint

- Actualizaciones síncronas de estado dentro de efectos.
- Funciones utilizadas antes de su declaración bajo las reglas actuales.
- Dependencias faltantes de `useEffect`.
- Variables e imports no utilizados.

### Dependencias

El audit de la raíz reportó 10 vulnerabilidades: 4 altas y 6 moderadas. El frontend reportó 2 vulnerabilidades altas relacionadas con React Router.

También existen dependencias innecesarias o ubicadas en el paquete incorrecto:

- `react-router-dom` en el backend.
- `axios` en la raíz sin uso aparente en el backend.
- SDK cliente de `firebase` en una aplicación que utiliza `firebase-admin`.
- `main: index.js` en `package.json`, aunque ese archivo no existe.

Las actualizaciones deben hacerse con pruebas, porque algunas soluciones sugeridas por npm implican versiones incompatibles.

---

## 12. Problemas de despliegue

- Vite construye en `web/dist`.
- Firebase Hosting publica `public`.
- Por lo tanto, la configuración actual no despliega la aplicación React compilada.
- El frontend usa `http://localhost:3000/api` de forma fija.
- El backend no está configurado para Cloud Functions, Cloud Run o Firebase App Hosting.
- Firebase Admin depende de `credentials/serviceAccount.json`; en producción deberían utilizarse credenciales administradas por el entorno.
- No se documentan variables de producción ni estrategia de secretos.

---

## 13. Qué debe contener el documento final del Entregable n.° 6

Para evitar los errores señalados por el profesor en el ejemplo “mal hecho”, el informe de entrega debería seguir esta estructura:

### 13.1 Introducción

Explicar por qué el sistema necesita proteger datos personales, incidentes, evidencias y acciones administrativas. Relacionar el riesgo directamente con los recursos y operaciones del sistema.

### 13.2 Objetivo

Ejemplo adecuado:

> Implementar autenticación mediante JWT y autorización basada en roles para garantizar que cada usuario pueda ejecutar únicamente las operaciones correspondientes a sus responsabilidades, devolviendo respuestas HTTP 401 cuando no exista una identidad válida y 403 cuando la identidad no posea permisos suficientes.

### 13.3 Alcance

Enumerar:

- Endpoints públicos.
- Endpoints autenticados.
- Endpoints restringidos por rol.
- Roles existentes.
- Controles de propiedad.
- Aspectos fuera del alcance, si existen.

### 13.4 Diseño de seguridad

Explicar por separado:

- Validación de credenciales.
- Generación del JWT.
- Claims.
- Firma y secreto.
- Expiración.
- Envío mediante Bearer token.
- Validación del middleware.
- Autorización por rol.
- Autorización por propiedad del recurso.

### 13.5 Matriz de permisos

Incluir una tabla explícita como la de la sección 5 y relacionar cada permiso con endpoints reales.

### 13.6 Implementación

Mostrar fragmentos relevantes de:

- Endpoint de login.
- Generación del JWT.
- Middleware `verificarToken`.
- Middleware `verificarRol`.
- Una ruta solo autenticada.
- Una ruta exclusiva de Administrador.
- Una ruta exclusiva de Responsable.
- Una ruta con control de propietario.

No debe mostrarse únicamente una línea aislada; hay que explicar qué protege y por qué.

### 13.7 Pruebas

Documentar solicitud, token/rol utilizado, resultado esperado y resultado real. Incluir capturas de Postman, Insomnia o DevTools sin revelar contraseñas ni el JWT completo.

### 13.8 Errores encontrados

Ser honesto sobre problemas y ajustes. Por ejemplo:

- Diferencia entre `401` y `403`.
- Rutas inicialmente abiertas.
- Rol incorrecto en el token.
- Expiración del token.
- Protección de recursos propios.

### 13.9 Conclusión

No afirmar que “el sistema es seguro” únicamente porque genera un token. Indicar exactamente qué controles fueron implementados, probados y qué riesgos permanecen.

---

## 14. Plan de pruebas obligatorio para demostrar 401 y 403

Estas pruebas deben ejecutarse después de proteger todos los endpoints.

| Caso | Solicitud | Identidad | Resultado esperado |
|---|---|---|---|
| Login correcto | `POST /api/auth/login` | Credenciales válidas | `200`, token y perfil sin contraseña |
| Login incorrecto | `POST /api/auth/login` | Contraseña incorrecta | `401` |
| Sin token | `GET /api/bitacora` | Ninguna | `401` |
| Token mal formado | `GET /api/bitacora` | `Bearer abc` | `401` |
| Token expirado | Cualquier ruta protegida | JWT expirado | `401` |
| Rol insuficiente | `GET /api/bitacora` | Responsable | `403` |
| Rol correcto | `GET /api/bitacora` | Administrador | `200` |
| Rol insuficiente | `POST /api/usuarios` | Reportante | `403` |
| Rol correcto | `POST /api/usuarios` | Administrador | `201` |
| Rol insuficiente | `PATCH /api/incidentes/:id/estado` | Reportante | `403` |
| Rol correcto | `PATCH /api/incidentes/:id/estado` | Responsable | `200` |
| Recurso ajeno | `GET /api/incidentes/reportante/:otroId` | Reportante | `403` o `404`, según política |
| Recurso propio | Consulta de incidente propio | Reportante | `200` |
| Usuario inactivo | Login o ruta protegida | Usuario desactivado | `401` o sesión revocada |

### Ejemplo de demostración sin token

```bash
curl -i http://localhost:3000/api/bitacora
```

Debe responder:

```http
HTTP/1.1 401 Unauthorized
```

### Ejemplo de demostración de permiso insuficiente

```bash
curl -i http://localhost:3000/api/bitacora \
  -H "Authorization: Bearer TOKEN_DE_RESPONSABLE"
```

Debe responder:

```http
HTTP/1.1 403 Forbidden
```

### Ejemplo de acceso autorizado

```bash
curl -i http://localhost:3000/api/bitacora \
  -H "Authorization: Bearer TOKEN_DE_ADMINISTRADOR"
```

Debe responder `200 OK`.

Importante: estas demostraciones ya son posibles para Bitácora. No lo son consistentemente para usuarios, incidentes y evidencias porque esas rutas todavía están abiertas.

---

## 15. Criterios de aceptación antes de entregar

- [ ] Ningún endpoint sensible queda sin `verificarToken`.
- [ ] Cada operación tiene roles permitidos explícitos.
- [ ] Los Reportantes solo acceden a sus recursos.
- [ ] Crear, editar y eliminar usuarios requiere Administrador.
- [ ] No se almacena ni devuelve ninguna contraseña en texto plano.
- [ ] El secreto JWT se obtiene del entorno y fue rotado.
- [ ] El login rechaza usuarios inactivos.
- [ ] El backend no imprime tokens.
- [ ] El frontend usa rutas protegidas.
- [ ] La interfaz muestra operaciones compatibles con el rol.
- [ ] Evidencias exige autenticación, autorización, límites y tipo válido.
- [ ] Se ejecutaron todos los casos `200`, `201`, `400`, `401`, `403` y `404` necesarios.
- [ ] Existen capturas o resultados de las pruebas.
- [ ] El informe incluye matriz rol–operación–endpoint.
- [ ] El informe distingue autenticación de autorización.
- [ ] El build y el lint terminan correctamente.
- [ ] Se revisaron las vulnerabilidades de dependencias.
- [ ] La configuración de despliegue apunta al frontend compilado y al API correcto.

---

## 16. Orden recomendado de trabajo

### Prioridad 1: bloqueo de vulnerabilidades críticas

1. Proteger usuarios, incidentes y evidencias con token y rol.
2. Eliminar contraseñas en texto plano.
3. Rotar y externalizar el secreto JWT.
4. Restringir actualizaciones mediante DTOs.
5. Eliminar tokens de los logs.

### Prioridad 2: comportamiento correcto del entregable

6. Implementar la matriz de permisos.
7. Agregar controles de propiedad.
8. Proteger rutas React y corregir la redirección del login.
9. Mostrar u ocultar acciones según el rol.
10. Implementar pruebas de `401` y `403`.

### Prioridad 3: robustez

11. Proteger cargas y archivos.
12. Usar transacciones de Firestore.
13. Agregar validación, rate limiting, Helmet y manejo central de errores.
14. Incorporar pruebas automatizadas.
15. Corregir lint, codificación y errores visuales.
16. Corregir despliegue y dependencias.

---

## 17. Conclusión

El proyecto demuestra una base válida para JWT: existe login, generación de token, envío mediante Bearer y middlewares para autenticación y roles. Sin embargo, la aplicación no aplica estos controles a la mayoría de sus endpoints y mantiene vulnerabilidades críticas, especialmente contraseñas en texto plano, creación pública de administradores, actualizaciones arbitrarias y evidencias públicas sin límites.

Para cumplir el Entregable n.° 6 se debe demostrar control real: quién entra, qué puede hacer, sobre qué recursos y qué respuesta recibe cuando el acceso debe negarse. El resultado final debe evidenciar tanto accesos exitosos como rechazos `401` y `403`, vinculando cada caso con la matriz de roles y los endpoints implementados.

Hasta completar las correcciones prioritarias y las pruebas propuestas, no es correcto afirmar que el sistema sea seguro; únicamente puede afirmarse que posee una implementación parcial de autenticación JWT y autorización por roles.
