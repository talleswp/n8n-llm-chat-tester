import React, { useState } from 'react';
import { authService } from '../../services/api.service';
import EmailInput from '../common/EmailInput';
import PasswordInput from '../common/PasswordInput';
import './Register.css';

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
      setError('Por favor, insira seu nome');
      return;
    }

    if (!email.trim()) {
      setError('Por favor, insira seu email');
      return;
    }

    if (!password) {
      setError('Por favor, insira uma senha');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
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
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-body-secondary py-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-5 col-lg-6 col-md-8 col-12">
              <div className="card register-card overflow-hidden">
                <div className="p-4 p-md-5 text-center">
                  <div className="success-icon">✓</div>
                  <h2 className="h4 mb-2">Cadastro realizado com sucesso!</h2>
                  <p className="text-body-secondary">Redirecionando para o login...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-body-secondary py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-5 col-lg-6 col-md-8 col-12">
            <div className="card register-card overflow-hidden">
              <div className="p-4 p-md-5">
                    <h1 className="h3 text-center mb-1">Criar Conta</h1>
                    <p className="text-center text-body-secondary">Preencha os dados para se cadastrar</p>

                    <form onSubmit={handleSubmit} className="mt-4">
                      <div className="form-group">
                        <label htmlFor="name">Nome completo</label>
                        <input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Seu nome completo"
                          disabled={isLoading}
                          autoFocus
                        />
                      </div>

                      <EmailInput
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="m@example.com"
                        disabled={isLoading}
                        autoComplete="email"
                      />

                      <PasswordInput
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        disabled={isLoading}
                        autoComplete="new-password"
                      />

                      <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar senha</label>
                        <input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Digite a senha novamente"
                          disabled={isLoading}
                          autoComplete="new-password"
                        />
                      </div>

                      {/* Exibir Erros */}
                      {error && (
                        <div className="alert alert-danger py-2 px-3 small text-center mt-3">
                          {error}
                        </div>
                      )}

                      {/* Botão Submit */}
                      <button
                        type="submit"
                        className="btn btn-sm btn-primary w-100 mt-3"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Criando conta...' : 'Criar conta'}
                      </button>

                      <div className="text-center mt-4 small">
                        Já tem uma conta?{' '}
                        <a
                          href="#"
                          className="text-decoration-underline"
                          onClick={(e) => { e.preventDefault(); onBackToLogin(); }}
                        >
                          Fazer login
                        </a>
                      </div>
                    </form>
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

export default Register;
