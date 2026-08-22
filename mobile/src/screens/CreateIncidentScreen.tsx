import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Field } from '../components/UI';
import { errorMessage } from '../services/api';
import { createIncident, uploadEvidence } from '../services/incidents';
import { colors } from '../theme';
import { RootStackParamList } from '../types';
import { showNotice } from '../utils/notice';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateIncident'>;

export default function CreateIncidentScreen({ navigation }: Props) {
  const [title, setTitle] = useState(''); const [description, setDescription] = useState(''); const [type, setType] = useState<'Incidente' | 'Accidente'>('Incidente'); const [location, setLocation] = useState(''); const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); const [assets, setAssets] = useState<ImagePicker.ImagePickerAsset[]>([]); const [busy, setBusy] = useState(false);
  const pick = async (camera = false) => {
    const permission = camera ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return Alert.alert('Permiso requerido', 'Debe permitir el acceso para adjuntar evidencia.');
    const result = camera ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: .7 }) : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: .7, allowsMultipleSelection: true, selectionLimit: 5 });
    if (!result.canceled) setAssets(current => [...current, ...result.assets].slice(0, 5));
  };
  const submit = async () => {
    if (!title.trim() || !description.trim() || !location.trim() || !date.trim()) return Alert.alert('Datos incompletos', 'Complete todos los campos requeridos.');
    setBusy(true);
    try {
      const response = await createIncident({ titulo: title, descripcion: description, tipo: type, ubicacion: location, fechaIncidente: date, evidencias: [] });
      const id = response.incidente?.id || response.id;
      if (id) for (const asset of assets) await uploadEvidence(id, asset);
      await showNotice('Evento registrado', assets.length ? `Se guardó el evento junto con ${assets.length} ${assets.length === 1 ? 'evidencia' : 'evidencias'}.` : 'El evento fue guardado.');
      navigation.goBack();
    } catch (e) { Alert.alert('No fue posible registrar el evento', errorMessage(e)); } finally { setBusy(false); }
  };
  return <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
    <Field label="Título *" value={title} onChangeText={setTitle} placeholder="Ej. Fuga de agua" />
    <Field label="Descripción *" value={description} onChangeText={setDescription} multiline placeholder="Describa lo ocurrido" />
    <Text style={styles.label}>Tipo de evento</Text><View style={styles.types}><View style={styles.typeButton}><Button title="Incidente" onPress={() => setType('Incidente')} secondary={type !== 'Incidente'} /></View><View style={styles.typeButton}><Button title="Accidente" onPress={() => setType('Accidente')} secondary={type !== 'Accidente'} /></View></View>
    <Field label="Ubicación *" value={location} onChangeText={setLocation} placeholder="Lugar del evento" />
    <Field label="Fecha (AAAA-MM-DD) *" value={date} onChangeText={setDate} keyboardType="numbers-and-punctuation" />
    <Text style={styles.label}>Evidencias fotográficas (máximo 5)</Text><View style={styles.types}><View style={styles.typeButton}><Button title="Tomar foto" onPress={() => pick(true)} secondary disabled={assets.length >= 5} /></View><View style={styles.typeButton}><Button title="Galería" onPress={() => pick(false)} secondary disabled={assets.length >= 5} /></View></View>
    {assets.map((asset, index) => <View key={`${asset.uri}-${index}`} style={styles.previewWrap}><Image source={{ uri: asset.uri }} style={styles.preview} /><Pressable onPress={() => setAssets(current => current.filter((_, itemIndex) => itemIndex !== index))} style={styles.remove}><Text style={styles.removeText}>Quitar</Text></Pressable></View>)}
    <Button title="Guardar evento" onPress={submit} loading={busy} />
  </ScrollView></KeyboardAvoidingView>;
}

const styles = StyleSheet.create({ page: { padding: 18, paddingBottom: 40 }, label: { color: colors.text, fontWeight: '700', marginBottom: 7 }, types: { flexDirection: 'row', gap: 10, marginBottom: 16 }, typeButton: { flex: 1 }, previewWrap: { marginBottom: 14 }, preview: { width: '100%', height: 220, borderRadius: 14, backgroundColor: colors.border }, remove: { position: 'absolute', top: 9, right: 9, backgroundColor: 'rgba(198,40,40,.9)', borderRadius: 18, paddingHorizontal: 12, paddingVertical: 7 }, removeText: { color: '#fff', fontWeight: '800' } });
