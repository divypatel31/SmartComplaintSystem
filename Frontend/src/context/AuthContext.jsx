import { createContext, useContext, useState, useCallback } from 'react';
import { apiLogin, apiRegister } from '../data/mockApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('scs_user')) || null; }
    catch { return null; }
  });

  const login = useCallback(async (credentials) => {
    const u = await apiLogin(credentials);
    setUser(u);
    sessionStorage.setItem('scs_user', JSON.stringify(u));
    return u;
  }, []);

  const register = useCallback(async (data) => {
    const u = await apiRegister(data);
    setUser(u);
    sessionStorage.setItem('scs_user', JSON.stringify(u));
    return u;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('scs_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
