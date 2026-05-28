import React, { useState } from 'react';
import styles from './styles.module.css';

export function PasswordInput({
  label,
  error,
  id,
  showToggleText = true,
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.field}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      <div className={styles.inputPass}>
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          className={[
            styles.input, 
            error ? styles.inputError : '', 
            showToggleText ? '' : styles.noTextPadding,
            className
          ].filter(Boolean).join(' ')}
          {...props}
        />
        <button
          className={styles.passToggle}
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
        >
          <span className={styles.eye}>
            {showPassword ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
          </span>
          {showToggleText && (
            <span className={styles.toggleText}>{showPassword ? 'Ocultar' : 'Mostrar'}</span>
          )}
        </button>
      </div>
      {error && <span className={styles.fieldError}>{error}</span>}
    </div>
  );
}
