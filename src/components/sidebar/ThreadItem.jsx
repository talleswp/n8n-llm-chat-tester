import React from 'react';
import { formatRelativeDate } from '../../utils/dateUtils';
import './ThreadItem.css';

const MAX_TITLE_LENGTH = 20;

const ThreadItem = ({ thread, isActive, onClick }) => {
  const truncatedName = thread.name && thread.name.length > MAX_TITLE_LENGTH
    ? thread.name.slice(0, MAX_TITLE_LENGTH) + '…'
    : thread.name;

  return (
    <li className="nav-item">
      <a
        className={`nav-link px-2 rounded-1 bg-accent-hover d-flex align-items-center ${isActive ? 'active' : ''}`}
        href="#"
        onClick={(e) => { e.preventDefault(); onClick(); }}
        title={thread.name}
        style={{ fontSize: '13px', overflow: 'hidden' }}
      >
        <span className="text-truncate flex-fill" style={{ minWidth: 0 }}>{truncatedName}</span>
        {thread.updatedAt && (
          <span className="text-body-secondary flex-shrink-0 ms-auto" style={{ fontSize: '10px' }}>{formatRelativeDate(thread.updatedAt)}</span>
        )}
      </a>
    </li>
  );
};

export default ThreadItem;
