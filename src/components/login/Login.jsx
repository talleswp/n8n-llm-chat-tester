import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import EmailInput from '../common/EmailInput';
import PasswordInput from '../common/PasswordInput';
import './Login.css';

const Login = ({ onRegisterClick }) => {
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
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-body-secondary py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-7 col-lg-9 col-12">
            <div className="card login-card overflow-hidden">
              <div className="row g-0">
                {/* Formulário */}
                <div className="col-md-6">
                  <div className="p-4 p-md-5">
                    <h1 className="h3 text-center mb-1">Log in</h1>
                    <p className="text-center text-body-secondary">Entre na sua conta</p>

                    <form onSubmit={handleSubmit} className="mt-4">
                      <EmailInput
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="m@example.com"
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
                        <div className="alert alert-danger py-2 px-3 small text-center mt-3">
                          {localError || error}
                        </div>
                      )}

                      {/* Botão Submit */}
                      <button
                        type="submit"
                        className="btn btn-sm btn-primary w-100 mt-3"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Entrando...' : 'Entrar'}
                      </button>

                      <div className="text-center mt-4 mb-3 text-muted small">Ou continue com</div>
                      <div className="d-flex gap-2">
                        <button type="button" className="btn btn-sm btn-outline-secondary flex-grow-1">
                          <i className="bi bi-apple"></i>
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-secondary flex-grow-1">
                          <i className="bi bi-github"></i>
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-secondary flex-grow-1">
                          <i className="bi bi-google"></i>
                        </button>
                      </div>

                      <div className="text-center mt-4 small">
                        Não tem uma conta?{' '}
                        <a
                          href="#"
                          className="text-decoration-underline"
                          onClick={(e) => { e.preventDefault(); onRegisterClick(); }}
                        >
                          Criar conta
                        </a>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Imagem lateral */}
                <div className="col-md-6 d-none d-md-block login-image-col border-start">
                </div>
              </div>
            </div>

            <div className="text-center text-muted small mt-4">
              A IA pode cometer erros. Verifique informações importantes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
