import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useChat } from '../../hooks/useChat';
import Sidebar from '../sidebar/Sidebar';
import './Chat.css';

const Chat = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const {
    messages,
    prompt,
    selectedFile,
    isLoading,
    isDragging,
    hasMessages,
    textareaRef,
    messagesEndRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleKeyDown,
    handleFileSelect,
    handleFileRemove,
    handlePromptChange,
    handleSubmit,
  } = useChat();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main Chat Area */}
      <div className={`app-container ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
        {/* Header */}
        <div className="header">
          <div className="header-left">
            <button className="sidebar-toggle-header" onClick={toggleSidebar} title={isSidebarOpen ? "Fechar menu" : "Abrir menu"}>
              <i class="bi bi-list"></i>
            </button>
            <span className="brand">n8n Workspace</span>
          </div>
          <div className="header-right">
            <span className="user-info"><i class="bi bi-person-square me-2"></i>{user?.name || user?.email}</span>
            <button className="sidebar-toggle-header" onClick={logout} title="Sair">
              <i class="bi bi-box-arrow-right"></i>
            </button>
          </div>
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
              <span style={{ color: '#a8c7fa' }}>📎</span>
              <span style={{ fontWeight: 500 }}>{selectedFile.name}</span>
              <button
                className="remove-file-btn"
                onClick={handleFileRemove}
              >✕</button>
            </div>
          )}

          {/* Botão de Anexo (Clipe) */}
          <label className="icon-button" title="Anexar imagem">
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => handleFileSelect(e.target.files[0])}
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
            onChange={(e) => handlePromptChange(e.target.value)}
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
          <div style={{ textAlign: 'center', marginTop: '24px', color: '#666', fontSize: '13px' }}>
            A IA pode cometer erros. Verifique informações importantes.
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default Chat;
