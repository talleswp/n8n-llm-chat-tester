import React from 'react';
import { useThreads } from '../../hooks/useThreads';
import ThreadItem from './ThreadItem';
import UserMenu from './UserMenu';
import './Sidebar.css';

const Sidebar = ({ isOpen, onToggle, user, onLogout }) => {
  const { threads, activeThreadId, createNewThread, selectThread, isLoadingThreads } = useThreads();

  const handleNewChat = () => {
    createNewThread();
    if (window.innerWidth < 992) onToggle();
  };

  const handleSelectThread = (threadId) => {
    selectThread(threadId);
    if (window.innerWidth < 992) onToggle();
  };

  return (
    <div className={`sidebar-container ${isOpen ? 'open' : 'closed'}`}>
      <nav className="sidebar d-flex flex-column flex-shrink-0 position-relative h-100">

        {/* Brand / Workspace */}
        <div className="px-4 py-2">
          <div className="d-flex align-items-center gap-3 px-2 py-2 rounded bg-accent-hover">
            <i class="bi bi-globe-central-south-asia-fill"></i>
            <div className="d-grid flex-grow-1" style={{ lineHeight: 1.2 }}>
              <span className="text-truncate fw-semibold" style={{ fontSize: '14px' }}>N-SPACE</span>
              <span className="text-truncate text-body-secondary" style={{ fontSize: '11px', marginTop: '-1px' }}>Business</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="px-4 py-2">
          <ul className="nav flex-column" style={{ gap: '2px' }}>
            <li className="nav-item">
              <a
                className="nav-link px-2 rounded-1 bg-accent-hover d-flex align-items-center gap-2"
                href="#"
                onClick={(e) => { e.preventDefault(); handleNewChat(); }}
                style={{ fontSize: '14px' }}
              >
                <i className="bi bi-textarea"></i>
                <span>Nova Conversa</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Threads List */}
        <div className="px-4 py-2 flex-fill overflow-y-auto sidebar-scrollbar">
          <div className="d-flex align-items-center mb-1">
            <span className="d-block text-body-secondary fw-semibold me-auto" style={{ fontSize: '11px' }}>Conversas recentes</span>
          </div>

          {isLoadingThreads && (
            <div className="text-center py-4 text-body-secondary small">
              Carregando conversas...
            </div>
          )}

          {!isLoadingThreads && threads.length === 0 && (
            <div className="text-center py-4 text-body-secondary small">
              <p className="mb-1">Nenhuma conversa ainda</p>
              <p className="opacity-75 mb-0">Inicie uma nova conversa!</p>
            </div>
          )}

          <ul className="nav flex-column" style={{ gap: '2px' }}>
            {!isLoadingThreads && threads.map(thread => (
              <ThreadItem
                key={thread.thread_id}
                thread={thread}
                isActive={thread.thread_id === activeThreadId}
                onClick={() => handleSelectThread(thread.thread_id)}
              />
            ))}
          </ul>
        </div>

        {/* User Section (Bottom) */}
        <div className="d-flex flex-column gap-2 px-4 pb-4">
          <UserMenu user={user} onLogout={onLogout} />

          {/* Thread Count */}
          <div className="text-center text-body-secondary" style={{ fontSize: '11px' }}>
            {threads.length} conversa{threads.length !== 1 ? 's' : ''}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
