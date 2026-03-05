import { useState, useRef, useEffect } from 'react';
import { chatService } from '../services/api.service';
import { useAuth } from './useAuth';
import { useThreads } from './useThreads';

/**
 * Hook personalizado para gerenciar toda a lógica do chat
 * Separa a lógica de negócio da apresentação
 */
export const useChat = () => {
  const { token } = useAuth();
  const { activeThreadId, upsertThread, selectThread, loadThreadHistory, loadThreads, newChatTrigger } = useThreads();
  
  // Estados
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Refs
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Computed
  const hasMessages = messages.length > 0;

  // --- EFEITOS ---

  // Auto-scroll para o fim
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-resize do Textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [prompt]);

  // --- HANDLERS ---

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
  };

  const handlePromptChange = (value) => {
    setPrompt(value);
  };

  /**
   * Carrega histórico de uma thread
   */
  const loadHistory = async (threadId) => {
    setIsLoading(true);
    try {
      const data = await loadThreadHistory(threadId);
      
      // Converte o formato do backend para o formato do frontend
      const formattedMessages = [];
      if (data.messages && Array.isArray(data.messages)) {
        data.messages.forEach(msg => {
          formattedMessages.push({ role: 'user', content: msg.human });
          formattedMessages.push({ role: 'ai', content: msg.ai });
        });
      }
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      setMessages([{
        role: 'ai',
        content: 'Erro ao carregar histórico da conversa.',
        isError: true,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Limpa mensagens (para nova conversa)
   */
  const clearMessages = () => {
    setMessages([]);
    setPrompt('');
    setSelectedFile(null);
  };

  /**
   * Envia mensagem para o backend
   */
  const handleSubmit = async () => {
    if ((!prompt.trim() && !selectedFile) || isLoading) return;

    const currentPrompt = prompt;
    const currentFile = selectedFile;

    // Atualiza UI Otimista
    setMessages(prev => [...prev, {
      role: 'user',
      content: currentPrompt,
      fileName: currentFile?.name,
    }]);

    // Limpa estados
    setPrompt('');
    setSelectedFile(null);
    setIsLoading(true);

    // Reset altura textarea
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    try {
      const data = await chatService.sendMessage(
        currentPrompt,
        activeThreadId,
        currentFile,
        token
      );

      // Extrai resposta de vários formatos possíveis do n8n
      const aiContent = data.message || data.output || data.text || JSON.stringify(data);
      
      // Se retornou thread_id novo, atualiza a lista de threads e seleciona como ativa
      if (data.thread_id && !activeThreadId) {
        const newThread = {
          thread_id: data.thread_id,
          name: currentPrompt.substring(0, 50) + (currentPrompt.length > 50 ? '...' : ''),
          updatedAt: new Date().toISOString(),
        };
        upsertThread(newThread);
        selectThread(data.thread_id);
        // Recarrega threads do backend para sincronizar
        loadThreads();
      } else if (activeThreadId) {
        // Atualiza o updatedAt da thread existente para manter "recente"
        upsertThread({
          thread_id: activeThreadId,
          updatedAt: new Date().toISOString(),
        });
      }

      setMessages(prev => [...prev, { role: 'ai', content: aiContent }]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        role: 'ai',
        content: `Erro: ${error.message}. Verifique o CORS e a URL.`,
        isError: true,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Carrega histórico quando thread ativa muda ou nova conversa é criada
  useEffect(() => {
    if (activeThreadId) {
      loadHistory(activeThreadId);
    } else {
      clearMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeThreadId, newChatTrigger]);

  return {
    // Estados
    messages,
    prompt,
    selectedFile,
    isLoading,
    isDragging,
    hasMessages,
    
    // Refs
    textareaRef,
    messagesEndRef,
    
    // Handlers
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleKeyDown,
    handleFileSelect,
    handleFileRemove,
    handlePromptChange,
    handleSubmit,
    clearMessages,
  };
};
