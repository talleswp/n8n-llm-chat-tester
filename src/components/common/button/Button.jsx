import React from 'react';

const Button = ({ type = 'submit', disabled, isLoading, loadingText, children, ...props }) => {
  return (
    <button
      type={type}
      className="btn btn-sm btn-primary w-100 mt-3"
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? loadingText : children}
    </button>
  );
};

export default Button;
