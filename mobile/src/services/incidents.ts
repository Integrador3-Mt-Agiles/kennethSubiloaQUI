import { api } from './api';
import { Incident, Observation } from '../types';

export const getIncidents = async (role: string, userId: string) => (await api.get<Incident[]>(role === 'Reportante' ? `/incidentes/reportante/${userId}` : '/incidentes')).data;
export const getIncident = async (id: string) => (await api.get<Incident>(`/incidentes/${id}`)).data;
export const createIncident = async (data: Omit<Incident, 'id' | 'estado' | 'reportanteId'>) => (await api.post('/incidentes', data)).data;
export const getObservations = async (id: string) => (await api.get<Observation[]>(`/incidentes/${id}/observaciones`)).data;
export const addObservation = async (id: string, comentario: string) => (await api.post(`/incidentes/${id}/observaciones`, { comentario })).data;
export const changeStatus = async (id: string, estado: string) => (await api.patch(`/incidentes/${id}/estado`, { estado })).data;
export const uploadEvidence = async (id: string, asset: { uri: string; mimeType?: string | null; fileName?: string | null }) => {
  const form = new FormData();
  form.append('imagen', { uri: asset.uri, type: asset.mimeType || 'image/jpeg', name: asset.fileName || `evidencia-${Date.now()}.jpg` } as never);
  return (await api.post(`/incidentes/${id}/evidencias`, form, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
};
