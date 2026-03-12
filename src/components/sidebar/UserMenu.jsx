import React, { useState, useRef, useEffect } from 'react';

const UserMenu = ({ user, onLogout, onSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="dropup" ref={menuRef}>
      <button
        type="button"
        className="w-100 px-2 py-2 text-start border-0 bg-transparent shadow-none bg-accent-hover rounded d-flex gap-3 align-items-center"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div style={{ fontSize: '1.75rem', lineHeight: 1, color: '#391176' }}>
          <i className="bi bi-person-circle"></i>
        </div>
        <div className="flex-fill" style={{ minWidth: 0 }}>
          <div className="d-flex align-items-center gap-2">
            <span className="fw-semibold text-truncate" style={{ fontSize: '13px', color: '#391176' }}>
              {user?.name || 'Usuário'}
            </span>
          </div>
          <span className="d-block text-body-secondary text-truncate" style={{ fontSize: '11px' }}>
            {user?.email}
          </span>
        </div>
        <span className="ms-auto">
          <i className="bi bi-chevron-expand" style={{ fontSize: '12px' }}></i>
        </span>
      </button>

      {isOpen && (
        <div
          className="dropdown-menu show shadow-sm border"
          style={{ bottom: '100%', left: 0, right: 0, marginBottom: '4px', minWidth: '100%' }}
        >
          <div className="dropdown-header px-3">
            <span className="d-block text-body-secondary" style={{ fontSize: '11px' }}>Connected as:</span>
            <span className="d-block fw-semibold" style={{ fontSize: '13px' }}>{user?.name || 'User'}</span>
          </div>
          <div className="dropdown-divider"></div>
          <a
            className="dropdown-item d-flex align-items-center gap-2 px-3"
            href="#"
            onClick={(e) => { e.preventDefault(); setIsOpen(false); onSettings?.(); }}
          >
            <i className="bi bi-gear"></i>
            <span>Settings</span>
          </a>
          <div className="dropdown-divider"></div>
          <a
            className="dropdown-item d-flex align-items-center gap-2 px-3 text-danger"
            href="#"
            onClick={(e) => { e.preventDefault(); setIsOpen(false); onLogout(); }}
          >
            <i className="bi bi-box-arrow-right"></i>
            <span>Logout</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
