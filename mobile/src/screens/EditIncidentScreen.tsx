import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Field } from '../components/UI';
import { errorMessage } from '../services/api';
import { getIncident, updateIncident } from '../services/incidents';
import { getUsersByRole } from '../services/users';
import { colors } from '../theme';
import { Incident, RootStackParamList, User } from '../types';
import { showNotice } from '../utils/notice';

type Props = NativeStackScreenProps<RootStackParamList, 'EditIncident'>;

export default function EditIncidentScreen({ navigation, route }: Props) {
  const [incident, setIncident] = useState<Incident>();
  const [reporters, setReporters] = useState<User[]>([]);
  const [title, setTitle] = useState(''); const [description, setDescription] = useState(''); const [type, setType] = useState<'Incidente' | 'Accidente'>('Incidente'); const [location, setLocation] = useState(''); const [date, setDate] = useState(''); const [reporterId, setReporterId] = useState(''); const [busy, setBusy] = useState(false);

  useEffect(() => { Promise.all([getIncident(route.params.incidentId), getUsersByRole('Reportante')]).then(([data, users]) => { setIncident(data); setReporters(users); setTitle(data.titulo); setDescription(data.descripcion); setType(data.tipo); setLocation(data.ubicacion); setDate(data.fechaIncidente); setReporterId(data.reportanteId); }).catch(e => Alert.alert('No fue posible cargar el evento', errorMessage(e))); }, [route.params.incidentId]);

  const submit = async () => {
    if (!title.trim() || !description.trim() || !location.trim() || !date.trim() || !reporterId) return Alert.alert('Datos incompletos', 'Complete todos los campos y seleccione el reportante.');
    setBusy(true);
    try { await updateIncident(route.params.incidentId, { titulo: title.trim(), descripcion: description.trim(), tipo: type, ubicacion: location.trim(), fechaIncidente: date.trim(), reportanteId: reporterId }); await showNotice('Evento actualizado', 'Los cambios se guardaron correctamente.'); navigation.goBack(); }
    catch (e) { Alert.alert('No fue posible actualizar el evento', errorMessage(e)); } finally { setBusy(false); }
  };

  if (!incident) return <View style={styles.loading}><ActivityIndicator size="large" color={colors.primary} /></View>;
  return <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
    <Field label="Título *" value={title} onChangeText={setTitle} />
    <Field label="Descripción *" value={description} onChangeText={setDescription} multiline />
    <Text style={styles.label}>Tipo de evento</Text><View style={styles.options}><View style={styles.option}><Button title="Incidente" secondary={type !== 'Incidente'} onPress={() => setType('Incidente')} /></View><View style={styles.option}><Button title="Accidente" secondary={type !== 'Accidente'} onPress={() => setType('Accidente')} /></View></View>
    <Field label="Ubicación *" value={location} onChangeText={setLocation} />
    <Field label="Fecha (AAAA-MM-DD) *" value={date} onChangeText={setDate} keyboardType="numbers-and-punctuation" />
    <Text style={styles.label}>Reportante</Text><View style={styles.reporters}>{reporters.map(user => <Button key={user.id} title={user.nombre} secondary={reporterId !== user.id} onPress={() => setReporterId(user.id)} />)}</View>
    <Button title="Guardar cambios" onPress={submit} loading={busy} />
  </ScrollView></KeyboardAvoidingView>;
}

const styles = StyleSheet.create({ loading: { flex: 1, alignItems: 'center', justifyContent: 'center' }, page: { padding: 18, paddingBottom: 40 }, label: { color: colors.text, fontWeight: '800', marginBottom: 8 }, options: { flexDirection: 'row', gap: 10, marginBottom: 18 }, option: { flex: 1 }, reporters: { marginBottom: 18 } });
