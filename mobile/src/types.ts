export type Role = 'Administrador' | 'Responsable' | 'Reportante';

export interface User { id: string; nombre: string; correo: string; rol: Role; activo?: boolean; fechaRegistro?: string }
export interface AuthResponse { token: string; usuario: User }
export interface Incident {
  id: string; titulo: string; descripcion: string; tipo: 'Incidente' | 'Accidente';
  ubicacion: string; fechaIncidente: string; fechaRegistro?: string; estado: string;
  reportanteId: string; reportanteNombre?: string; evidencias?: string[];
}
export interface Observation { id: string; comentario: string; fecha: string; usuarioNombre?: string }
export interface AuditEntry {
  id: string; fechaHora: string; usuarioId?: string; usuarioNombre?: string;
  accion?: string; detalle?: string; incidenteId?: string; incidenteTitulo?: string;
}
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Incidents: undefined;
  IncidentDetail: { incidentId: string };
  CreateIncident: undefined;
  EditIncident: { incidentId: string };
  Users: undefined;
  UserForm: { user?: User } | undefined;
  Audit: undefined;
};
