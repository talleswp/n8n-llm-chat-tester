import React, { useState } from 'react';
import { authService } from '../../services/api.service';
import FormInput from '../common/input/FormInput';
import Button from '../common/button/Button';
import './Register.css';
import '../login/Login.css';

const Register = ({ onBackToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validações
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.createUser(name, email, password);
      setSuccess(true);
      setTimeout(() => {
        onBackToLogin();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
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
            <div className="col-xl-5 col-lg-6 col-md-8 col-12">
              <div className="card login-card overflow-hidden border-0">
                <div className="p-10 p-md-10 text-center">
                  <div className="success-icon">✓</div>
                  <h2 className="h4 mb-2" style={{ color: '#fff' }}>Cadastro realizado com sucesso!</h2>
                  <p style={{ color: 'rgba(255,255,255,0.6)' }}>Redirecionando para o login...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="col-xl-5 col-lg-6 col-md-8 col-12">
            <div className="card login-card overflow-hidden border-0">
              <div className="p-10 p-md-10">
                    <h1 className="h3 text-center mb-1">Create Account</h1>
                    <p className="text-center text-body-secondary">Fill in the details to create your account</p>

                    <form onSubmit={handleSubmit} className="mt-4">
                      <FormInput
                        id="name"
                        label="Full Name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        disabled={isLoading}
                        autoFocus
                      />

                      <FormInput
                        id="email"
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="m@example.com"
                        disabled={isLoading}
                        autoComplete="email"
                      />

                      <FormInput
                        id="password"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        disabled={isLoading}
                        autoComplete="new-password"
                      />

                      <FormInput
                        id="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter your password"
                        disabled={isLoading}
                        autoComplete="new-password"
                      />

                      {/* Exibir Erros */}
                      {error && (
                        <div className="alert alert-danger py-2 px-3 small text-center mt-3">
                          {error}
                        </div>
                      )}

                      {/* Botão Submit */}
                      <Button isLoading={isLoading} loadingText="Creating account...">
                        Create account
                      </Button>

                      <div className="text-center mt-4 small text-white">
                        Already have an account?{' '}
                        <a
                          href="#"
                          className="text-decoration-underline"
                          onClick={(e) => { e.preventDefault(); onBackToLogin(); }}
                        >
                          Log in
                        </a>
                      </div>
                    </form>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
