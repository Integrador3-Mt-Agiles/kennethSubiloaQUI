import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { user, signOut } = useAuth();
  const modules = [
    { title: 'Eventos', description: user?.rol === 'Reportante' ? 'Registre y consulte sus reportes.' : 'Consulte y gestione los eventos registrados.', screen: 'Incidents' as const, icon: '⚑' },
    ...(user?.rol === 'Administrador' ? [
      { title: 'Usuarios', description: 'Cree, edite y elimine cuentas del sistema.', screen: 'Users' as const, icon: '♙' },
      { title: 'Bitácora', description: 'Consulte acciones y filtre los movimientos.', screen: 'Audit' as const, icon: '▤' },
    ] : []),
  ];

  return <ScrollView contentContainerStyle={styles.page}>
    <View style={styles.hero}>
      <Text style={styles.eyebrow}>PANEL PRINCIPAL</Text>
      <Text style={styles.title}>Hola, {user?.nombre}</Text>
      <Text style={styles.role}>{user?.rol}</Text>
      <Text style={styles.subtitle}>{user?.rol === 'Administrador' ? 'Administre eventos, usuarios y la bitácora desde el menú.' : user?.rol === 'Responsable' ? 'Revise eventos, agregue observaciones y actualice su estado.' : 'Registre eventos y consulte el seguimiento de sus reportes.'}</Text>
    </View>
    <Text style={styles.sectionTitle}>Menú principal</Text>
    {modules.map(item => <Pressable key={item.title} onPress={() => navigation.navigate(item.screen)} style={({ pressed }) => pressed && styles.pressed}>
      <Card><View style={styles.moduleRow}><View style={styles.icon}><Text style={styles.iconText}>{item.icon}</Text></View><View style={styles.moduleText}><Text style={styles.moduleTitle}>{item.title}</Text><Text style={styles.moduleDescription}>{item.description}</Text></View><Text style={styles.chevron}>›</Text></View></Card>
    </Pressable>)}
    <Pressable onPress={signOut} style={styles.logout}><Text style={styles.logoutText}>Cerrar sesión</Text></Pressable>
  </ScrollView>;
}

const styles = StyleSheet.create({
  page: { padding: 18, paddingBottom: 40, backgroundColor: colors.background },
  hero: { backgroundColor: colors.navy, borderRadius: 20, padding: 22, marginBottom: 24 },
  eyebrow: { color: '#79b8ff', letterSpacing: 1.5, fontWeight: '900', fontSize: 12 },
  title: { color: '#fff', fontSize: 28, fontWeight: '900', marginTop: 9 },
  role: { color: '#bfdbfe', fontWeight: '700', marginTop: 4 },
  subtitle: { color: '#dbeafe', lineHeight: 21, marginTop: 14 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '900', marginBottom: 12 },
  moduleRow: { flexDirection: 'row', alignItems: 'center' },
  icon: { width: 46, height: 46, borderRadius: 14, backgroundColor: '#e7f0ff', alignItems: 'center', justifyContent: 'center' },
  iconText: { color: colors.primaryDark, fontSize: 22, fontWeight: '900' },
  moduleText: { flex: 1, marginLeft: 14 },
  moduleTitle: { color: colors.text, fontSize: 18, fontWeight: '900' },
  moduleDescription: { color: colors.muted, lineHeight: 19, marginTop: 3 },
  chevron: { color: colors.muted, fontSize: 30, marginLeft: 8 },
  pressed: { opacity: .65 },
  logout: { borderWidth: 1, borderColor: '#efb5b5', borderRadius: 12, padding: 15, alignItems: 'center', marginTop: 10 },
  logoutText: { color: colors.danger, fontWeight: '800' },
});
