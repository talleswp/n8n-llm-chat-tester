import React, { useState } from 'react';
import AuthProvider from './context/AuthContext.jsx';
import ThreadProvider from './context/ThreadContext.jsx';
import { useAuth } from './hooks/useAuth';
import Login from './components/login/Login.jsx';
import Register from './components/register/Register.jsx';
import Chat from './components/chat/Chat.jsx';

/**
 * Componente que gerencia a rota baseada em autenticação
 */
const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

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

  if (isAuthenticated()) {
    return (
      <ThreadProvider>
        <Chat />
      </ThreadProvider>
    );
  }

  return showRegister ? (
    <Register onBackToLogin={() => setShowRegister(false)} />
  ) : (
    <Login onRegisterClick={() => setShowRegister(true)} />
  );
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