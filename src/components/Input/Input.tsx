import { useId } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  errorMessage?: string
  leftAddon?: ReactNode
  rightAddon?: ReactNode
  wrapperClassName?: string
}

export function Input({
  id: propId,
  label,
  helperText,
  errorMessage,
  required,
  disabled,
  className = '',
  wrapperClassName = '',
  leftAddon,
  rightAddon,
  ...inputProps
}: InputProps) {
  const generatedId = useId()
  const inputId = propId || `input-${generatedId}`
  const helperId = helperText ? `${inputId}-helper` : undefined
  const errorId = errorMessage ? `${inputId}-error` : undefined

  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined

  return (
    <div className={`form-group ${errorMessage ? 'has-error' : ''} ${wrapperClassName}`.trim()}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          <span>{label}</span>
          {required && (
            <span className="form-required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
        {leftAddon && (
          <span style={{ position: 'absolute', left: '12px', pointerEvents: 'none', color: 'var(--color-text-muted)' }}>
            {leftAddon}
          </span>
        )}

        <input
          id={inputId}
          className={`form-input ${className}`.trim()}
          style={{
            paddingLeft: leftAddon ? '2.5rem' : undefined,
            paddingRight: rightAddon ? '2.5rem' : undefined,
          }}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(errorMessage)}
          aria-describedby={describedBy}
          {...inputProps}
        />

        {rightAddon && (
          <span style={{ position: 'absolute', right: '12px', pointerEvents: 'none', color: 'var(--color-text-muted)' }}>
            {rightAddon}
          </span>
        )}
      </div>

      {errorMessage && (
        <div id={errorId} className="form-error" role="alert">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {!errorMessage && helperText && (
        <div id={helperId} className="form-helper">
          {helperText}
        </div>
      )}
    </div>
  )
}

