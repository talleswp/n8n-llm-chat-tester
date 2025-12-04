import React, { useState, useEffect } from 'react';
import { AuthContext } from './authContext';
import { authService } from '../services/api.service';

// Constantes
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// Provider de autenticação
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carrega dados do localStorage ao montar
  useEffect(() => {
    const loadAndValidateToken = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        try {
          // Tenta carregar o usuário primeiro (comportamento otimista)
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Validação OBRIGATÓRIA do token com o backend
          try {
            const validation = await authService.validateToken(storedToken);
            
            if (!validation.valid) {
              // Token explicitamente inválido, desloga
              setToken(null);
              setUser(null);
              localStorage.removeItem(TOKEN_KEY);
              localStorage.removeItem(USER_KEY);
            }
          } catch {
            // Erro na validação = desloga (validação obrigatória)
            setToken(null);
            setUser(null);
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
          }
        } catch (err) {
          console.error('Erro ao carregar dados do localStorage:', err);
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        }
      }
      
      setIsLoading(false);
    };

    loadAndValidateToken();
  }, []);


  /**
   * Faz login do usuário
   */
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(email, password);
      
      // Espera que o backend retorne: { token, user: { email, name, ... } }
      const { token: newToken, user: newUser } = response;
      
      setToken(newToken);
      setUser(newUser);
      
      // Persiste no localStorage
      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Faz logout do usuário
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  /**
   * Verifica se o usuário está autenticado
   */
  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const value = {
    user,
    token,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
