import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Field } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { errorMessage } from '../services/api';
import { getIncidents } from '../services/incidents';
import { colors } from '../theme';
import { Incident, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Incidents'>;
const statusOptions = ['Todos', 'Pendiente', 'En revisión', 'Resuelto', 'Cerrado'];
const typeOptions = ['Todos', 'Incidente', 'Accidente'];

export default function IncidentsScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [items, setItems] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('Todos');
  const [type, setType] = useState('Todos');
  const load = useCallback(async () => { if (!user) return; setLoading(true); try { setItems(await getIncidents(user.rol, user.id)); } catch (e) { Alert.alert('No fue posible cargar los eventos', errorMessage(e)); } finally { setLoading(false); } }, [user]);
  useFocusEffect(useCallback(() => { load(); }, [load]));
  const filtered = useMemo(() => items.filter(item => {
    const text = search.trim().toLowerCase();
    const matchesSearch = !text || `${item.titulo} ${item.descripcion} ${item.ubicacion} ${item.reportanteNombre ?? ''}`.toLowerCase().includes(text);
    return matchesSearch && (status === 'Todos' || item.estado === status) && (type === 'Todos' || item.tipo === type);
  }), [items, search, status, type]);

  return <View style={styles.page}><FlatList data={filtered} keyExtractor={item => item.id} refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />} contentContainerStyle={styles.list} ListHeaderComponent={<View>
    {user?.rol === 'Reportante' && <Button title="+ Registrar nuevo evento" onPress={() => navigation.navigate('CreateIncident')} />}
    <View style={styles.filters}><Field label="Buscar" value={search} onChangeText={setSearch} placeholder="Título, ubicación o reportante" /><Text style={styles.filterLabel}>Estado</Text><ChipRow values={statusOptions} selected={status} onSelect={setStatus} /><Text style={styles.filterLabel}>Tipo</Text><ChipRow values={typeOptions} selected={type} onSelect={setType} /></View>
    <Text style={styles.counter}>{filtered.length} {filtered.length === 1 ? 'evento' : 'eventos'}</Text>
  </View>} ListEmptyComponent={!loading ? <Text style={styles.empty}>No hay eventos que coincidan con los filtros.</Text> : null} renderItem={({ item }) => <Pressable onPress={() => navigation.navigate('IncidentDetail', { incidentId: item.id })} style={({ pressed }) => pressed && styles.pressed}><Card>
    <View style={styles.row}><Text style={styles.type}>{item.tipo}</Text><Text style={styles.status}>{item.estado}</Text></View><Text style={styles.title}>{item.titulo}</Text><Text style={styles.description} numberOfLines={2}>{item.descripcion}</Text><Text style={styles.meta}>{item.fechaIncidente} · {item.ubicacion}</Text>{item.reportanteNombre && <Text style={styles.reporter}>Reportante: {item.reportanteNombre}</Text>}
  </Card></Pressable>} /></View>;
}

function ChipRow({ values, selected, onSelect }: { values: string[]; selected: string; onSelect: (value: string) => void }) {
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>{values.map(value => <Pressable key={value} onPress={() => onSelect(value)} style={[styles.chip, selected === value && styles.chipSelected]}><Text style={[styles.chipText, selected === value && styles.chipTextSelected]}>{value}</Text></Pressable>)}</ScrollView>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background }, list: { padding: 16, paddingBottom: 30 }, filters: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 14, marginTop: 8 }, filterLabel: { color: colors.text, fontWeight: '800', marginBottom: 8 }, chips: { gap: 8, paddingBottom: 14 }, chip: { borderWidth: 1, borderColor: colors.border, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 13, paddingVertical: 8 }, chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary }, chipText: { color: colors.text, fontWeight: '700' }, chipTextSelected: { color: '#fff' },
  counter: { color: colors.muted, fontWeight: '700', marginVertical: 13 }, row: { flexDirection: 'row', justifyContent: 'space-between' }, type: { color: colors.primaryDark, fontWeight: '800' }, status: { color: colors.success, fontWeight: '700' }, title: { color: colors.text, fontSize: 18, fontWeight: '900', marginTop: 10 }, description: { color: colors.muted, lineHeight: 20, marginTop: 5 }, meta: { color: colors.muted, fontSize: 12, marginTop: 12 }, reporter: { color: colors.text, fontSize: 12, fontWeight: '700', marginTop: 5 }, empty: { textAlign: 'center', color: colors.muted, marginTop: 35 }, pressed: { opacity: .7 },
});
