import React, { useState } from 'react';

const PasswordInput = ({ value, onChange, placeholder, disabled, autoComplete }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="form-group">
      <label htmlFor="password">Password</label>
      <div className="password-input-wrapper">
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          className="toggle-password"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
