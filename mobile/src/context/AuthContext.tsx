import * as SecureStore from 'expo-secure-store';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { api, TOKEN_KEY, USER_KEY } from '../services/api';
import { AuthResponse, User } from '../types';

type AuthValue = { user: User | null; loading: boolean; signIn: (correo: string, password: string) => Promise<void>; signOut: () => Promise<void> };
const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { SecureStore.getItemAsync(USER_KEY).then(value => value && setUser(JSON.parse(value))).finally(() => setLoading(false)); }, []);
  const signIn = async (correo: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/auth/login', { correo: correo.trim(), password });
    await SecureStore.setItemAsync(TOKEN_KEY, data.token);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(data.usuario));
    setUser(data.usuario);
  };
  const signOut = async () => { await Promise.all([SecureStore.deleteItemAsync(TOKEN_KEY), SecureStore.deleteItemAsync(USER_KEY)]); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, signIn, signOut }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => { const value = useContext(AuthContext); if (!value) throw new Error('AuthProvider no está disponible.'); return value; };
