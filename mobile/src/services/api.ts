import axios from 'axios';
import { API_URL } from '../config';
import { getStoredItem } from './storage';

export const TOKEN_KEY = 'incident_app_token';
export const USER_KEY = 'incident_app_user';
export const api = axios.create({ baseURL: API_URL, timeout: 15000 });

api.interceptors.request.use(async config => {
  const token = await getStoredItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function errorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') return 'La solicitud tardó demasiado. Compruebe su conexión e inténtelo nuevamente.';
    if (!error.response) return 'No fue posible conectar con el servidor. Compruebe que el backend esté activo y que el dispositivo tenga conexión.';

    const status = error.response.status;
    const rawMessage = error.response.data?.mensaje;
    const backendMessage = typeof rawMessage === 'string' && rawMessage.trim() ? rawMessage.trim() : '';

    if (status === 401) return backendMessage || 'La sesión no es válida o expiró. Inicie sesión nuevamente.';
    if (status === 403) return backendMessage || 'No tiene permisos para realizar esta acción.';
    if (status === 404) return backendMessage || 'No se encontró la información solicitada.';
    if (status === 413) return 'El archivo seleccionado es demasiado grande.';
    if (status >= 500) return 'El servidor tuvo un problema al procesar la solicitud. Inténtelo nuevamente más tarde.';
    return backendMessage || 'La solicitud no pudo completarse. Revise los datos e inténtelo nuevamente.';
  }
  return 'Ocurrió un error inesperado. Inténtelo nuevamente.';
}
