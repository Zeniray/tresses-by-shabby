import { useState } from 'react'
import { Container } from '../Container/index.ts'
import { Button } from '../Button/index.ts'
import { useAuth } from '../../hooks/useAuth.ts'
import './Header.css'

export interface NavItem {
  label: string
  href: string
  isActive?: boolean
}

export interface HeaderProps {
  navItems?: NavItem[]
  bagCount?: number
  onOpenBag?: () => void
}

const defaultNavItems: NavItem[] = [
  { label: 'Collection', href: '#collection', isActive: true },
  { label: 'Textures & Lengths', href: '#textures' },
  { label: 'The Atelier', href: '#atelier' },
  { label: 'Care & Styling', href: '#care' },
]

export function Header({
  navItems = defaultNavItems,
  bagCount = 0,
  onOpenBag,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth()

  const accountLabel =
    user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || 'Account'

  return (
    <header className="brand-header" role="banner">
      <Container>
        <div className="brand-header-inner">
          {/* Brand Identity / Masthead */}
          <a href="#" className="brand-logo-group" aria-label="Tresses by Shabby - Home">
            <span className="brand-title">Tresses by Shabby</span>
            <span className="brand-subtitle">Editorial Wig Atelier &bull; Lagos</span>
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

          {/* Actions: Bag Access */}
          <div className="brand-actions">
            {/* Shopping Bag Button */}
            <button
              type="button"
              className="brand-bag-trigger"
              onClick={onOpenBag}
              aria-label={`Shopping bag with ${bagCount} item${bagCount === 1 ? '' : 's'}`}
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span className="brand-bag-text">Bag</span>
              <span className="brand-bag-count" aria-hidden="true">
                {bagCount}
              </span>
            </button>

            <Button
              as="a"
              href="#collection"
              variant="primary"
              size="sm"
              className="hidden-mobile"
            >
              Shop Wigs
            </Button>

            {/* Auth: guest-friendly optional sign-in */}
            {!authLoading && !user && (
              <Button
                variant="outline"
                size="sm"
                className="hidden-mobile"
                onClick={signInWithGoogle}
              >
                Sign in with Google
              </Button>
            )}
            {!authLoading && user && (
              <div className="brand-account hidden-mobile">
                <span className="brand-account-name" title={user.email ?? undefined}>
                  {accountLabel}
                </span>
                <button type="button" className="brand-account-signout" onClick={signOut}>
                  Sign out
                </button>
              </div>
            )}

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
          <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {!authLoading && !user && (
              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={() => {
                  setMobileMenuOpen(false)
                  void signInWithGoogle()
                }}
              >
                Sign in with Google
              </Button>
            )}
            {!authLoading && user && (
              <>
                <span className="link-subtle" aria-label={`Signed in as ${user.email ?? accountLabel}`}>
                  Signed in as {accountLabel}
                </span>
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={() => {
                    setMobileMenuOpen(false)
                    void signOut()
                  }}
                >
                  Sign out
                </Button>
              </>
            )}
            <Button
              as="a"
              href="#collection"
              variant="primary"
              size="md"
              fullWidth
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore Collection
            </Button>
            <Button
              as="a"
              href="#consult"
              variant="outline"
              size="md"
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

