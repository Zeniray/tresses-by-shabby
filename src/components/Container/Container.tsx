import type { HTMLAttributes, ReactNode } from 'react'

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  narrow?: boolean
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'article' | 'main' | 'header' | 'footer'
}

export function Container({
  narrow = false,
  children,
  className = '',
  as = 'div',
  ...props
}: ContainerProps) {
  const Component = as
  const containerClass = narrow ? 'container-narrow' : 'container'

  return (
    <Component className={`${containerClass} ${className}`.trim()} {...props}>
      {children}
    </Component>
  )
}

