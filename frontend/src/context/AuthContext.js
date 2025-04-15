import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Verificando token no localStorage...');
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Token encontrado, validando...');
      api.get('/tasks')
        .then(() => {
          console.log('Token válido, definindo usuário');
          setUser({ token });
        })
        .catch((error) => {
          console.error('Erro ao validar token:', error);
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => {
          console.log('Finalizando verificação, loading = false');
          setLoading(false);
        });
    } else {
      console.log('Nenhum token encontrado, loading = false');
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser({ token, ...user });
      navigate('/tasks');
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao fazer login');
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await api.post('/auth/register', { username, email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser({ token, ...user });
      navigate('/tasks');
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao registrar');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};