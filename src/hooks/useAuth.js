import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

/**
 * Hook personalizado para acessar o contexto de autenticação
 * 
 * @returns {object} - Métodos e estados de autenticação
 * @property {object|null} user - Dados do usuário autenticado
 * @property {string|null} token - Token JWT
 * @property {boolean} isLoading - Estado de carregamento
 * @property {string|null} error - Mensagem de erro
 * @property {Function} login - Função para fazer login
 * @property {Function} logout - Função para fazer logout
 * @property {Function} isAuthenticated - Verifica se está autenticado
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
};
