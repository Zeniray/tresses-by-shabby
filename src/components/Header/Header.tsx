import { useState } from 'react'
import { Container } from '../Container/index.ts'
import { Button } from '../Button/index.ts'
import './Header.css'

export interface NavItem {
  label: string
  href: string
  isActive?: boolean
}

export interface HeaderProps {
  navItems?: NavItem[]
}

const defaultNavItems: NavItem[] = [
  { label: 'Collection', href: '#collection', isActive: true },
  { label: 'Textures & Lengths', href: '#textures' },
  { label: 'The Atelier', href: '#atelier' },
  { label: 'Care & Styling', href: '#care' },
]

export function Header({ navItems = defaultNavItems }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="brand-header" role="banner">
      <Container>
        <div className="brand-header-inner">
          {/* Brand Identity / Masthead */}
          <a href="#" className="brand-logo-group" aria-label="Tresses by Shabby - Home">
            <span className="brand-title">Tresses by Shabby</span>
            <span className="brand-subtitle">Editorial Wig Atelier</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="brand-nav" aria-label="Primary navigation">
            <ul className="brand-nav-list">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className={`link-nav ${item.isActive ? 'is-active' : ''}`}
                    aria-current={item.isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions & Mobile Trigger */}
          <div className="brand-actions">
            <Button
              as="a"
              href="#contact"
              variant="outline"
              size="sm"
              className="hidden-mobile"
            >
              Consult Stylist
            </Button>
            <Button
              as="a"
              href="#collection"
              variant="primary"
              size="sm"
            >
              Explore Wigs
            </Button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="mobile-menu-toggle"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {mobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="7" x2="20" y2="7" />
                    <line x1="4" y1="12" x2="16" y2="12" />
                    <line x1="4" y1="17" x2="20" y2="17" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </Container>

      {/* Accessible Mobile Nav Drawer (Touch friendly, no hover dependency) */}
      <div
        id="mobile-navigation-drawer"
        className={`mobile-nav-panel ${mobileMenuOpen ? 'is-open' : ''}`}
        aria-hidden={!mobileMenuOpen}
      >
        <Container>
          <ul className="mobile-nav-list">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="link-subtle"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-2)' }}>
            <Button
              as="a"
              href="#contact"
              variant="outline"
              size="sm"
              fullWidth
              onClick={() => setMobileMenuOpen(false)}
            >
              Consult Stylist
            </Button>
          </div>
        </Container>
      </div>
    </header>
  )
}

