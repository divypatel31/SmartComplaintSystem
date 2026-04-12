import { createContext, useContext, useState, useCallback } from 'react';
import { apiLogin, apiRegister } from '../data/mockApi'; // ⬅️ UPDATED IMPORT

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('scs_user')) || null; }
    catch { return null; }
  });

  // src/context/AuthContext.jsx
  const login = useCallback(async (credentials) => {
    const data = await apiLogin(credentials);
    const userProfile = data.user; 
    
    setUser(userProfile);
    sessionStorage.setItem('scs_user', JSON.stringify(userProfile));
    return userProfile;
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

  const updateLocalUser = (updatedUser) => {
    setUser(updatedUser);
    sessionStorage.setItem('scs_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateLocalUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);