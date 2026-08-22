import { Alert, Platform } from 'react-native';

export function showNotice(title: string, message: string): Promise<void> {
  if (Platform.OS === 'web') { globalThis.alert(`${title}\n\n${message}`); return Promise.resolve(); }
  return new Promise(resolve => Alert.alert(title, message, [{ text: 'Aceptar', onPress: () => resolve() }], { cancelable: false }));
}
