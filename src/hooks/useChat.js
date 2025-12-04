import { useState, useRef, useEffect } from 'react';
import { chatService } from '../services/api.service';
import { useAuth } from './useAuth';

/**
 * Hook personalizado para gerenciar toda a lógica do chat
 * Separa a lógica de negócio da apresentação
 */
export const useChat = () => {
  const { token } = useAuth();
  
  // Estados
  const [sessionId] = useState(() => `sess-${Math.random().toString(36).substr(2, 6)}`);
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
        sessionId,
        currentFile,
        token
      );

      // Extrai resposta de vários formatos possíveis do n8n
      const aiContent = data.message || data.output || data.text || JSON.stringify(data);

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

  return {
    // Estados
    sessionId,
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
  };
};
