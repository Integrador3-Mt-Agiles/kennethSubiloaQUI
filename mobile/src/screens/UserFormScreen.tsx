import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Field } from '../components/UI';
import { errorMessage } from '../services/api';
import { createUser, updateUser } from '../services/users';
import { colors } from '../theme';
import { Role, RootStackParamList } from '../types';
import { showNotice } from '../utils/notice';

type Props = NativeStackScreenProps<RootStackParamList, 'UserForm'>;
const roles: Role[] = ['Administrador', 'Responsable', 'Reportante'];

export default function UserFormScreen({ navigation, route }: Props) {
  const existing = route.params?.user;
  const [name, setName] = useState(existing?.nombre ?? '');
  const [email, setEmail] = useState(existing?.correo ?? '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(existing?.rol ?? 'Reportante');
  const [active, setActive] = useState(existing?.activo !== false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!name.trim() || !email.trim() || (!existing && !password)) return Alert.alert('Datos incompletos', 'Complete nombre, correo y contraseña.');
    setBusy(true);
    try {
      const data = { nombre: name.trim(), correo: email.trim(), ...(password ? { password } : {}), rol: role, ...(existing ? { activo: active } : {}) };
      if (existing) await updateUser(existing.id, data); else await createUser(data);
      await showNotice(existing ? 'Usuario actualizado' : 'Usuario registrado', 'Los datos se guardaron correctamente.');
      navigation.goBack();
    } catch (e) { Alert.alert('No fue posible guardar el usuario', errorMessage(e)); } finally { setBusy(false); }
  };

  return <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
    <Field label="Nombre *" value={name} onChangeText={setName} placeholder="Nombre completo" />
    <Field label="Correo electrónico *" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="correo@ejemplo.com" />
    <Field label={existing ? 'Nueva contraseña (opcional)' : 'Contraseña *'} value={password} onChangeText={setPassword} secureTextEntry placeholder={existing ? 'Déjela vacía para conservarla' : 'Contraseña'} />
    <Text style={styles.label}>Rol</Text><View style={styles.options}>{roles.map(item => <View key={item} style={styles.option}><Button title={item} secondary={role !== item} onPress={() => setRole(item)} /></View>)}</View>
    {existing && <><Text style={styles.label}>Estado de la cuenta</Text><View style={styles.options}><View style={styles.option}><Button title="Activo" secondary={!active} onPress={() => setActive(true)} /></View><View style={styles.option}><Button title="Inactivo" secondary={active} onPress={() => setActive(false)} /></View></View></>}
    <Button title={existing ? 'Actualizar usuario' : 'Guardar usuario'} onPress={submit} loading={busy} />
  </ScrollView></KeyboardAvoidingView>;
}

const styles = StyleSheet.create({ page: { padding: 18, paddingBottom: 40 }, label: { color: colors.text, fontWeight: '800', marginBottom: 8 }, options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 }, option: { minWidth: 125, flexGrow: 1 } });
