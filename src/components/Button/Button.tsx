import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'editorial'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface BaseButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  children: ReactNode
  className?: string
}

export type ButtonAsButton = BaseButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: 'button'
    href?: never
  }

export type ButtonAsLink = BaseButtonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: 'a'
    href: string
  }

export type ButtonProps = ButtonAsButton | ButtonAsLink

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const classNames = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'btn-block' : '',
    isLoading ? 'btn-loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (props.as === 'a') {
    const restAnchorProps = { ...props }
    delete (restAnchorProps as { as?: unknown }).as
    return (
      <a className={classNames} {...restAnchorProps}>
        {leftIcon && <span className="btn-icon-left">{leftIcon}</span>}
        <span>{children}</span>
        {rightIcon && <span className="btn-icon-right">{rightIcon}</span>}
      </a>
    )
  }

  const { disabled, ...restButtonProps } = props
  delete (restButtonProps as { as?: unknown }).as
  return (
    <button
      className={classNames}
      disabled={disabled || isLoading}
      aria-busy={isLoading ? 'true' : undefined}
      {...restButtonProps}
    >
      {isLoading && (
        <span className="btn-spinner" aria-hidden="true" />
      )}
      {leftIcon && <span className="btn-icon-left">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="btn-icon-right">{rightIcon}</span>}
    </button>
  )
}
