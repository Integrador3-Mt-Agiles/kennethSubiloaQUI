import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Button, Card } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { errorMessage } from '../services/api';
import { getIncidents } from '../services/incidents';
import { colors } from '../theme';
import { Incident, RootStackParamList } from '../types';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'Incidents'>;
export default function IncidentsScreen({ navigation }: Props) {
  const { user, signOut } = useAuth(); const [items, setItems] = useState<Incident[]>([]); const [loading, setLoading] = useState(false);
  const load = useCallback(async () => { if (!user) return; setLoading(true); try { setItems(await getIncidents(user.rol, user.id)); } catch (e) { Alert.alert('No fue posible cargar los eventos', errorMessage(e)); } finally { setLoading(false); } }, [user]);
  useFocusEffect(useCallback(() => { load(); }, [load]));
  return <View style={styles.page}><View style={styles.header}><View><Text style={styles.greeting}>{user?.nombre}</Text><Text style={styles.role}>{user?.rol}</Text></View><Pressable onPress={signOut}><Text style={styles.logout}>Cerrar sesión</Text></Pressable></View>{user?.rol === 'Reportante' && <Button title="+ Registrar nuevo evento" onPress={() => navigation.navigate('CreateIncident')} />}<FlatList data={items} keyExtractor={item => item.id} refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />} contentContainerStyle={styles.list} ListEmptyComponent={!loading ? <Text style={styles.empty}>No hay eventos disponibles.</Text> : null} renderItem={({ item }) => <Pressable onPress={() => navigation.navigate('IncidentDetail', { incidentId: item.id })}><Card><View style={styles.row}><Text style={styles.type}>{item.tipo}</Text><Text style={styles.status}>{item.estado}</Text></View><Text style={styles.title}>{item.titulo}</Text><Text style={styles.description} numberOfLines={2}>{item.descripcion}</Text><Text style={styles.meta}>{item.fechaIncidente} · {item.ubicacion}</Text></Card></Pressable>} /></View>;
}
const styles = StyleSheet.create({ page: { flex: 1, padding: 16, backgroundColor: colors.background }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }, greeting: { color: colors.text, fontWeight: '900', fontSize: 20 }, role: { color: colors.muted }, logout: { color: colors.danger, fontWeight: '700' }, list: { paddingTop: 10, paddingBottom: 30 }, row: { flexDirection: 'row', justifyContent: 'space-between' }, type: { color: colors.primaryDark, fontWeight: '800' }, status: { color: colors.success, fontWeight: '700' }, title: { color: colors.text, fontSize: 18, fontWeight: '900', marginTop: 10 }, description: { color: colors.muted, lineHeight: 20, marginTop: 5 }, meta: { color: colors.muted, fontSize: 12, marginTop: 12 }, empty: { textAlign: 'center', color: colors.muted, marginTop: 60 } });
