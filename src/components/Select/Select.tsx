import { useId } from 'react'
import type { SelectHTMLAttributes } from 'react'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: SelectOption[]
  placeholder?: string
  helperText?: string
  errorMessage?: string
  wrapperClassName?: string
}

export function Select({
  id: propId,
  label,
  options,
  placeholder,
  helperText,
  errorMessage,
  required,
  disabled,
  className = '',
  wrapperClassName = '',
  ...selectProps
}: SelectProps) {
  const generatedId = useId()
  const selectId = propId || `select-${generatedId}`
  const helperId = helperText ? `${selectId}-helper` : undefined
  const errorId = errorMessage ? `${selectId}-error` : undefined

  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined

  return (
    <div className={`form-group ${errorMessage ? 'has-error' : ''} ${wrapperClassName}`.trim()}>
      {label && (
        <label htmlFor={selectId} className="form-label">
          <span>{label}</span>
          {required && (
            <span className="form-required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <select
        id={selectId}
        className={`form-select ${className}`.trim()}
        required={required}
        disabled={disabled}
        aria-invalid={Boolean(errorMessage)}
        aria-describedby={describedBy}
        {...selectProps}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>

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

