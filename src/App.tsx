import { useState } from 'react'
import {
  Header,
  Container,
  Button,
  Input,
  Select,
  Badge,
} from './components/index.ts'
import './App.css'

export default function App() {
  const [selectedLength, setSelectedLength] = useState<string>('18"')
  const [testInput, setTestInput] = useState('')
  const [selectedTexture, setSelectedTexture] = useState('body-wave')
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false)

  // Color tokens metadata for showcase
  const colorSwatches = [
    {
      name: 'Warm Ivory Background',
      hex: '#F8F5F0',
      bg: '#F8F5F0',
      textColor: '#211D1E',
      role: 'Global canvas background. Soft, editorial, warm paper feel.',
    },
    {
      name: 'Primary Dusty Rose Pink',
      hex: '#B85C78',
      bg: '#B85C78',
      textColor: '#FFFDFC',
      role: 'Brand personality. Sophisticated, mature, and bold pink.',
    },
    {
      name: 'Deep Burgundy',
      hex: '#542333',
      bg: '#542333',
      textColor: '#FFFDFC',
      role: 'High-contrast accents, primary buttons, and anchor elements.',
    },
    {
      name: 'Soft Black Text',
      hex: '#211D1E',
      bg: '#211D1E',
      textColor: '#FFFDFC',
      role: 'Primary reading text. Ultra-high accessible contrast.',
    },
    {
      name: 'Warm Grey Muted Text',
      hex: '#756D6F',
      bg: '#756D6F',
      textColor: '#FFFDFC',
      role: 'Secondary metadata, helper copy, and subtle labels.',
    },
    {
      name: 'Soft White Surface',
      hex: '#FFFDFC',
      bg: '#FFFDFC',
      textColor: '#211D1E',
      role: 'Clean surfaces, input backgrounds, and crisp highlights.',
    },
    {
      name: 'Warm Taupe Border',
      hex: '#DED6D2',
      bg: '#DED6D2',
      textColor: '#211D1E',
      role: 'Restrained, understated dividing lines and boundaries.',
    },
  ]

  const textureOptions = [
    { value: 'body-wave', label: 'Raw Burmese Body Wave' },
    { value: 'silky-straight', label: 'Cambodian Silky Straight' },
    { value: 'deep-curly', label: 'South Indian Deep Curly' },
    { value: 'kinky-straight', label: 'Blowout Kinky Straight' },
  ]

  return (
    <div className="site-wrapper">
      {/* 1. Masthead / Navigation Header */}
      <Header />

      <main id="main-content">
        {/* 2. Editorial Hero & Brand Mood (Asymmetry & Editorial Whitespace) */}
        <section className="editorial-section editorial-section--subtle" aria-labelledby="hero-heading">
          <Container>
            <div className="editorial-hero-grid">
              <div className="hero-statement-content">
                <div className="hero-statement-eyebrow">
                  <Badge variant="rose">Atelier Collection</Badge>
                  <span className="editorial-eyebrow editorial-eyebrow--muted">Edition No. 01</span>
                </div>

                <h1 id="hero-heading" className="editorial-display hero-statement-title">
                  Soft power meets <em>fashion editorial.</em>
                </h1>

                <p className="hero-statement-text">
                  Tresses by Shabby crafts bespoke, fashion-forward wigs designed for everyday wear
                  and unforgettable special occasions. Engineered with uncompromising hair quality,
                  refined lace construction, and a silhouette meant to evoke one immediate reaction:
                  <strong style={{ color: 'var(--color-text)', display: 'block', marginTop: 'var(--space-2)' }}>
                    &ldquo;I need to look at that again.&rdquo;
                  </strong>
                </p>

                <div className="hero-statement-actions">
                  <Button variant="primary" size="lg">
                    Discover Collection
                  </Button>
                  <Button variant="secondary" size="lg">
                    Explore Textures
                  </Button>
                  <Button variant="editorial" size="md">
                    Read The Philosophy &rarr;
                  </Button>
                </div>
              </div>

              {/* Product-First Visual Dominance Frame (Sharp geometry, no bubbly corners) */}
              <div className="hero-visual-frame" aria-label="Featured Wig Preview">
                <div className="hero-visual-art">
                  <svg
                    viewBox="0 0 400 500"
                    width="100%"
                    height="100%"
                    style={{ background: 'linear-gradient(180deg, #F3ECE6 0%, #EFE8E1 100%)' }}
                    role="img"
                    aria-label="Editorial wig illustration showcasing raw wave texture and lace perfection"
                  >
                    {/* Background subtle editorial lines */}
                    <line x1="20" y1="20" x2="380" y2="20" stroke="#DED6D2" strokeWidth="0.8" />
                    <line x1="20" y1="480" x2="380" y2="480" stroke="#DED6D2" strokeWidth="0.8" />
                    
                    {/* Silhouette of editorial model wearing luxury wig */}
                    <path
                      d="M200 110 C160 110 130 145 130 200 C130 290 110 380 90 480 L310 480 C290 380 270 290 270 200 C270 145 240 110 200 110 Z"
                      fill="#542333"
                      opacity="0.9"
                    />
                    {/* Flowing hair highlights in primary rose */}
                    <path
                      d="M175 140 C145 190 140 260 120 380 C150 330 160 250 180 180 Z"
                      fill="#B85C78"
                      opacity="0.65"
                    />
                    <path
                      d="M225 140 C255 190 260 260 280 380 C250 330 240 250 220 180 Z"
                      fill="#B85C78"
                      opacity="0.65"
                    />
                    {/* Editorial monogram watermark */}
                    <circle cx="200" cy="80" r="16" fill="#FFFDFC" stroke="#DED6D2" strokeWidth="1" />
                    <text
                      x="200"
                      y="85"
                      fontFamily="Cormorant Garamond, serif"
                      fontSize="14"
                      textAnchor="middle"
                      fill="#542333"
                    >
                      S
                    </text>
                  </svg>
                </div>
                <div className="hero-visual-caption">
                  <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>
                    Signature 24&quot; Burmese Body Wave
                  </span>
                  <span>From $380.00</span>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 3. The Color System Foundation */}
        <section className="editorial-section" id="palette" aria-labelledby="palette-heading">
          <Container>
            <div className="editorial-section-header">
              <span className="editorial-eyebrow">Design System Foundation</span>
              <h2 id="palette-heading">Curated Color System</h2>
              <p className="text-muted">
                Soft power meets fashion editorial. Built strictly around warm ivory, primary dusty
                rose, deep burgundy, soft black, and warm taupe dividers.
              </p>
            </div>

            <div className="swatches-grid">
              {colorSwatches.map((swatch) => (
                <div key={swatch.hex} className="swatch-item">
                  <div
                    className="swatch-color-box"
                    style={{
                      backgroundColor: swatch.bg,
                      borderBottom: '1px solid var(--color-border-subtle)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        color: swatch.textColor,
                        opacity: 0.85,
                        textTransform: 'uppercase',
                      }}
                    >
                      {swatch.hex}
                    </span>
                  </div>
                  <div className="swatch-info">
                    <span className="swatch-name">{swatch.name}</span>
                    <span className="swatch-hex">{swatch.hex}</span>
                    <p className="swatch-role">{swatch.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* 4. Typography Hierarchy & Pairings */}
        <section className="editorial-section editorial-section--subtle" id="typography" aria-labelledby="typography-heading">
          <Container>
            <div className="editorial-section-header">
              <span className="editorial-eyebrow">Editorial Voice</span>
              <h2 id="typography-heading">Typography Hierarchy</h2>
              <p className="text-muted">
                Harmonizing expressive serif display moments (Cormorant Garamond) with clear,
                accessible functional geometry (DM Sans) for shopping ease.
              </p>
            </div>

            <div className="typography-specimens">
              <div className="specimen-row">
                <div className="specimen-meta">
                  <span className="specimen-tag">Display Headline</span>
                  <span className="specimen-details">Cormorant Garamond 56px+</span>
                </div>
                <div>
                  <div className="editorial-display">
                    The Art of <em>Undetectable</em> Hair.
                  </div>
                </div>
              </div>

              <div className="specimen-row">
                <div className="specimen-meta">
                  <span className="specimen-tag">Heading 1</span>
                  <span className="specimen-details">Cormorant Garamond 44px</span>
                </div>
                <div>
                  <h1>Handcrafted HD Lace Frontals</h1>
                </div>
              </div>

              <div className="specimen-row">
                <div className="specimen-meta">
                  <span className="specimen-tag">Heading 2</span>
                  <span className="specimen-details">Cormorant Garamond 32px</span>
                </div>
                <div>
                  <h2>Unprocessed Single Donor Virgin Hair</h2>
                </div>
              </div>

              <div className="specimen-row">
                <div className="specimen-meta">
                  <span className="specimen-tag">Heading 3</span>
                  <span className="specimen-details">Cormorant Garamond 24px</span>
                </div>
                <div>
                  <h3>Natural Movement & Effortless Styling</h3>
                </div>
              </div>

              <div className="specimen-row">
                <div className="specimen-meta">
                  <span className="specimen-tag">Functional H4 & Price</span>
                  <span className="specimen-details">DM Sans Semi-bold 18px</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-4)' }}>
                  <h4>Raw Cambodian Wavy Unit</h4>
                  <span className="price-tag price-tag--accent price-tag--lg">$420.00</span>
                </div>
              </div>

              <div className="specimen-row">
                <div className="specimen-meta">
                  <span className="specimen-tag">Editorial Quote</span>
                  <span className="specimen-details">Cormorant Garamond Italic</span>
                </div>
                <div>
                  <blockquote className="editorial-quote">
                    &ldquo;A woman&apos;s crown should never look borrowed. It should look like an
                    intimate extension of her grace and command.&rdquo;
                  </blockquote>
                </div>
              </div>

              <div className="specimen-row">
                <div className="specimen-meta">
                  <span className="specimen-tag">Body & Microcopy</span>
                  <span className="specimen-details">DM Sans Regular 16px / 14px</span>
                </div>
                <div>
                  <p className="text-body" style={{ maxWidth: '64ch', marginBottom: 'var(--space-2)' }}>
                    Every wig in the Tresses by Shabby atelier is custom-knotted onto ultra-fine Swiss
                    HD lace, ensuring seamless blending across all skin tones without bulky seams or
                    unnatural density.
                  </p>
                  <p className="text-sm text-muted">
                    Available in lengths 14&quot; through 30&quot;. Standard cap sizes S, M, and L.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 5. Button & Action Foundations */}
        <section className="editorial-section" id="buttons" aria-labelledby="buttons-heading">
          <Container>
            <div className="editorial-section-header">
              <span className="editorial-eyebrow">Interactive Foundations</span>
              <h2 id="buttons-heading">Buttons & Link System</h2>
              <p className="text-muted">
                Restrained geometry with 2px corner radius (strictly avoiding bubble buttons),
                compliant touch targets (min 44px for standard buttons), and high-contrast states.
              </p>
            </div>

            <div className="components-showcase-grid">
              {/* Button Variants */}
              <div className="component-demo-block">
                <span className="component-demo-block-title">Variants Hierarchy</span>
                <div className="buttons-group">
                  <Button variant="primary">Deep Burgundy Primary</Button>
                  <Button variant="secondary">Dusty Rose Secondary</Button>
                  <Button variant="outline">Outline Default</Button>
                  <Button variant="ghost">Ghost Action</Button>
                  <Button variant="editorial">Editorial Link &rarr;</Button>
                </div>
              </div>

              {/* Button Sizes */}
              <div className="component-demo-block">
                <span className="component-demo-block-title">Scale & Touch Targets</span>
                <div className="buttons-group" style={{ alignItems: 'center' }}>
                  <Button variant="primary" size="sm">
                    Small (36px)
                  </Button>
                  <Button variant="primary" size="md">
                    Medium 44px (Standard)
                  </Button>
                  <Button variant="primary" size="lg">
                    Large 52px (Prominent)
                  </Button>
                </div>
              </div>

              {/* Interactive States */}
              <div className="component-demo-block">
                <span className="component-demo-block-title">States & Accessibility</span>
                <div className="buttons-group">
                  <Button variant="primary" isLoading>
                    Loading Action
                  </Button>
                  <Button variant="primary" disabled>
                    Disabled State
                  </Button>
                  <Button variant="outline" disabled>
                    Disabled Outline
                  </Button>
                  <Button
                    variant="outline"
                    as="a"
                    href="#palette"
                    rightIcon={<span aria-hidden="true">&uarr;</span>}
                  >
                    Polymorphic Anchor
                  </Button>
                </div>
              </div>

              {/* Badges / Editorial Tags */}
              <div className="component-demo-block">
                <span className="component-demo-block-title">Editorial Badges</span>
                <div className="buttons-group">
                  <Badge variant="rose">100% Virgin Hair</Badge>
                  <Badge variant="burgundy">Limited Edition</Badge>
                  <Badge variant="default">HD Swiss Lace</Badge>
                  <Badge variant="outline">Pre-Plucked Hairline</Badge>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 6. Form Controls Foundation */}
        <section className="editorial-section editorial-section--subtle" id="forms" aria-labelledby="forms-heading">
          <Container narrow>
            <div className="editorial-section-header">
              <span className="editorial-eyebrow">Input System</span>
              <h2 id="forms-heading">Accessible Form Controls</h2>
              <p className="text-muted">
                Crafted for low-friction shopping: crisp borders, clear focus rings, and proper
                ARIA associations for errors and instructions.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                setNewsletterSubscribed(true)
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}
            >
              <Input
                label="Full Name"
                placeholder="e.g. Amara Sterling"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                helperText="As it should appear on your order confirmation"
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="amara@example.com"
                helperText="We will send your bespoke order summary and receipt here"
                required
              />

              <Select
                label="Desired Hair Texture"
                options={textureOptions}
                value={selectedTexture}
                onChange={(e) => setSelectedTexture(e.target.value)}
                helperText="Each texture is ethically sourced from single-donor bundles"
              />

              {/* Demonstration of Form Validation / Error State */}
              <Input
                label="Validation Error State Example"
                defaultValue="invalid-postal-code"
                errorMessage="Please enter a valid postal code for delivery calculation"
                required
              />

              {/* Styled Accessible Checkbox */}
              <label className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  defaultChecked
                />
                <span className="form-check-label">
                  Receive private atelier drops and bespoke care guides (No spam, ever).
                </span>
              </label>

              <div style={{ marginTop: 'var(--space-4)' }}>
                <Button type="submit" variant="primary" size="md">
                  {newsletterSubscribed ? 'Subscribed to Atelier Notes ✓' : 'Save Consultation Preferences'}
                </Button>
              </div>
            </form>
          </Container>
        </section>

        {/* 7. Product Composition Foundation (No Bubble Card Soup) */}
        <section className="editorial-section" id="product-foundation" aria-labelledby="product-heading">
          <Container>
            <div className="editorial-section-header">
              <span className="editorial-eyebrow">Composition Rule</span>
              <h2 id="product-heading">Product-First Editorial Composition</h2>
              <p className="text-muted">
                Verifying Design Principle 1 &amp; 3: No large bubble card containers. The product
                imagery remains visually dominant with crisp boundaries and direct variant interaction.
              </p>
            </div>

            <div className="editorial-product-strip">
              {/* Product Specimen 1 */}
              <article className="editorial-product-card">
                <div className="product-media-wrapper">
                  <div className="product-badges-overlay">
                    <Badge variant="burgundy">Bestseller</Badge>
                  </div>
                  {/* Visual Hair Artwork */}
                  <svg
                    viewBox="0 0 300 400"
                    width="100%"
                    height="100%"
                    style={{ background: '#F5EFEA' }}
                    role="img"
                    aria-label="Raw Burmese Body Wave Wig close-up"
                  >
                    <path
                      d="M150 70 C110 70 80 110 80 160 C80 260 60 350 40 400 L260 400 C240 350 220 260 220 160 C220 110 190 70 150 70 Z"
                      fill="#542333"
                    />
                    <path
                      d="M130 110 C100 170 100 250 80 380 C110 330 120 230 140 150 Z"
                      fill="#B85C78"
                      opacity="0.8"
                    />
                  </svg>
                </div>

                <div className="product-info-block">
                  <span className="product-category">Glueless HD Frontal</span>
                  <h3 className="product-title">Raw Burmese Body Wave</h3>
                  
                  {/* Selectable Lengths */}
                  <div className="product-variants-row" role="group" aria-label="Available lengths">
                    {['16"', '18"', '20"', '22"', '24"'].map((length) => (
                      <button
                        key={length}
                        type="button"
                        className={`variant-pill ${selectedLength === length ? 'is-selected' : ''}`}
                        onClick={() => setSelectedLength(length)}
                        aria-pressed={selectedLength === length}
                      >
                        {length}
                      </button>
                    ))}
                  </div>

                  <div className="product-footer-row">
                    <span className="price-tag price-tag--accent">$395.00</span>
                    <Button variant="outline" size="sm">
                      Add to Bag
                    </Button>
                  </div>
                </div>
              </article>

              {/* Product Specimen 2 */}
              <article className="editorial-product-card">
                <div className="product-media-wrapper">
                  <div className="product-badges-overlay">
                    <Badge variant="rose">Virgin Hair</Badge>
                  </div>
                  <svg
                    viewBox="0 0 300 400"
                    width="100%"
                    height="100%"
                    style={{ background: '#ECE6E0' }}
                    role="img"
                    aria-label="Cambodian Silky Straight Wig"
                  >
                    <path
                      d="M150 70 C120 70 95 100 95 150 L95 400 L205 400 L205 150 C205 100 180 70 150 70 Z"
                      fill="#211D1E"
                    />
                    <line x1="150" y1="90" x2="150" y2="400" stroke="#756D6F" strokeWidth="1" strokeDasharray="3 3" />
                  </svg>
                </div>

                <div className="product-info-block">
                  <span className="product-category">13x6 Full Lace</span>
                  <h3 className="product-title">Cambodian Silky Straight</h3>
                  
                  <div className="product-variants-row" role="group" aria-label="Available lengths">
                    {['18"', '20"', '22"', '26"'].map((length) => (
                      <button
                        key={length}
                        type="button"
                        className={`variant-pill ${length === '22"' ? 'is-selected' : ''}`}
                      >
                        {length}
                      </button>
                    ))}
                  </div>

                  <div className="product-footer-row">
                    <span className="price-tag price-tag--accent">$440.00</span>
                    <Button variant="outline" size="sm">
                      Add to Bag
                    </Button>
                  </div>
                </div>
              </article>

              {/* Product Specimen 3 */}
              <article className="editorial-product-card">
                <div className="product-media-wrapper">
                  <div className="product-badges-overlay">
                    <Badge variant="default">Custom Order</Badge>
                  </div>
                  <svg
                    viewBox="0 0 300 400"
                    width="100%"
                    height="100%"
                    style={{ background: '#F1EBE4' }}
                    role="img"
                    aria-label="South Indian Deep Curly Wig"
                  >
                    <path
                      d="M150 65 C100 65 70 100 70 160 C70 280 50 360 30 400 L270 400 C250 360 230 280 230 160 C230 100 200 65 150 65 Z"
                      fill="#542333"
                    />
                    <circle cx="110" cy="200" r="14" fill="#B85C78" opacity="0.6" />
                    <circle cx="190" cy="220" r="16" fill="#B85C78" opacity="0.6" />
                    <circle cx="130" cy="300" r="18" fill="#B85C78" opacity="0.6" />
                  </svg>
                </div>

                <div className="product-info-block">
                  <span className="product-category">HD Closure Unit</span>
                  <h3 className="product-title">South Indian Deep Curly</h3>
                  
                  <div className="product-variants-row" role="group" aria-label="Available lengths">
                    {['14"', '16"', '18"', '20"'].map((length) => (
                      <button
                        key={length}
                        type="button"
                        className={`variant-pill ${length === '16"' ? 'is-selected' : ''}`}
                      >
                        {length}
                      </button>
                    ))}
                  </div>

                  <div className="product-footer-row">
                    <span className="price-tag price-tag--accent">$365.00</span>
                    <Button variant="outline" size="sm">
                      Add to Bag
                    </Button>
                  </div>
                </div>
              </article>
            </div>
          </Container>
        </section>
      </main>

      {/* 8. Editorial Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          paddingBlock: 'var(--space-12)',
        }}
      >
        <Container>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: 'var(--space-6)',
            }}
          >
            <div>
              <span className="brand-title" style={{ display: 'block', fontSize: '1.5rem' }}>
                Tresses by Shabby
              </span>
              <span className="brand-subtitle">Editorial Wig Atelier &bull; Design Foundation</span>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
              <a href="#palette" className="link-editorial">Color System</a>
              <a href="#typography" className="link-editorial">Typography</a>
              <a href="#buttons" className="link-editorial">Buttons</a>
              <a href="#forms" className="link-editorial">Form Controls</a>
            </div>

            <p className="text-xs text-muted">
              Built with React 19 + TypeScript + Vite &bull; Accessible &bull; Touch Optimized
            </p>
          </div>
        </Container>
      </footer>
    </div>
  )
}

