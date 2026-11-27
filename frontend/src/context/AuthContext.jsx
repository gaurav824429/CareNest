import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('carenest_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('carenest_token');
    if (token) {
      api.get('/auth/me')
        .then((res) => {
          setUser(res.data);
          localStorage.setItem('carenest_user', JSON.stringify(res.data));
        })
        .catch(() => {
          localStorage.removeItem('carenest_token');
          localStorage.removeItem('carenest_user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('carenest_token', res.data.token);
    localStorage.setItem('carenest_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (payload) => {
    const res = await api.post('/auth/register', payload);
    localStorage.setItem('carenest_token', res.data.token);
    localStorage.setItem('carenest_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const updateUserState = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('carenest_user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    localStorage.removeItem('carenest_token');
    localStorage.removeItem('carenest_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserState }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
