import React, { useState, useRef, useEffect } from 'react';
import { formatRelativeDate } from '../../utils/dateUtils';
import './ThreadItem.css';

const MAX_TITLE_LENGTH = 20;

const ThreadItem = ({ thread, isActive, onClick, onDelete, onRename }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(thread.name);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const truncatedName = thread.name && thread.name.length > MAX_TITLE_LENGTH
    ? thread.name.slice(0, MAX_TITLE_LENGTH) + '…'
    : thread.name;

  const handleRenameStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditName(thread.name);
    setIsEditing(true);
  };

  const handleRenameConfirm = () => {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== thread.name) {
      onRename(thread.thread_id, trimmed);
    }
    setIsEditing(false);
  };

  const handleRenameKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRenameConfirm();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(thread.thread_id);
  };

  if (isEditing) {
    return (
      <li className="nav-item">
        <div className="px-2 py-1">
          <input
            ref={inputRef}
            type="text"
            className="form-control form-control-sm"
            style={{ fontSize: '13px' }}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={handleRenameKeyDown}
            onBlur={handleRenameConfirm}
          />
        </div>
      </li>
    );
  }

  return (
    <li className="nav-item thread-item">
      <a
        className={`nav-link px-2 rounded-1 bg-accent-hover d-flex align-items-center ${isActive ? 'active' : ''}`}
        href="#"
        onClick={(e) => { e.preventDefault(); onClick(); }}
        title={thread.name}
        style={{ fontSize: '13px', overflow: 'hidden' }}
      >
        <span className="text-truncate flex-fill" style={{ minWidth: 0 }}>{truncatedName}</span>

        <span className="thread-actions flex-shrink-0 d-flex align-items-center gap-1 ms-1">
          <button
            className="btn btn-sm border-0 p-0 text-body-secondary thread-action-btn"
            onClick={handleRenameStart}
            title="Renomear"
          >
            <i className="bi bi-pencil" style={{ fontSize: '11px' }}></i>
          </button>
          <button
            className="btn btn-sm border-0 p-0 text-body-secondary thread-action-btn"
            onClick={handleDelete}
            title="Excluir"
          >
            <i className="bi bi-trash" style={{ fontSize: '11px' }}></i>
          </button>
        </span>

        {thread.updatedAt && (
          <span className="thread-time text-body-secondary flex-shrink-0 ms-1" style={{ fontSize: '10px' }}>{formatRelativeDate(thread.updatedAt)}</span>
        )}
      </a>
    </li>
  );
};

export default ThreadItem;
