import { createContext, useState, useEffect } from 'react';
import useApi from '../hooks/useApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { request } = useApi();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token on load
      request('get', '/api/auth/verify', null, { headers: { Authorization: `Bearer ${token}` } })
        .then((data) => setUser(data.user))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [request]);

  const login = async (username, password) => {
    const data = await request('post', '/api/auth/login', { username, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const register = async (username, password) => {
    const data = await request('post', '/api/auth/register', { username, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};