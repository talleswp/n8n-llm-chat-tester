import React, { useState } from 'react';
import AuthProvider from './context/AuthContext.jsx';
import ThreadProvider from './context/ThreadContext.jsx';
import { useAuth } from './hooks/useAuth';
import Login from './components/login/Login.jsx';
import Register from './components/register/Register.jsx';
import Chat from './components/chat/Chat.jsx';
import './components/login/Login.css';

/**
 * Componente que gerencia a rota baseada em autenticação
 */
const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (isLoading) {
    return (
      <div className="login-page d-flex align-items-center justify-content-center min-vh-100">
        <div className="login-effects" aria-hidden="true">
          <div className="effect-circle circle-1"></div>
          <div className="effect-circle circle-2"></div>
          <div className="effect-circle circle-3"></div>
          <div className="effect-circle circle-4"></div>
          <div className="effect-line line-1"></div>
          <div className="effect-line line-2"></div>
          <div className="effect-line line-3"></div>
          <div className="effect-line line-4"></div>
        </div>
        <div className="position-relative text-center" style={{ zIndex: 1 }}>
          <img src="/img/n-space.svg" alt="N-SPACE" className="logo-reveal" style={{ height: '40px' }} />
          <div className="loading-bar-track mt-3 mx-auto">
            <div className="loading-bar-fill"></div>
          </div>
        </div>
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