import { useContext } from 'react';
import { ThreadContext } from '../context/threadContext';

/**
 * Hook personalizado para acessar o contexto de threads
 * 
 * @returns {object} - Métodos e estados de gerenciamento de threads
 */
export const useThreads = () => {
  const context = useContext(ThreadContext);

  if (!context) {
    throw new Error('useThreads deve ser usado dentro de um ThreadProvider');
  }

  return context};
