import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import EmailInput from '../common/EmailInput';
import PasswordInput from '../common/PasswordInput';
import './Login.css';

const Login = () => {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    // Validações básicas
    if (!email.trim()) {
      setLocalError('Por favor, insira seu email');
      return;
    }

    if (!password) {
      setLocalError('Por favor, insira sua senha');
      return;
    }

    const result = await login(email, password);
    
    if (!result.success) {
      setLocalError(result.error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>n8n LLM Chat</h1>
          <p>Entre para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <EmailInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            disabled={isLoading}
            autoComplete="email"
            autoFocus
          />

          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={isLoading}
            autoComplete="current-password"
          />

          {/* Exibir Erros */}
          {(localError || error) && (
            <div className="error-message">
              {localError || error}
            </div>
          )}

          {/* Botão Submit */}
          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="login-footer">
          <p>A IA pode cometer erros. Verifique informações importantes.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
