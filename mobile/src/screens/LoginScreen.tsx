import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Field } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { errorMessage } from '../services/api';
import { colors } from '../theme';

export default function LoginScreen() {
  const { signIn } = useAuth(); const [correo, setCorreo] = useState(''); const [password, setPassword] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async () => { if (!correo.trim() || !password) return Alert.alert('Datos incompletos', 'Ingrese correo y contraseña.'); setBusy(true); try { await signIn(correo, password); } catch (e) { Alert.alert('No fue posible iniciar sesión', errorMessage(e)); } finally { setBusy(false); } };
  return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.page}><View style={styles.brand}><Text style={styles.eyebrow}>SISTEMA DE SEGURIDAD</Text><Text style={styles.title}>Gestión de eventos</Text><Text style={styles.subtitle}>Acceda para reportar y dar seguimiento a incidentes.</Text></View><Card><Field label="Correo electrónico" value={correo} onChangeText={setCorreo} autoCapitalize="none" keyboardType="email-address" autoComplete="email" /><Field label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry autoComplete="password" /><Button title="Iniciar sesión" onPress={submit} loading={busy} /></Card></KeyboardAvoidingView>;
}
const styles = StyleSheet.create({ page: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: colors.navy }, brand: { marginBottom: 24 }, eyebrow: { color: '#79b8ff', letterSpacing: 2, fontWeight: '800' }, title: { color: '#fff', fontSize: 34, fontWeight: '900', marginTop: 8 }, subtitle: { color: '#cbd5e1', fontSize: 16, lineHeight: 23, marginTop: 8 } });
