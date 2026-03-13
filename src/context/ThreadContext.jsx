import React, { useState, useEffect } from 'react';
import { ThreadContext } from './threadContext';
import { threadService } from '../services/api.service';
import { useAuth } from '../hooks/useAuth';

const ThreadProvider = ({ children }) => {
  const { token } = useAuth();
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [newChatTrigger, setNewChatTrigger] = useState(0);
  const [isLoadingThreads, setIsLoadingThreads] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Carrega todas as threads do usuário
   */
  const loadThreads = async () => {
    if (!token) return;
    
    setIsLoadingThreads(true);
    setError(null);
    
    try {
      const response = await threadService.getThreads(token);
      
      // Backend retorna {data: [{id: "...", created_at: "2025-12-04T21:06:38.777Z", name?: "..."}]}
      const rawThreads = response?.data || [];
      
      // Transforma para o formato esperado pelo frontend
      const threadsArray = rawThreads.map(thread => ({
        thread_id: thread.id,
        name: thread.name || `Conversa ${thread.id.substring(0, 8)}...`, // Usa name do backend ou gera automaticamente
        updatedAt: thread.created_at || new Date().toISOString(), // Usa created_at do backend
        createdAt: thread.created_at, // Mantém created_at original
      }));
      
      setThreads(threadsArray);
    } catch (err) {
      setError(err.message);
      setThreads([]); // Garante que sempre seja um array
    } finally {
      setIsLoadingThreads(false);
    }
  };

  /**
   * Carrega histórico de uma thread específica
   */
  const loadThreadHistory = async (threadId) => {
    if (!token || !threadId) return null;
    
    try {
      const data = await threadService.getThreadHistory(threadId, token);
      return data;
    } catch (err) {
      throw err;
    }
  };

  /**
   * Define uma thread como ativa
   */
  const selectThread = (threadId) => {
    setActiveThreadId(threadId);
  };

  /**
   * Cria nova conversa (limpa thread ativa)
   */
  const createNewThread = () => {
    setActiveThreadId(null);
    setNewChatTrigger(prev => prev + 1);
  };

  /**
   * Adiciona ou atualiza uma thread na lista
   */
  const upsertThread = (thread) => {
    setThreads(prev => {
      const exists = prev.find(t => t.thread_id === thread.thread_id);
      if (exists) {
        // Merge parcial — preserva campos existentes e atualiza os fornecidos
        return prev.map(t => t.thread_id === thread.thread_id ? { ...t, ...thread } : t);
      } else {
        // Adiciona nova no início
        return [thread, ...prev];
      }
    });
  };

  /**
   * Deleta uma thread da lista (local)
   */
  const deleteThread = (threadId) => {
    setThreads(prev => prev.filter(t => t.thread_id !== threadId));
    if (activeThreadId === threadId) {
      setActiveThreadId(null);
    }
  };

  /**
   * Renomeia uma thread (local)
   */
  const renameThread = (threadId, newName) => {
    setThreads(prev =>
      prev.map(t => t.thread_id === threadId ? { ...t, name: newName } : t)
    );
  };

  // Carrega threads ao montar ou quando token muda
  useEffect(() => {
    if (token) {
      loadThreads();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const value = {
    threads,
    activeThreadId,
    newChatTrigger,
    isLoadingThreads,
    error,
    loadThreads,
    loadThreadHistory,
    selectThread,
    createNewThread,
    upsertThread,
    deleteThread,
    renameThread,
  };

  return (
    <ThreadContext.Provider value={value}>
      {children}
    </ThreadContext.Provider>
  );
};

export default ThreadProvider;
