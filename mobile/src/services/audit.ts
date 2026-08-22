import { api } from './api';
import { AuditEntry } from '../types';

export const getAuditEntries = async () => (await api.get<AuditEntry[]>('/bitacora')).data;
