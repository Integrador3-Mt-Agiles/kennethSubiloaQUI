import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Button, Card } from '../components/UI';
import { errorMessage } from '../services/api';
import { deleteUser, getUsers } from '../services/users';
import { colors } from '../theme';
import { RootStackParamList, User } from '../types';
import { confirmAction } from '../utils/confirm';

type Props = NativeStackScreenProps<RootStackParamList, 'Users'>;

export default function UsersScreen({ navigation }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const load = useCallback(async () => { setLoading(true); try { setUsers(await getUsers()); } catch (e) { Alert.alert('No fue posible cargar los usuarios', errorMessage(e)); } finally { setLoading(false); } }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const remove = async (user: User) => { if (!await confirmAction('Eliminar usuario', `¿Desea eliminar a ${user.nombre}?`)) return; try { await deleteUser(user.id); await load(); } catch (e) { Alert.alert('No fue posible eliminar el usuario', errorMessage(e)); } };

  return <View style={styles.page}>
    <Button title="+ Nuevo usuario" onPress={() => navigation.navigate('UserForm')} />
    <FlatList data={users} keyExtractor={item => item.id} refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />} contentContainerStyle={styles.list} ListEmptyComponent={!loading ? <Text style={styles.empty}>No hay usuarios registrados.</Text> : null} renderItem={({ item }) => <Card>
      <View style={styles.row}><View style={styles.data}><Text style={styles.name}>{item.nombre}</Text><Text style={styles.email}>{item.correo}</Text></View><View style={[styles.badge, item.activo === false && styles.inactiveBadge]}><Text style={[styles.badgeText, item.activo === false && styles.inactiveText]}>{item.activo === false ? 'Inactivo' : 'Activo'}</Text></View></View>
      <Text style={styles.role}>{item.rol}</Text>
      <View style={styles.actions}><View style={styles.action}><Button title="Editar" secondary onPress={() => navigation.navigate('UserForm', { user: item })} /></View><View style={styles.action}><Button title="Eliminar" danger onPress={() => remove(item)} /></View></View>
    </Card>} />
  </View>;
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16, backgroundColor: colors.background }, list: { paddingTop: 12, paddingBottom: 30 }, empty: { color: colors.muted, textAlign: 'center', marginTop: 50 },
  row: { flexDirection: 'row', alignItems: 'flex-start' }, data: { flex: 1 }, name: { color: colors.text, fontSize: 18, fontWeight: '900' }, email: { color: colors.muted, marginTop: 4 }, role: { color: colors.primaryDark, fontWeight: '800', marginTop: 12 },
  badge: { backgroundColor: '#dcfce7', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 }, badgeText: { color: colors.success, fontSize: 12, fontWeight: '800' }, inactiveBadge: { backgroundColor: '#fee2e2' }, inactiveText: { color: colors.danger },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 }, action: { flex: 1 },
});
