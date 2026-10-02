import { useState } from 'react'
import type { Product, ProductVariant } from '../../types/product.ts'
import { formatNaira } from '../../utils/currency.ts'
import { EditorialImage } from '../EditorialImage/index.ts'
import { Badge } from '../Badge/index.ts'
import { Button } from '../Button/index.ts'
import './ProductCard.css'

export interface ProductCardProps {
  product: Product
  onAddToBag?: (product: Product, variant: ProductVariant) => void
  onSelectProduct?: (product: Product) => void
}

export function ProductCard({
  product,
  onAddToBag,
  onSelectProduct,
}: ProductCardProps) {
  // Default to the first available variant or a mid-length variant
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[1] || product.variants[0]
  )
  const [isAddedFeedback, setIsAddedFeedback] = useState(false)

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant)
  }

  const handleAdd = () => {
    if (onAddToBag) {
      onAddToBag(product, selectedVariant)
    }
    setIsAddedFeedback(true)
    setTimeout(() => {
      setIsAddedFeedback(false)
    }, 1800)
  }

  const handleCardClick = () => {
    if (onSelectProduct) {
      onSelectProduct(product)
    }
  }

  return (
    <article className="tbs-product-card">
      {/* Clickable Media Area */}
      <div
        className="tbs-product-media-container"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${product.name}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleCardClick()
          }
        }}
      >
        {/* Subtle Editorial Badge (Bestseller, Virgin Hair, Atelier Signature) */}
        {product.badge && (
          <div className="tbs-product-badge-anchor">
            <Badge
              variant={
                product.badge === 'Atelier Signature'
                  ? 'burgundy'
                  : product.badge === 'Bestseller'
                  ? 'rose'
                  : 'default'
              }
            >
              {product.badge}
            </Badge>
          </div>
        )}

        <EditorialImage
          slug={product.images.primary}
          alt={product.images.alt}
          aspectRatio="3:4"
          className="tbs-product-image"
        />

        <div className="tbs-product-inspect-hint">
          <span>Inspect Unit</span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="tbs-product-content">
        <div className="tbs-product-meta-row">
          <span className="tbs-product-texture">{product.texture}</span>
        </div>

        <h3 className="tbs-product-name">
          <button
            type="button"
            className="tbs-product-title-btn"
            onClick={handleCardClick}
          >
            {product.name}
          </button>
        </h3>

        <p className="tbs-product-short-desc">{product.subtitle}</p>

        {/* Length Variants Selector */}
        <div className="tbs-product-variants-section">
          <span className="tbs-variants-label" id={`label-length-${product.id}`}>
            Length: <strong style={{ color: 'var(--color-text)' }}>{selectedVariant.length}</strong>
          </span>
          <div
            className="tbs-variants-pill-group"
            role="radiogroup"
            aria-labelledby={`label-length-${product.id}`}
          >
            {product.variants.map((v) => {
              const isSelected = v.id === selectedVariant.id
              return (
                <button
                  key={v.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={`tbs-variant-pill ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => handleVariantChange(v)}
                >
                  {v.length}
                </button>
              )
            })}
          </div>
        </div>

        {/* Pricing and Action Footer */}
        <div className="tbs-product-card-footer">
          <div className="tbs-product-price-block">
            <span className="tbs-price-label">Price</span>
            <span className="tbs-price-value price-tag price-tag--accent">
              {formatNaira(selectedVariant.price)}
            </span>
          </div>

          <Button
            variant={isAddedFeedback ? 'secondary' : 'primary'}
            size="sm"
            onClick={handleAdd}
            className="tbs-add-bag-btn"
            aria-label={`Add ${product.name} in length ${selectedVariant.length} to bag`}
          >
            {isAddedFeedback ? 'Added to Bag ✓' : 'Add to Bag'}
          </Button>
        </div>
      </div>
    </article>
  )
}

