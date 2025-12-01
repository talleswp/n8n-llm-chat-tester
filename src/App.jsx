import React, { useState, useRef, useEffect } from 'react';
import './App.css'; // Importando o CSS separado

const N8nChat = () => {
  // --- CONFIGURAÇÃO ---
  const WEBHOOK_URL = 'https://automacao.tizarlabs.app/webhook/llm-chat';

  // --- ESTADOS ---
  const [sessionId] = useState(() => `sess-${Math.random().toString(36).substr(2, 6)}`);
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // --- REFS ---
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  const hasMessages = messages.length > 0;

  // --- EFEITOS ---
  
  // Auto-scroll para o fim
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Auto-resize do Textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset para calcular diminution
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

  const handleSubmit = async () => {
    if ((!prompt.trim() && !selectedFile) || isLoading) return;

    const currentPrompt = prompt;
    const currentFile = selectedFile;

    // Atualiza UI Otimista
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: currentPrompt, 
      fileName: currentFile?.name 
    }]);
    
    // Limpa estados
    setPrompt('');
    setSelectedFile(null);
    setIsLoading(true);
    
    // Reset altura textarea
    if(textareaRef.current) textareaRef.current.style.height = 'auto';

    try {
      const formData = new FormData();
      formData.append('chatInput', currentPrompt);
      formData.append('sessionId', sessionId);
      if (currentFile) formData.append('file', currentFile);

      const res = await fetch(WEBHOOK_URL, { 
        method: 'POST', 
        body: formData 
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erro ${res.status}: ${errorText || 'Falha na requisição'}`);
      }

      const data = await res.json();
      
      // Tenta extrair a resposta de vários formatos possíveis do n8n
      const aiContent = data.message || data.output || data.text || JSON.stringify(data);
      
      setMessages(prev => [...prev, { role: 'ai', content: aiContent }]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', content: `Erro: ${error.message}. Verifique o CORS e a URL.`, isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      
      {/* Header */}
      <div className="header">
        <span className="brand">n8n Workspace</span>
        <span className="session-id">{sessionId}</span>
      </div>

      {/* Lista de Mensagens */}
      {hasMessages && (
        <div className="chat-list">
          {messages.map((msg, i) => (
            <div key={i} className={`bubble-row ${msg.role}`}>
               <div className={`bubble ${msg.role === 'user' ? 'user-content' : 'ai-content'}`}>
                  {/* Se tiver arquivo anexado na mensagem */}
                  {msg.fileName && (
                    <div className="file-attachment">
                        <span>📎</span> 
                        <span>{msg.fileName}</span>
                    </div>
                  )}
                  {/* Conteúdo Texto */}
                  {msg.content}
               </div>
            </div>
          ))}
          
          {/* Loading Indicator */}
          {isLoading && (
            <div className="bubble-row ai">
               <div className="bubble ai-content">
                  <span className="typing-indicator">Gerando resposta...</span>
               </div>
            </div>
          )}
          
          {/* Elemento invisível para scroll */}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Área de Input (Centralizada ou Bottom) */}
      <div className={`input-wrapper ${!hasMessages ? 'centered' : ''}`}>
        
        {!hasMessages && (
          <h1 className="hero-text">Como posso ajudar?</h1>
        )}

        {/* Caixa de Input com Drag & Drop */}
        <div 
          className={`input-box ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          
          {/* Overlay visual ao arrastar */}
          {isDragging && (
            <div className="drag-overlay">Solte para anexar</div>
          )}

          {/* Preview flutuante do arquivo */}
          {selectedFile && !isDragging && (
            <div className="file-preview-float">
              <span style={{color: '#a8c7fa'}}>📎</span>
              <span style={{fontWeight: 500}}>{selectedFile.name}</span>
              <button 
                className="remove-file-btn"
                onClick={() => setSelectedFile(null)}
              >✕</button>
            </div>
          )}

          {/* Botão de Anexo (Clipe) */}
          <label className="icon-button" title="Anexar arquivo">
            <input 
              type="file" 
              style={{display:'none'}} 
              onChange={(e) => setSelectedFile(e.target.files[0])} 
            />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
            </svg>
          </label>

          {/* Área de Texto */}
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder={isDragging ? "" : "Digite sua mensagem..."}
            className="chat-textarea"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {/* Botão de Enviar */}
          <button 
            onClick={handleSubmit}
            disabled={(!prompt.trim() && !selectedFile) || isLoading}
            className={`send-button ${prompt.trim() || selectedFile ? 'active' : ''}`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
          </button>
        </div>
        
        {/* Footer Text */}
        {!hasMessages && (
          <div style={{textAlign:'center', marginTop:'24px', color:'#666', fontSize:'13px'}}>
            A IA pode cometer erros. Verifique informações importantes.
          </div>
        )}
      </div>

    </div>
  );
};

export default N8nChat;