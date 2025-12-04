import React from 'react';
import { useThreads } from '../../hooks/useThreads';
import ThreadItem from './ThreadItem';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
  const { threads, activeThreadId, createNewThread, selectThread, isLoadingThreads } = useThreads();

  const handleNewChat = () => {
    createNewThread();
  };

  const handleSelectThread = (threadId) => {
    selectThread(threadId);
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      {/* Header da Sidebar */}
      <div className="sidebar-header">
        <button className="new-chat-button" onClick={handleNewChat} title="Nova conversa">
          <span>✏️</span>
          <span>Nova Conversa</span>
        </button>
      </div>

      {/* Lista de Threads */}
      <div className="threads-list">
        {isLoadingThreads && (
          <div className="threads-loading">Carregando conversas...</div>
        )}

        {!isLoadingThreads && threads.length === 0 && (
          <div className="threads-empty">
            <p>Nenhuma conversa ainda</p>
            <p className="threads-empty-hint">Inicie uma nova conversa!</p>
          </div>
        )}

        {!isLoadingThreads && threads.map(thread => (
          <ThreadItem
            key={thread.thread_id}
            thread={thread}
            isActive={thread.thread_id === activeThreadId}
            onClick={() => handleSelectThread(thread.thread_id)}
          />
        ))}
      </div>

      {/* Footer da Sidebar */}
      <div className="sidebar-footer">
        <div className="sidebar-info">
          {threads.length} conversa{threads.length !== 1 ? 's' : ''}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
