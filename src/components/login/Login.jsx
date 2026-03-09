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
      setLocalError('Please enter your email.');
      return;
    }

    if (!password) {
      setLocalError('Please enter your password.');
      return;
    }

    const result = await login(email, password);
    
    if (!result.success) {
      setLocalError(result.error);
    }
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-center min-vh-100 py-4">
      {/* Efeitos decorativos */}
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

      <div className="container position-relative" style={{ zIndex: 1 }}>
        <div className="row justify-content-center">
          <div className="col-xl-7 col-lg-9 col-12">
            <div className="card login-card overflow-hidden border-0">
              <div className="row g-0">
                {/* Formulário */}
                <div className="col-md-6">
                  <div className="p-10 p-md-10">
                    <div className="text-center mb-10">
                      <img src="/img/n-space.svg" alt="N-Space" className="logo-reveal" style={{ height: '30px' }} />
                    </div>
                    <h1 className="h3 text-center mb-1">Log in</h1>
                    <p className="text-center text-body-secondary">Sign in to your account</p>

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
                        {isLoading ? 'Logging in...' : 'Login'}
                      </button>

                      <div className="text-center mt-4 small text-white">
                        Don't have an account?{' '}
                        <a
                          href="#"
                          className="text-decoration-underline"
                          onClick={(e) => { e.preventDefault(); onRegisterClick(); }}
                        >
                          Create an account?
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

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
