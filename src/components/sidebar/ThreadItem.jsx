import React from 'react';
import { formatRelativeDate } from '../../utils/dateUtils';
import './ThreadItem.css';

const ThreadItem = ({ thread, isActive, onClick }) => {
  return (
    <div 
      className={`thread-item ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="thread-icon">💬</div>
      <div className="thread-content">
        <div className="thread-name">{thread.name}</div>
        {thread.updatedAt && (
          <div className="thread-date">
            {formatRelativeDate(thread.updatedAt)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreadItem;
