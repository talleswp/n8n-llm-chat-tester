import React from 'react';

const EmailInput = ({ value, onChange, placeholder, disabled, autoComplete, autoFocus }) => {
  return (
    <div className="form-group">
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
      />
    </div>
  );
};

export default EmailInput;
