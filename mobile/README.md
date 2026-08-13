# Aplicación móvil

Aplicación independiente en Expo/React Native. Consume la API Express existente y no accede directamente a Firebase.

## Inicio

1. Copie `.env.example` como `.env`.
2. Cambie `EXPO_PUBLIC_API_URL` por la dirección del backend.
3. Ejecute `npm start` dentro de esta carpeta.
4. Escanee el QR con Expo Go o pulse `a` para el emulador Android.

En un teléfono físico no use `localhost`: use la IP local de la computadora y mantenga ambos equipos en la misma red. Inicie el backend desde la raíz con `npm run dev`.

Incluye inicio de sesión seguro, permisos por rol, eventos, evidencias fotográficas, observaciones y cambios de estado.
