import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Field } from '../components/UI';
import { errorMessage } from '../services/api';
import { getAuditEntries } from '../services/audit';
import { colors } from '../theme';
import { AuditEntry, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Audit'>;

export default function AuditScreen({ navigation }: Props) {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [userFilter, setUserFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const load = useCallback(async () => { setLoading(true); try { setEntries(await getAuditEntries()); } catch (e) { Alert.alert('No fue posible cargar la bitácora', errorMessage(e)); } finally { setLoading(false); } }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));
  const filtered = useMemo(() => entries.filter(item =>
    (item.usuarioNombre ?? '').toLowerCase().includes(userFilter.trim().toLowerCase()) &&
    (item.accion ?? '').toLowerCase().includes(actionFilter.trim().toLowerCase()) &&
    (!dateFilter.trim() || item.fechaHora?.slice(0, 10) === dateFilter.trim())
  ), [entries, userFilter, actionFilter, dateFilter]);

  return <View style={styles.page}>
    <View style={styles.filters}><Text style={styles.filtersTitle}>Filtros</Text><Field label="Usuario" value={userFilter} onChangeText={setUserFilter} placeholder="Buscar por usuario" /><Field label="Acción" value={actionFilter} onChangeText={setActionFilter} placeholder="Buscar por acción" /><Field label="Fecha (AAAA-MM-DD)" value={dateFilter} onChangeText={setDateFilter} keyboardType="numbers-and-punctuation" placeholder="2026-08-22" /></View>
    <Text style={styles.counter}>{filtered.length} {filtered.length === 1 ? 'registro' : 'registros'}</Text>
    <FlatList data={filtered} keyExtractor={item => item.id} refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />} contentContainerStyle={styles.list} ListEmptyComponent={!loading ? <Text style={styles.empty}>No hay registros que coincidan con los filtros.</Text> : null} renderItem={({ item }) => <Card>
      <View style={styles.row}><Text style={styles.action}>{item.accion || 'Acción'}</Text><Text style={styles.date}>{formatDate(item.fechaHora)}</Text></View>
      <Text style={styles.user}>{item.usuarioNombre || 'Usuario desconocido'}</Text>
      <Text style={styles.detail}>{item.detalle || 'Sin detalle'}</Text>
      <Text style={styles.incident}>{item.incidenteTitulo || 'Sin incidente'}</Text>
      {item.incidenteId && <Button title="Ver evento" secondary onPress={() => navigation.navigate('IncidentDetail', { incidentId: item.incidenteId! })} />}
    </Card>} />
  </View>;
}

function formatDate(value?: string) { if (!value) return 'Sin fecha'; const date = new Date(value); return Number.isNaN(date.getTime()) ? value : date.toLocaleString('es-CR'); }

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16, backgroundColor: colors.background }, filters: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 14 }, filtersTitle: { color: colors.text, fontSize: 18, fontWeight: '900', marginBottom: 12 }, counter: { color: colors.muted, fontWeight: '700', marginVertical: 12 }, list: { paddingBottom: 30 }, empty: { color: colors.muted, textAlign: 'center', marginTop: 40 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 }, action: { color: colors.primaryDark, fontWeight: '900', flex: 1 }, date: { color: colors.muted, fontSize: 11, textAlign: 'right' }, user: { color: colors.text, fontWeight: '800', marginTop: 10 }, detail: { color: colors.text, lineHeight: 20, marginTop: 8 }, incident: { color: colors.muted, fontStyle: 'italic', marginTop: 10 },
});
