import React from 'react';
import AuthProvider from './context/AuthContext.jsx';
import { useAuth } from './hooks/useAuth';
import Login from './components/login/Login.jsx';
import Chat from './components/chat/Chat.jsx';

/**
 * Componente que gerencia a rota baseada em autenticação
 */
const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#1a1a1a',
        color: '#e8eaed',
      }}>
        <div>Carregando...</div>
      </div>
    );
  }

  return isAuthenticated() ? <Chat /> : <Login />;
};

/**
 * Componente principal da aplicação
 */
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;