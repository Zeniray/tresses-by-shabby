import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { Product, ProductVariant } from './types/product.ts'
import { TEXTURE_GUIDES } from './data/products.ts'
import { useProducts } from './hooks/useProducts.ts'
import { createOrder, CheckoutError } from './lib/orders.ts'
import { formatNaira } from './utils/currency.ts'
import {
  Header,
  Container,
  Button,
  Badge,
  EditorialImage,
  ProductCard,
  Input,
} from './components/index.ts'
import './App.css'

interface BagItem {
  id: string
  product: Product
  variant: ProductVariant
  quantity: number
}

const BAG_STORAGE_KEY = 'tresses-bag'

// Restore the bag from localStorage, discarding anything malformed
function loadBagFromStorage(): BagItem[] {
  try {
    const raw = localStorage.getItem(BAG_STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is BagItem => {
      if (typeof item !== 'object' || item === null) return false
      const candidate = item as BagItem
      return (
        typeof candidate.id === 'string' &&
        typeof candidate.quantity === 'number' &&
        Number.isFinite(candidate.quantity) &&
        candidate.quantity > 0 &&
        typeof candidate.product === 'object' &&
        candidate.product !== null &&
        typeof candidate.product.id === 'string' &&
        typeof candidate.product.name === 'string' &&
        typeof candidate.product.images === 'object' &&
        candidate.product.images !== null &&
        typeof candidate.product.images.primary === 'string' &&
        typeof candidate.variant === 'object' &&
        candidate.variant !== null &&
        typeof candidate.variant.id === 'string' &&
        typeof candidate.variant.length === 'string' &&
        typeof candidate.variant.price === 'number' &&
        Number.isFinite(candidate.variant.price)
      )
    })
  } catch {
    return []
  }
}

export default function App() {
  // Shopping session state
  const [bagItems, setBagItems] = useState<BagItem[]>(loadBagFromStorage)
  const [isBagOpen, setIsBagOpen] = useState(false)
  const [selectedProductForInspect, setSelectedProductForInspect] = useState<Product | null>(null)
  const [modalVariant, setModalVariant] = useState<ProductVariant | null>(null)

  // Checkout / confirmation view state
  const [view, setView] = useState<'shop' | 'checkout' | 'confirmation'>('shop')
  const [checkoutForm, setCheckoutForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    deliveryAddress: '',
  })
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [placedOrder, setPlacedOrder] = useState<{ id: string; email: string; total: number } | null>(null)

  // Filter state for collection
  const [activeTextureFilter, setActiveTextureFilter] = useState<string>('All')
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterFeedback, setNewsletterFeedback] = useState(false)

  // Live catalogue from Supabase
  const { products, loading: catalogueLoading, error: catalogueError } = useProducts()

  // Filtered products list matching approved texture categories
  const filteredProducts =
    activeTextureFilter === 'All'
      ? products
      : products.filter((p) => p.texture.toLowerCase() === activeTextureFilter.toLowerCase())

  // Add to Bag handler
  const handleAddToBag = (product: Product, variant: ProductVariant) => {
    setBagItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.variant.id === variant.id
      )
      if (existingIndex > -1) {
        const next = [...prev]
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + 1,
        }
        return next
      }
      return [
        ...prev,
        {
          id: `${product.id}-${variant.id}`,
          product,
          variant,
          quantity: 1,
        },
      ]
    })
  }

  // Persist the bag across refreshes
  useEffect(() => {
    try {
      localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(bagItems))
    } catch {
      // Storage unavailable (private mode, quota) — bag still works in memory
    }
  }, [bagItems])

  // Remove from Bag handler
  const handleRemoveFromBag = (itemId: string) => {
    setBagItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  // Quantity controls
  const handleIncreaseQuantity = (itemId: string) => {
    setBagItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  const handleDecreaseQuantity = (itemId: string) => {
    setBagItems((prev) =>
      prev
        .map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  // Open modal for quick inspect
  const handleOpenInspect = (product: Product) => {
    setSelectedProductForInspect(product)
    setModalVariant(product.variants[1] || product.variants[0])
  }

  // Calculate bag subtotal in Naira
  const bagSubtotal = bagItems.reduce(
    (total, item) => total + item.variant.price * item.quantity,
    0
  )
  const totalItemCount = bagItems.reduce((total, item) => total + item.quantity, 0)

  const handleProceedToCheckout = () => {
    setIsBagOpen(false)
    if (bagItems.length === 0) {
      setCheckoutError('Your bag is empty. Add a piece before checking out.')
      return
    }
    setCheckoutError(null)
    setView('checkout')
    window.scrollTo(0, 0)
  }

  const handleBackToShop = () => {
    setView('shop')
    window.scrollTo(0, 0)
  }

  // Place order handler
  const handlePlaceOrder = async (e: FormEvent) => {
    e.preventDefault()
    setCheckoutError(null)

    if (bagItems.length === 0) {
      setCheckoutError('Your bag is empty. Add a piece before checking out.')
      return
    }

    const { customerName, email, phone, deliveryAddress } = checkoutForm
    if (!customerName.trim() || !email.trim() || !phone.trim() || !deliveryAddress.trim()) {
      setCheckoutError('Please fill in your name, email, phone number, and delivery address.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setCheckoutError('Please enter a valid email address.')
      return
    }
    if (phone.replace(/\D/g, '').length < 7) {
      setCheckoutError('Please enter a valid phone number.')
      return
    }

    setIsPlacingOrder(true)
    try {
      const order = await createOrder(
        {
          customerName: customerName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          deliveryAddress: deliveryAddress.trim(),
        },
        bagItems.map((item) => ({
          productVariantId: item.variant.id,
          quantity: item.quantity,
        }))
      )
      setPlacedOrder(order)
      setBagItems([])
      setView('confirmation')
      window.scrollTo(0, 0)
    } catch (err) {
      if (err instanceof CheckoutError) {
        setCheckoutError(err.message)
      } else {
        setCheckoutError('We could not place your order right now. Please check your connection and try again.')
      }
    } finally {
      setIsPlacingOrder(false)
    }
  }

  return (
    <div className="storefront-root">
      {/* 1. Header */}
      <Header
        bagCount={totalItemCount}
        onOpenBag={() => setIsBagOpen(true)}
      />

      <main id="main-content">
        {view === 'shop' && (
        <>
        {/* 2. Hero */}
        <section className="editorial-section editorial-section--subtle" aria-labelledby="hero-title">
          <Container>
            <div className="hero-editorial-grid">
              <div className="hero-copy-block">
                <div className="hero-eyebrow-row">
                  <Badge variant="rose">The Tresses Edit No. 01</Badge>
                  <span className="editorial-eyebrow editorial-eyebrow--muted">Lagos &bull; Nigeria</span>
                </div>

                <h1 id="hero-title" className="editorial-display hero-title">
                  Hair that makes you look twice.
                </h1>

                <p className="hero-subtext">
                  Wigs made for the days you want to keep it effortless, and the days you want to make an entrance.
                </p>

                <div className="hero-actions-row">
                  <Button as="a" href="#collection" variant="primary" size="lg">
                    Explore the Collection
                  </Button>
                  <Button as="a" href="#atelier" variant="outline" size="lg">
                    Meet Tresses &rarr;
                  </Button>
                </div>
              </div>

              {/* Large deliberate 4:5 aspect ratio image frame */}
              <div className="hero-image-frame" aria-label="Featured Wig Preview">
                <EditorialImage
                  slug="/products/classic-body-wave.jfif"
                  alt="Classic Body Wave wig with soft S-wave texture"
                  aspectRatio="4:5"
                />
                <div className="hero-image-caption">
                  <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>
                    Classic Body Wave
                  </span>
                  <span className="price-tag price-tag--accent">{formatNaira(540000)}</span>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 3. Featured Collection */}
        <section className="editorial-section" id="collection" aria-labelledby="collection-title">
          <Container>
            <div className="editorial-section-header">
              <span className="editorial-eyebrow">The Collection</span>
              <h2 id="collection-title">Start with the hair.</h2>
              <p className="text-muted">
                From soft waves to sleek straight lengths, explore the textures and styles that make getting ready feel a little more special.
              </p>
            </div>

            {/* Texture Filter Bar */}
            <div className="collection-filter-bar" role="group" aria-label="Filter collection by texture">
              <span className="collection-filter-label">Filter:</span>
              {[
                { label: 'All', value: 'All' },
                { label: 'Wavy', value: 'Wavy' },
                { label: 'Straight', value: 'Straight' },
                { label: 'Curly', value: 'Curly' },
                { label: 'Kinky Straight', value: 'Kinky Straight' },
              ].map((filterItem) => (
                <button
                  key={filterItem.value}
                  type="button"
                  className={`collection-filter-chip ${
                    activeTextureFilter === filterItem.value ? 'is-active' : ''
                  }`}
                  onClick={() => setActiveTextureFilter(filterItem.value)}
                >
                  {filterItem.label}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="product-showcase-grid">
              {catalogueLoading && (
                <p className="catalogue-status-message text-muted" role="status" aria-live="polite">
                  Loading the collection&hellip;
                </p>
              )}
              {!catalogueLoading && catalogueError && (
                <p className="catalogue-status-message catalogue-status-message--error" role="alert">
                  {catalogueError}
                </p>
              )}
              {!catalogueLoading && !catalogueError && products.length === 0 && (
                <p className="catalogue-status-message text-muted" role="status">
                  The collection is being prepared. Please check back soon.
                </p>
              )}
              {!catalogueLoading && !catalogueError && products.length > 0 && filteredProducts.length === 0 && (
                <p className="catalogue-status-message text-muted" role="status">
                  No pieces found for this filter.
                </p>
              )}
              {!catalogueLoading && !catalogueError && filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToBag={handleAddToBag}
                  onSelectProduct={handleOpenInspect}
                />
              ))}
            </div>
          </Container>
        </section>

        {/* 4. The Atelier / Brand Story */}
        <section className="editorial-section editorial-section--subtle" id="atelier" aria-labelledby="atelier-title">
          <Container>
            <div className="atelier-story-grid">
              {/* Left Column: Image Slot */}
              <div className="atelier-image-slot">
                <EditorialImage
                  slug="/products/silky-straight.jfif"
                  alt="Tresses by Shabby wig styling"
                  aspectRatio="3:4"
                />
              </div>

              {/* Right Column: Editorial Copy */}
              <div className="atelier-content-block">
                <span className="editorial-eyebrow">The Atelier</span>
                <h2 id="atelier-title">Your hair. Your mood. Your moment.</h2>

                <p className="text-body" style={{ color: 'var(--color-text-muted)', lineHeight: '1.7' }}>
                  We created Tresses by Shabby for women who love the feeling of finding the one.
                </p>

                <p className="text-body" style={{ color: 'var(--color-text-muted)', lineHeight: '1.7' }}>
                  The texture that feels like you. The length that changes the whole look. The style that makes getting ready feel a little different.
                </p>

                <p className="text-body" style={{ color: 'var(--color-text-muted)', lineHeight: '1.7' }}>
                  Whether you&apos;re keeping things effortless or dressing all the way up, we want choosing your wig to feel just as good as wearing it.
                </p>

                <div style={{ marginTop: 'var(--space-2)', borderLeft: '2px solid var(--color-primary)', paddingLeft: 'var(--space-4)' }}>
                  <span className="editorial-eyebrow" style={{ color: 'var(--color-burgundy)', display: 'block', marginBottom: '4px' }}>
                    Soft power meets fashion editorial.
                  </span>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                    Thoughtfully designed wigs for women who want beauty without the fuss.
                  </p>
                </div>

                {/* Brand Values / Pillars: Made with intention */}
                <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--color-border-subtle)' }}>
                  <span className="editorial-eyebrow" style={{ color: 'var(--color-text)', display: 'block', marginBottom: 'var(--space-4)' }}>
                    Made with intention
                  </span>

                  <div className="atelier-pillars-grid">
                    <div className="atelier-pillar-item">
                      <span className="atelier-pillar-title">The Right Texture</span>
                      <span className="atelier-pillar-desc">
                        Styles selected for different moods, looks and ways of wearing your hair.
                      </span>
                    </div>
                    <div className="atelier-pillar-item">
                      <span className="atelier-pillar-title">Lengths That Change the Look</span>
                      <span className="atelier-pillar-desc">
                        From shorter, easy-to-wear styles to long statement lengths.
                      </span>
                    </div>
                    <div className="atelier-pillar-item">
                      <span className="atelier-pillar-title">Comfort Matters</span>
                      <span className="atelier-pillar-desc">
                        Because looking good shouldn&apos;t mean spending the whole day adjusting your wig.
                      </span>
                    </div>
                    <div className="atelier-pillar-item">
                      <span className="atelier-pillar-title">Made for Real Life</span>
                      <span className="atelier-pillar-desc">
                        Beautiful enough for your big moments. Easy enough for your everyday ones.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 5. Texture Discovery */}
        <section className="editorial-section" id="textures" aria-labelledby="textures-title">
          <Container>
            <div className="editorial-section-header">
              <span className="editorial-eyebrow">Discovery</span>
              <h2 id="textures-title">Find your texture. Find your look.</h2>
              <p className="text-muted">
                Not sure where to start? Explore our textures and see which one feels most like you.
              </p>
            </div>

            <div className="texture-discovery-grid">
              {TEXTURE_GUIDES.map((guide) => (
                <article key={guide.id} className="texture-card">
                  <div className="texture-card-header">
                    <h3 className="texture-title">{guide.name}</h3>
                  </div>

                  <p className="texture-card-desc">{guide.description}</p>

                  <div style={{ marginTop: 'auto', paddingTop: 'var(--space-3)' }}>
                    <Button
                      as="a"
                      href="#collection"
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTextureFilter(guide.name)}
                    >
                      Explore {guide.name} &rarr;
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>

        {/* 6. Care & Styling */}
        <section className="editorial-section editorial-section--subtle" id="care" aria-labelledby="care-title">
          <Container>
            <div className="editorial-section-header">
              <span className="editorial-eyebrow">Care &amp; Styling</span>
              <h2 id="care-title">Keep your Tresses looking good.</h2>
              <p className="text-muted">
                A little care goes a long way. From washing and detangling to storing your wig between wears, we&apos;ll show you how to keep your favourite styles looking their best.
              </p>
            </div>

            <div className="care-rituals-grid">
              <div className="care-ritual-item">
                <span className="care-ritual-num">01</span>
                <h3 className="care-ritual-title">Washing &amp; Conditioning</h3>
                <p className="care-ritual-desc">
                  Simple routines for keeping your hair fresh.
                </p>
              </div>

              <div className="care-ritual-item">
                <span className="care-ritual-num">02</span>
                <h3 className="care-ritual-title">Detangling</h3>
                <p className="care-ritual-desc">
                  How to brush, comb and handle your wig gently.
                </p>
              </div>

              <div className="care-ritual-item">
                <span className="care-ritual-num">03</span>
                <h3 className="care-ritual-title">Heat Styling</h3>
                <p className="care-ritual-desc">
                  What to keep in mind before reaching for the heat.
                </p>
              </div>

              <div className="care-ritual-item">
                <span className="care-ritual-num">04</span>
                <h3 className="care-ritual-title">Storage</h3>
                <p className="care-ritual-desc">
                  Easy ways to protect your wig between wears.
                </p>
              </div>
            </div>

            <div style={{ marginTop: 'var(--space-8)' }}>
              <Button as="a" href="#care" variant="editorial" size="md">
                Read the Care Guide &rarr;
              </Button>
            </div>
          </Container>
        </section>

        {/* 7. Final Call-to-Action */}
        <section className="editorial-section editorial-section--burgundy" aria-labelledby="cta-heading">
          <Container>
            <div className="cta-editorial-box">
              <span
                className="editorial-eyebrow"
                style={{ color: '#F7EAEF', marginBottom: 'var(--space-2)' }}
              >
                Atelier Concierge
              </span>
              <h2 id="cta-heading">Found your one?</h2>
              <p>
                Take another look. Your next favourite might be waiting.
              </p>
              <div className="cta-btn-group">
                <Button as="a" href="#collection" variant="secondary" size="lg">
                  Explore the Collection &rarr;
                </Button>
                <Button
                  as="a"
                  href="https://wa.me/2348000000000"
                  target="_blank"
                  rel="noreferrer"
                  variant="outline"
                  size="lg"
                  style={{
                    borderColor: 'rgba(255, 253, 252, 0.4)',
                    color: 'var(--color-text-inverse)',
                  }}
                >
                  Need help choosing? Talk to us &rarr;
                </Button>
              </div>
            </div>
          </Container>
        </section>
        </>
        )}

        {view === 'checkout' && (
        <section className="editorial-section" aria-labelledby="checkout-title">
          <Container>
            <div className="editorial-section-header">
              <span className="editorial-eyebrow">Checkout</span>
              <h2 id="checkout-title">Almost yours.</h2>
              <p className="text-muted">
                This is an order placement, not a payment. No card details are collected.
              </p>
            </div>

            {bagItems.length === 0 ? (
              <div className="checkout-empty" role="status">
                <p className="text-muted">Your bag is empty, so there&apos;s nothing to check out yet.</p>
                <Button variant="outline" size="md" onClick={handleBackToShop}>
                  Back to the Collection &rarr;
                </Button>
              </div>
            ) : (
              <div className="checkout-grid">
                <form className="checkout-form" onSubmit={handlePlaceOrder} noValidate>
                  <div className="checkout-field">
                    <label htmlFor="checkout-name">Full name</label>
                    <Input
                      id="checkout-name"
                      type="text"
                      autoComplete="name"
                      value={checkoutForm.customerName}
                      onChange={(e) => setCheckoutForm((f) => ({ ...f, customerName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="checkout-field">
                    <label htmlFor="checkout-email">Email address</label>
                    <Input
                      id="checkout-email"
                      type="email"
                      autoComplete="email"
                      value={checkoutForm.email}
                      onChange={(e) => setCheckoutForm((f) => ({ ...f, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="checkout-field">
                    <label htmlFor="checkout-phone">Phone number</label>
                    <Input
                      id="checkout-phone"
                      type="tel"
                      autoComplete="tel"
                      value={checkoutForm.phone}
                      onChange={(e) => setCheckoutForm((f) => ({ ...f, phone: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="checkout-field">
                    <label htmlFor="checkout-address">Delivery address</label>
                    <textarea
                      id="checkout-address"
                      className="checkout-textarea"
                      autoComplete="street-address"
                      rows={4}
                      value={checkoutForm.deliveryAddress}
                      onChange={(e) => setCheckoutForm((f) => ({ ...f, deliveryAddress: e.target.value }))}
                      required
                    />
                  </div>

                  {checkoutError && (
                    <p className="checkout-error" role="alert">
                      {checkoutError}
                    </p>
                  )}

                  <Button variant="primary" size="lg" type="submit" disabled={isPlacingOrder}>
                    {isPlacingOrder ? 'Placing your order…' : `Place Order • ${formatNaira(bagSubtotal)}`}
                  </Button>
                  <Button variant="outline" size="md" type="button" onClick={handleBackToShop} disabled={isPlacingOrder}>
                    Back to the Collection
                  </Button>
                </form>

                <aside className="checkout-summary" aria-label="Order summary">
                  <h3 className="checkout-summary-title">Your Order</h3>
                  {bagItems.map((item) => (
                    <div key={item.id} className="checkout-summary-row">
                      <div>
                        <span className="checkout-summary-name">{item.product.name}</span>
                        <span className="checkout-summary-meta">
                          Length {item.variant.length} &bull; Qty {item.quantity} &bull; {formatNaira(item.variant.price)} each
                        </span>
                      </div>
                      <span className="checkout-summary-line">
                        {formatNaira(item.variant.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                  <div className="checkout-summary-total-row">
                    <span>Subtotal</span>
                    <span>{formatNaira(bagSubtotal)}</span>
                  </div>
                  <div className="checkout-summary-total-row checkout-summary-grand">
                    <span>Total</span>
                    <span>{formatNaira(bagSubtotal)}</span>
                  </div>
                </aside>
              </div>
            )}
          </Container>
        </section>
        )}

        {view === 'confirmation' && placedOrder && (
        <section className="editorial-section" aria-labelledby="confirmation-title">
          <Container>
            <div className="order-confirmation">
              <Badge variant="rose">Order received</Badge>
              <h2 id="confirmation-title">Thank you. Your order is in.</h2>
              <p className="text-muted">
                We&apos;ve received your order and will be in touch about delivery.
                A confirmation has been recorded for {placedOrder.email}.
              </p>
              <dl className="order-confirmation-details">
                <div>
                  <dt>Order reference</dt>
                  <dd>#{placedOrder.id.slice(0, 8).toUpperCase()}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{placedOrder.email}</dd>
                </div>
                <div>
                  <dt>Total</dt>
                  <dd>{formatNaira(placedOrder.total)}</dd>
                </div>
              </dl>
              <Button variant="primary" size="lg" onClick={handleBackToShop}>
                Back to the Collection &rarr;
              </Button>
            </div>
          </Container>
        </section>
        )}
      </main>

      {/* 8. Footer */}
      <footer className="storefront-footer" role="contentinfo">
        <Container>
          <div className="footer-main-grid">
            {/* Brand Column */}
            <div className="footer-brand-column">
              <span className="footer-brand-title">Tresses by Shabby</span>
              <p className="footer-brand-desc">
                Wigs for everyday beauty, special occasions, and everything in between.
              </p>
              <span className="footer-location-tag">Lagos, Nigeria</span>
            </div>

            {/* Collection Links */}
            <div className="footer-links-column">
              <span className="footer-column-heading">Collection</span>
              <ul className="footer-link-list">
                <li>
                  <a
                    href="#collection"
                    className="footer-link"
                    onClick={() => setActiveTextureFilter('All')}
                  >
                    Shop All
                  </a>
                </li>
                <li>
                  <a
                    href="#collection"
                    className="footer-link"
                    onClick={() => setActiveTextureFilter('Wavy')}
                  >
                    Wavy
                  </a>
                </li>
                <li>
                  <a
                    href="#collection"
                    className="footer-link"
                    onClick={() => setActiveTextureFilter('Straight')}
                  >
                    Straight
                  </a>
                </li>
                <li>
                  <a
                    href="#collection"
                    className="footer-link"
                    onClick={() => setActiveTextureFilter('Curly')}
                  >
                    Curly
                  </a>
                </li>
                <li>
                  <a
                    href="#collection"
                    className="footer-link"
                    onClick={() => setActiveTextureFilter('Kinky Straight')}
                  >
                    Kinky Straight
                  </a>
                </li>
              </ul>
            </div>

            {/* The House Links */}
            <div className="footer-links-column">
              <span className="footer-column-heading">The House</span>
              <ul className="footer-link-list">
                <li><a href="#atelier" className="footer-link">Our Story</a></li>
                <li><a href="#textures" className="footer-link">Textures &amp; Lengths</a></li>
                <li><a href="#care" className="footer-link">Care &amp; Styling</a></li>
                <li><a href="#contact" className="footer-link">Contact</a></li>
              </ul>
            </div>

            {/* Newsletter Column */}
            <div className="footer-newsletter-column">
              <span className="footer-column-heading">Stay in the know</span>
              <p className="footer-newsletter-desc">
                New drops, styling inspiration and a little Tresses magic in your inbox.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (newsletterEmail) {
                    setNewsletterFeedback(true)
                  }
                }}
                className="footer-newsletter-form"
              >
                <Input
                  type="email"
                  placeholder="your.email@domain.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  aria-label="Email address for Tresses newsletter"
                />
                <Button type="submit" variant="primary" size="sm">
                  Join
                </Button>
              </form>
              {newsletterFeedback && (
                <span className="text-xs" style={{ color: 'var(--color-primary)' }}>
                  You&apos;re on the list. Talk soon.
                </span>
              )}
            </div>
          </div>

          {/* Footer Bottom Bar */}
          <div className="footer-bottom-row">
            <span>
              &copy; {new Date().getFullYear()} Tresses by Shabby. All rights reserved.
            </span>
            <span style={{ color: 'var(--color-burgundy)', fontWeight: 500 }}>
              All pricing in Nigerian Naira (₦)
            </span>
            <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
              <a href="#care" className="footer-link">Privacy Policy</a>
              <a href="#care" className="footer-link">Terms of Service</a>
            </div>
          </div>
        </Container>
      </footer>

      {/* 9. Slide-Over Shopping Bag Drawer */}
      {isBagOpen && (
        <div
          className="bag-drawer-backdrop"
          onClick={() => setIsBagOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="bag-drawer-title"
        >
          <div className="bag-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="bag-drawer-header">
              <h2 id="bag-drawer-title" className="bag-drawer-title">
                Shopping Bag ({totalItemCount})
              </h2>
              <button
                type="button"
                className="bag-close-btn"
                onClick={() => setIsBagOpen(false)}
                aria-label="Close shopping bag"
              >
                &times;
              </button>
            </div>

            <div className="bag-items-list">
              {bagItems.length === 0 ? (
                <div className="bag-empty-state">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#DED6D2"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  <p style={{ fontWeight: 500 }}>Your bag is currently empty.</p>
                  <span className="text-xs">
                    Explore our collection to find your next look.
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsBagOpen(false)}
                    style={{ marginTop: 'var(--space-3)' }}
                  >
                    Browse Wigs &rarr;
                  </Button>
                </div>
              ) : (
                bagItems.map((item) => (
                  <div key={item.id} className="bag-item-row">
                    <div className="bag-item-thumb">
                      <EditorialImage
                        slug={item.product.images.primary}
                        alt={item.product.name}
                        aspectRatio="3:4"
                      />
                    </div>
                    <div className="bag-item-info">
                      <h3 className="bag-item-name">{item.product.name}</h3>
                      <span className="bag-item-variant">
                        Length: {item.variant.length} &bull; {formatNaira(item.variant.price)} each
                      </span>
                      <div className="bag-qty-controls">
                        <button
                          type="button"
                          className="bag-qty-btn"
                          onClick={() => handleDecreaseQuantity(item.id)}
                          aria-label={`Decrease quantity of ${item.product.name}`}
                        >
                          &minus;
                        </button>
                        <span className="bag-qty-value" aria-label={`Quantity: ${item.quantity}`}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="bag-qty-btn"
                          onClick={() => handleIncreaseQuantity(item.id)}
                          aria-label={`Increase quantity of ${item.product.name}`}
                        >
                          +
                        </button>
                      </div>
                      <span className="bag-item-price">
                        {formatNaira(item.variant.price * item.quantity)}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="bag-item-remove-btn"
                      onClick={() => handleRemoveFromBag(item.id)}
                      aria-label={`Remove ${item.product.name} from bag`}
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            {bagItems.length > 0 && (
              <div className="bag-drawer-footer">
                <div className="bag-subtotal-row">
                  <span className="bag-subtotal-label">Subtotal</span>
                  <span className="bag-subtotal-amount">{formatNaira(bagSubtotal)}</span>
                </div>
                <div className="bag-subtotal-row">
                  <span className="bag-subtotal-label">Total</span>
                  <span className="bag-subtotal-amount">{formatNaira(bagSubtotal)}</span>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleProceedToCheckout}
                >
                  Proceed to Checkout &bull; {formatNaira(bagSubtotal)}
                </Button>
                <p className="bag-checkout-notice">
                  Delivery details will be confirmed during checkout. Handcrafted in Lagos, Nigeria.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 10. Product Quick Inspect Modal */}
      {selectedProductForInspect && modalVariant && (
        <div
          className="inspect-modal-backdrop"
          onClick={() => setSelectedProductForInspect(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="inspect-product-title"
        >
          <div className="inspect-modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="inspect-close-btn"
              onClick={() => setSelectedProductForInspect(null)}
              aria-label="Close product inspection"
            >
              &times;
            </button>

            <div className="inspect-modal-media">
              <EditorialImage
                slug={selectedProductForInspect.images.primary}
                alt={selectedProductForInspect.images.alt}
                aspectRatio="3:4"
              />
            </div>

            <div className="inspect-modal-details">
              <div>
                <span className="editorial-eyebrow">
                  {selectedProductForInspect.texture}
                </span>
                <h2 id="inspect-product-title" style={{ marginTop: 'var(--space-1)' }}>
                  {selectedProductForInspect.name}
                </h2>
                <span className="price-tag price-tag--accent price-tag--lg">
                  {formatNaira(modalVariant.price)}
                </span>
              </div>

              <p className="text-body" style={{ color: 'var(--color-text-muted)' }}>
                {selectedProductForInspect.description}
              </p>

              <div className="inspect-specs-list">
                <div className="inspect-spec-row">
                  <span className="inspect-spec-name">Cap &amp; Construction:</span>
                  <span className="inspect-spec-val">{selectedProductForInspect.construction}</span>
                </div>
                <div className="inspect-spec-row">
                  <span className="inspect-spec-name">Texture:</span>
                  <span className="inspect-spec-val">{selectedProductForInspect.texture}</span>
                </div>
                <div className="inspect-spec-row">
                  <span className="inspect-spec-name">Availability:</span>
                  <span className="inspect-spec-val" style={{ color: 'var(--color-burgundy)' }}>
                    {modalVariant.stock} available
                  </span>
                </div>
              </div>

              <div>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--color-text-muted)',
                    marginBottom: 'var(--space-2)',
                  }}
                >
                  Length:
                </span>
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                  {selectedProductForInspect.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      className={`tbs-variant-pill ${modalVariant.id === v.id ? 'is-selected' : ''}`}
                      onClick={() => setModalVariant(v)}
                    >
                      {v.length} ({formatNaira(v.price)})
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => {
                    handleAddToBag(selectedProductForInspect, modalVariant)
                    setSelectedProductForInspect(null)
                    setIsBagOpen(true)
                  }}
                >
                  Add to Bag &bull; {formatNaira(modalVariant.price)}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
