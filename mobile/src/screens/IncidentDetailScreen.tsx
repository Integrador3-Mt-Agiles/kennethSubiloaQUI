import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Field } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { errorMessage } from '../services/api';
import { addObservation, changeStatus, deleteIncident, getIncident, getObservations } from '../services/incidents';
import { colors } from '../theme';
import { Incident, Observation, RootStackParamList } from '../types';
import { confirmAction } from '../utils/confirm';

type Props = NativeStackScreenProps<RootStackParamList, 'IncidentDetail'>;
const nextStatus: Record<string, string | undefined> = { Pendiente: 'En revisión', 'En revisión': 'Resuelto', Resuelto: 'Cerrado' };

export default function IncidentDetailScreen({ navigation, route }: Props) {
  const { user } = useAuth();
  const { incidentId } = route.params;
  const [incident, setIncident] = useState<Incident>();
  const [observations, setObservations] = useState<Observation[]>([]);
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => { try { const [detail, notes] = await Promise.all([getIncident(incidentId), getObservations(incidentId)]); setIncident(detail); setObservations(notes); } catch (e) { Alert.alert('No fue posible cargar el detalle', errorMessage(e)); } }, [incidentId]);
  useFocusEffect(useCallback(() => { load(); }, [load]));
  const add = async () => { if (!comment.trim()) return Alert.alert('Comentario requerido', 'Escriba una observación.'); setBusy(true); try { await addObservation(incidentId, comment); setComment(''); await load(); } catch (e) { Alert.alert('No fue posible agregar la observación', errorMessage(e)); } finally { setBusy(false); } };
  const advance = async () => { if (!incident || !nextStatus[incident.estado]) return; setBusy(true); try { await changeStatus(incidentId, nextStatus[incident.estado]!); await load(); } catch (e) { Alert.alert('No fue posible cambiar el estado', errorMessage(e)); } finally { setBusy(false); } };
  const remove = async () => { if (!await confirmAction('Eliminar evento', `¿Desea eliminar “${incident?.titulo}”? Esta acción no se puede deshacer.`)) return; try { await deleteIncident(incidentId); navigation.navigate('Incidents'); } catch (e) { Alert.alert('No fue posible eliminar el evento', errorMessage(e)); } };

  if (!incident) return <View style={styles.center}><Text style={styles.muted}>Cargando evento...</Text></View>;
  return <ScrollView contentContainerStyle={styles.page}>
    <Card><View style={styles.row}><Text style={styles.type}>{incident.tipo}</Text><Text style={styles.status}>{incident.estado}</Text></View><Text style={styles.title}>{incident.titulo}</Text><Text style={styles.description}>{incident.descripcion}</Text><Info label="Ubicación" value={incident.ubicacion} /><Info label="Fecha" value={incident.fechaIncidente} /><Info label="Reportante" value={incident.reportanteNombre || incident.reportanteId} /></Card>
    {user?.rol === 'Administrador' && <View style={styles.adminActions}><View style={styles.adminButton}><Button title="Editar evento" secondary onPress={() => navigation.navigate('EditIncident', { incidentId })} /></View><View style={styles.adminButton}><Button title="Eliminar evento" danger onPress={remove} /></View></View>}
    <Text style={styles.heading}>Evidencias</Text>
    {incident.evidencias?.length ? incident.evidencias.map((uri, index) => <Image key={`${uri}-${index}`} source={{ uri }} style={styles.image} />) : <Text style={styles.muted}>No hay evidencias.</Text>}
    <Text style={styles.heading}>Observaciones</Text>
    {observations.length ? observations.map(item => <Card key={item.id}><Text style={styles.note}>{item.comentario}</Text><Text style={styles.noteMeta}>{item.usuarioNombre || 'Responsable'} · {formatDate(item.fecha)}</Text></Card>) : <Text style={styles.muted}>No hay observaciones.</Text>}
    {user?.rol === 'Responsable' && <View style={styles.actions}><Field label="Nueva observación" value={comment} onChangeText={setComment} multiline placeholder="Escriba el seguimiento realizado" /><Button title="Agregar observación" onPress={add} loading={busy} />{nextStatus[incident.estado] && <Button title={`Cambiar a “${nextStatus[incident.estado]}”`} onPress={advance} loading={busy} secondary />}</View>}
  </ScrollView>;
}

function Info({ label, value }: { label: string; value?: string }) { return <View style={styles.info}><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value || 'Sin indicar'}</Text></View>; }
function formatDate(value?: string) { if (!value) return 'Sin fecha'; const date = new Date(value); return Number.isNaN(date.getTime()) ? value : date.toLocaleString('es-CR'); }

const styles = StyleSheet.create({ page: { padding: 16, paddingBottom: 40 }, center: { flex: 1, justifyContent: 'center', alignItems: 'center' }, row: { flexDirection: 'row', justifyContent: 'space-between' }, type: { color: colors.primaryDark, fontWeight: '800' }, status: { color: colors.success, fontWeight: '800' }, title: { color: colors.text, fontSize: 24, fontWeight: '900', marginTop: 12 }, description: { color: colors.text, fontSize: 16, lineHeight: 23, marginVertical: 14 }, info: { borderTopWidth: 1, borderTopColor: colors.border, paddingVertical: 10 }, infoLabel: { color: colors.muted, fontSize: 12, fontWeight: '700' }, infoValue: { color: colors.text, marginTop: 3 }, adminActions: { flexDirection: 'row', gap: 10 }, adminButton: { flex: 1 }, heading: { color: colors.text, fontSize: 20, fontWeight: '900', marginTop: 18, marginBottom: 10 }, image: { width: '100%', height: 240, borderRadius: 15, marginBottom: 10, backgroundColor: colors.border }, muted: { color: colors.muted, marginBottom: 12 }, note: { color: colors.text, lineHeight: 21 }, noteMeta: { color: colors.muted, fontSize: 12, marginTop: 10 }, actions: { marginTop: 20 } });
