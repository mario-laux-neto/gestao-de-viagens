import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('token');
      const savedUsuario = localStorage.getItem('usuario');

      if (savedToken && savedUsuario) {
        setToken(savedToken);
        setUsuario(JSON.parse(savedUsuario));
      }
    } catch (err) {
      console.error("Erro ao carregar dados de autenticação locais:", err);
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, senha) => {
    const response = await api.post('/auth/login', { email, senha });
    const { usuario: user, token: jwtToken } = response.data.data;

    localStorage.setItem('token', jwtToken);
    localStorage.setItem('usuario', JSON.stringify(user));
    setToken(jwtToken);
    setUsuario(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setToken(null);
    setUsuario(null);
  };

  const registrar = async (nome, email, senha) => {
    const response = await api.post('/auth/registro', { nome, email, senha });
    const { usuario: user, token: jwtToken } = response.data.data;

    localStorage.setItem('token', jwtToken);
    localStorage.setItem('usuario', JSON.stringify(user));
    setToken(jwtToken);
    setUsuario(user);
    return user;
  };

  const atualizarUsuario = (novosDados) => {
    setUsuario((prev) => {
      if (!prev) return null;
      const usuarioAtualizado = { ...prev, ...novosDados };
      localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));
      return usuarioAtualizado;
    });
  };

  const value = {
    usuario,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    logout,
    registrar,
    atualizarUsuario
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
