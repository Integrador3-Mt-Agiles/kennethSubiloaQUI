import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../config';

export const TOKEN_KEY = 'incident_app_token';
export const USER_KEY = 'incident_app_user';
export const api = axios.create({ baseURL: API_URL, timeout: 15000 });

api.interceptors.request.use(async config => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function errorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (!error.response) return `No se pudo conectar con ${API_URL}. Revise la URL y que el backend esté activo.`;
    return error.response.data?.mensaje || 'La solicitud no pudo completarse.';
  }
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
}
