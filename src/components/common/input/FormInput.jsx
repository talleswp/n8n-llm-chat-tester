import React, { useState } from 'react';

const FormInput = ({ id, label, type = 'text', value, onChange, placeholder, disabled, autoComplete, autoFocus }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const input = (
    <input
      id={id}
      type={inputType}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
    />
  );

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      {isPassword ? (
        <div className="password-input-wrapper">
          {input}
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
          </button>
        </div>
      ) : input}
    </div>
  );
};

export default FormInput;
