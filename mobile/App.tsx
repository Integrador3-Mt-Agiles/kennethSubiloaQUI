import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import CreateIncidentScreen from './src/screens/CreateIncidentScreen';
import IncidentDetailScreen from './src/screens/IncidentDetailScreen';
import IncidentsScreen from './src/screens/IncidentsScreen';
import LoginScreen from './src/screens/LoginScreen';
import { colors } from './src/theme';
import { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function Navigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return <View style={styles.loading}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.navy }, headerTintColor: '#fff', contentStyle: { backgroundColor: colors.background } }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="Incidents" component={IncidentsScreen} options={{ title: 'Eventos' }} />
            <Stack.Screen name="IncidentDetail" component={IncidentDetailScreen} options={{ title: 'Detalle del evento' }} />
            {user.rol === 'Reportante' && <Stack.Screen name="CreateIncident" component={CreateIncidentScreen} options={{ title: 'Nuevo evento' }} />}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return <AuthProvider><StatusBar style="light" /><Navigator /></AuthProvider>;
}

const styles = StyleSheet.create({ loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background } });
