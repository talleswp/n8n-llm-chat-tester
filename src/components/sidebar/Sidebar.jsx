import React from 'react';
import { useThreads } from '../../hooks/useThreads';
import ThreadItem from './ThreadItem';
import UserMenu from './UserMenu';
import './Sidebar.css';

const Sidebar = ({ isOpen, onToggle, user, onLogout }) => {
  const { threads, activeThreadId, createNewThread, selectThread, deleteThread, renameThread, isLoadingThreads } = useThreads();

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
          <div className="d-flex align-items-center gap-3 px-2 py-6 rounded bg-accent-hover">
            <img src="/img/logo-n-space-white.svg" alt="N-SPACE" className="logo-reveal" style={{ height: '28px' }} />
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
                <span>New conversation</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Threads List */}
        <div className="px-4 py-2 flex-fill overflow-y-auto sidebar-scrollbar">
          <div className="d-flex align-items-center mb-1">
            <span className="d-block text-body-secondary fw-semibold me-auto" style={{ fontSize: '11px' }}>Recent conversations</span>
          </div>

          {isLoadingThreads && (
            <div className="text-center py-4 text-body-secondary small">
              Loading conversations...
            </div>
          )}

          {!isLoadingThreads && threads.length === 0 && (
            <div className="text-center py-4 text-body-secondary small">
              <p className="mb-1">No conversations yet</p>
              <p className="opacity-75 mb-0">Start a new conversation!</p>
            </div>
          )}

          <ul className="nav flex-column" style={{ gap: '2px' }}>
            {!isLoadingThreads && threads.map(thread => (
              <ThreadItem
                key={thread.thread_id}
                thread={thread}
                isActive={thread.thread_id === activeThreadId}
                onClick={() => handleSelectThread(thread.thread_id)}
                onDelete={deleteThread}
                onRename={renameThread}
              />
            ))}
          </ul>
        </div>

        {/* User Section (Bottom) */}
        <div className="d-flex flex-column gap-2 px-4 pb-4">
          <UserMenu user={user} onLogout={onLogout} />

          {/* Thread Count */}
          <div className="text-center text-body-secondary" style={{ fontSize: '11px' }}>
            {threads.length} conversation{threads.length !== 1 ? 's' : ''}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
