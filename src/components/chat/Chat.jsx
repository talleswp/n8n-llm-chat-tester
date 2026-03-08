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
    <div className="d-flex flex-column flex-lg-row vh-100 bg-body-tertiary" style={{ overflow: 'hidden' }}>
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        user={user}
        onLogout={logout}
      />

      {/* Backdrop mobile */}
      {isSidebarOpen && (
        <div className="sidebar-backdrop d-lg-none" onClick={toggleSidebar} />
      )}

      {/* Main Content Area */}
      <div className="flex-lg-fill overflow-x-auto vstack vh-100">
        <div className="flex-fill d-flex flex-column overflow-hidden mt-lg-2 bg-body rounded-top-start border-top-lg border-start-lg shadow-sm">
          {/* Top Bar */}
          <div className="d-flex gap-2 align-items-center px-4 py-3 flex-shrink-0 border-bottom">
            <button
              type="button"
              className="btn btn-sm btn-light border-0 shadow-none"
              onClick={toggleSidebar}
              title={isSidebarOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              <i className="bi bi-layout-sidebar"></i>
            </button>
          </div>

          {/* Chat Content */}
          {hasMessages ? (
            <div className="d-flex flex-column flex-fill" style={{ minHeight: 0 }}>
              {/* Messages List */}
              <div className="flex-fill overflow-y-auto px-3 px-md-4 py-3 d-flex flex-column">
                <div className="mx-auto w-100" style={{ maxWidth: '800px' }}>
                  {messages.map((msg, i) => (
                    <div key={i} className={`bubble-row ${msg.role} mb-3`}>
                      <div className={`bubble ${msg.role === 'user' ? 'user-content' : 'ai-content'}`}>
                        {msg.fileName && (
                          <div className="d-flex align-items-center gap-2 small mb-2 p-2 bg-body-secondary rounded opacity-75" style={{ width: 'fit-content' }}>
                            <span>📎</span>
                            <span>{msg.fileName}</span>
                          </div>
                        )}
                        {msg.content}
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="bubble-row ai mb-3">
                      <div className="bubble ai-content">
                        <span className="fst-italic opacity-50 small">Gerando resposta...</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Bottom Input Bar */}
              <div className="px-3 px-md-4 py-3 flex-shrink-0 border-top">
                <div className="mx-auto w-100" style={{ maxWidth: '800px' }}>
                  <div
                    className={`input-box position-relative d-flex align-items-center rounded-pill border bg-body px-3 ${isDragging ? 'border-primary border-2 border-dashed' : ''}`}
                    style={{ minHeight: '52px' }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {isDragging && (
                      <div className="drag-overlay position-absolute top-0 start-0 end-0 bottom-0 rounded-pill d-flex align-items-center justify-content-center text-primary fw-semibold" style={{ zIndex: 10, pointerEvents: 'none', backgroundColor: 'rgba(var(--bs-primary-rgb), 0.05)' }}>
                        Solte para anexar
                      </div>
                    )}

                    {selectedFile && !isDragging && (
                      <div className="file-preview-float position-absolute bg-body border rounded-3 px-3 py-2 small d-flex align-items-center gap-2 shadow-sm" style={{ top: '-52px', left: 0, zIndex: 5 }}>
                        <span className="text-primary">📎</span>
                        <span className="fw-medium">{selectedFile.name}</span>
                        <button className="btn-close ms-1" style={{ fontSize: '0.55rem' }} onClick={handleFileRemove}></button>
                      </div>
                    )}

                    <label className="btn btn-sm border-0 bg-transparent text-secondary p-2" role="button" title="Anexar imagem">
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileSelect(e.target.files[0])}
                      />
                      <i className="bi bi-paperclip fs-5"></i>
                    </label>

                    <textarea
                      ref={textareaRef}
                      rows={1}
                      placeholder={isDragging ? '' : 'Digite sua mensagem...'}
                      className="form-control border-0 shadow-none bg-transparent flex-fill"
                      style={{ resize: 'none', maxHeight: '150px', fontSize: '15px' }}
                      value={prompt}
                      onChange={(e) => handlePromptChange(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />

                    <button
                      onClick={handleSubmit}
                      disabled={(!prompt.trim() && !selectedFile) || isLoading}
                      className={`btn btn-sm rounded-circle d-flex align-items-center justify-content-center ms-2 ${prompt.trim() || selectedFile ? 'btn-primary' : 'btn-light text-secondary'}`}
                      style={{ width: '38px', height: '38px', minWidth: '38px' }}
                    >
                      <i className="bi bi-arrow-up"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Welcome / Empty State */
            <div className="flex-fill overflow-y-auto">
              <main className="container-fluid py-5">
                <div className="mx-auto" style={{ maxWidth: '768px' }}>
                  <div className="my-5 text-center">
                    <h1 className="h1" style={{ letterSpacing: '-0.025em' }}>
                      {user?.name ? `Olá ${user.name.split(' ')[0]} 👋` : 'Como posso ajudar?'}
                    </h1>
                    <p className="px-lg-5 mt-4 text-body-secondary">
                      Pergunte qualquer coisa, explore possibilidades e obtenha respostas instantâneas — tudo em um único prompt.
                    </p>
                  </div>

                  {/* Card Input */}
                  <div className="card shadow-sm">
                    <div className="card-header bg-transparent">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-inline-flex gap-3 align-items-center">
                          <i className="bi bi-textarea text-primary"></i>
                          <span className="fw-semibold">Nova conversa</span>
                        </div>
                        <div className="d-flex gap-2 ms-auto">
                          <button type="button" className="btn btn-sm btn-light d-inline-flex align-items-center justify-content-center" style={{ width: '2rem', height: '2rem', padding: 0 }}>
                            <i className="bi bi-sliders"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className="position-relative border rounded-3 p-3"
                        style={{ transition: 'border-color 0.2s' }}
                      >
                        {isDragging && (
                          <div className="position-absolute top-0 start-0 end-0 bottom-0 rounded-3 d-flex align-items-center justify-content-center text-primary fw-semibold" style={{ zIndex: 10, pointerEvents: 'none', backgroundColor: 'rgba(var(--bs-primary-rgb), 0.05)' }}>
                            Solte para anexar
                          </div>
                        )}
                        {selectedFile && !isDragging && (
                          <div className="d-flex align-items-center gap-2 mb-2 p-2 bg-body-secondary rounded small">
                            <span>📎</span>
                            <span className="fw-medium">{selectedFile.name}</span>
                            <button
                              className="btn-close ms-auto"
                              style={{ fontSize: '0.6rem' }}
                              onClick={handleFileRemove}
                            ></button>
                          </div>
                        )}
                        <textarea
                          ref={textareaRef}
                          className="form-control border-0 shadow-none p-0"
                          placeholder="Como a IA pode ajudar você hoje?"
                          rows={3}
                          style={{ resize: 'none' }}
                          value={prompt}
                          onChange={(e) => handlePromptChange(e.target.value)}
                          onKeyDown={handleKeyDown}
                        />
                        <hr className="my-3" />
                        <div className="d-flex gap-2 flex-wrap">
                          <label className="btn btn-sm btn-neutral mb-0" role="button">
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={(e) => handleFileSelect(e.target.files[0])}
                            />
                            <i className="bi bi-paperclip"></i>
                            <span className="ms-1">Anexar</span>
                          </label>
                          <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={(!prompt.trim() && !selectedFile) || isLoading}
                            className="btn btn-sm btn-primary ms-auto"
                          >
                            {isLoading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-1"></span>
                                Enviando...
                              </>
                            ) : (
                              <>
                                <i class="bi bi-play-circle-fill"></i>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="text-center mt-5 text-body-secondary small">
                    A IA pode cometer erros. Verifique informações importantes.
                  </div>
                </div>
              </main>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
