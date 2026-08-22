import { api } from './api';
import { Role, User } from '../types';

export type UserInput = { nombre: string; correo: string; password?: string; rol: Role; activo?: boolean };

export const getUsers = async () => (await api.get<User[]>('/usuarios')).data;
export const getUsersByRole = async (role: Role) => (await api.get<User[]>(`/usuarios/rol/${role}`)).data;
export const createUser = async (data: UserInput) => (await api.post<User>('/usuarios', data)).data;
export const updateUser = async (id: string, data: UserInput) => (await api.put<User>(`/usuarios/${id}`, data)).data;
export const deleteUser = async (id: string) => (await api.delete(`/usuarios/${id}`)).data;
