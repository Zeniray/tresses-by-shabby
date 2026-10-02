/**
 * Tresses by Shabby - Editorial Image Component
 *
 * Designed with deliberate aspect ratios (4:5 portrait hero, 3:4 product cards).
 * Features high-fashion editorial rendering with hair texture nuances and seamless
 * transition to real photography when assets are provided.
 */

import './EditorialImage.css'

export type AspectRatio = '3:4' | '4:5' | '1:1' | '16:9'

export interface EditorialImageProps {
  slug: string
  alt: string
  aspectRatio?: AspectRatio
  className?: string
  priority?: boolean
  imageSrc?: string
}

export function EditorialImage({
  slug,
  alt,
  aspectRatio = '3:4',
  className = '',
  imageSrc,
}: EditorialImageProps) {
  const ratioClass = `aspect-${aspectRatio.replace(':', '-')}`

  // Real photography (e.g. Supabase image_url) renders directly;
  // local editorial slugs keep the illustrated treatment below.
  const resolvedSrc = imageSrc ?? (/^(https?:)?\/\//.test(slug) || slug.startsWith('/') ? slug : undefined)

  if (resolvedSrc) {
    return (
      <div className={`editorial-img-container ${ratioClass} ${className}`}>
        <img src={resolvedSrc} alt={alt} className="editorial-img-element" loading="lazy" />
      </div>
    )
  }

  // Editorial illustration matching each texture category
  return (
    <div className={`editorial-img-container ${ratioClass} ${className}`} role="img" aria-label={alt}>
      <svg
        viewBox="0 0 400 533"
        className="editorial-svg-art"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="warmBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F9F6F1" />
            <stop offset="100%" stopColor="#ECE4DC" />
          </linearGradient>
          <linearGradient id="roseAccent" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#B85C78" />
            <stop offset="100%" stopColor="#542333" />
          </linearGradient>
          <linearGradient id="burgundyShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3E1824" />
            <stop offset="100%" stopColor="#211D1E" />
          </linearGradient>
        </defs>

        {/* Studio Background */}
        <rect width="400" height="533" fill="url(#warmBg)" />

        {/* Editorial Border Framing Lines */}
        <line x1="24" y1="24" x2="376" y2="24" stroke="#DED6D2" strokeWidth="0.8" />
        <line x1="24" y1="509" x2="376" y2="509" stroke="#DED6D2" strokeWidth="0.8" />

        {/* Dynamic Texture Rendering based on product slug */}
        {slug.includes('curly') ? (
          /* Deep Curly Hair Art */
          <g>
            <path
              d="M200 90 C150 90 100 130 90 200 C80 300 60 410 40 500 L360 500 C340 410 320 300 310 200 C300 130 250 90 200 90 Z"
              fill="url(#burgundyShade)"
            />
            <circle cx="140" cy="180" r="18" fill="url(#roseAccent)" opacity="0.8" />
            <circle cx="260" cy="180" r="18" fill="url(#roseAccent)" opacity="0.8" />
            <circle cx="110" cy="260" r="22" fill="#542333" />
            <circle cx="290" cy="260" r="22" fill="#542333" />
            <circle cx="160" cy="330" r="24" fill="url(#roseAccent)" opacity="0.75" />
            <circle cx="240" cy="330" r="24" fill="url(#roseAccent)" opacity="0.75" />
            <circle cx="100" cy="390" r="26" fill="#3E1824" />
            <circle cx="300" cy="390" r="26" fill="#3E1824" />
            <circle cx="180" cy="440" r="28" fill="url(#roseAccent)" opacity="0.6" />
            <circle cx="220" cy="440" r="28" fill="url(#roseAccent)" opacity="0.6" />
          </g>
        ) : slug.includes('straight') ? (
          /* Silky Straight Hair Art */
          <g>
            <path
              d="M200 80 C140 80 110 120 110 180 L100 520 L300 520 L290 180 C290 120 260 80 200 80 Z"
              fill="url(#burgundyShade)"
            />
            <line x1="200" y1="90" x2="200" y2="520" stroke="#756D6F" strokeWidth="1" strokeDasharray="3 4" opacity="0.7" />
            <path d="M150 160 L140 520 L155 520 L165 160 Z" fill="#B85C78" opacity="0.4" />
            <path d="M250 160 L260 520 L245 520 L235 160 Z" fill="#B85C78" opacity="0.4" />
            <path d="M185 110 L180 520 L188 520 L193 110 Z" fill="#FFFDFC" opacity="0.25" />
          </g>
        ) : (
          /* Body Wave / Natural Wave Hair Art */
          <g>
            <path
              d="M200 80 C150 80 120 120 120 180 C120 240 100 300 80 360 C60 420 50 470 40 520 L360 520 C350 470 340 420 320 360 C300 300 280 240 280 180 C280 120 250 80 200 80 Z"
              fill="url(#burgundyShade)"
            />
            <path
              d="M170 140 C140 190 130 260 160 320 C190 380 170 450 140 520 L165 520 C195 450 215 380 185 320 C155 260 165 190 195 140 Z"
              fill="url(#roseAccent)"
              opacity="0.85"
            />
            <path
              d="M230 140 C260 190 270 260 240 320 C210 380 230 450 260 520 L235 520 C205 450 185 380 215 320 C245 260 235 190 205 140 Z"
              fill="url(#roseAccent)"
              opacity="0.85"
            />
          </g>
        )}

        {/* Hairline arc */}
        <path
          d="M165 105 Q200 95 235 105"
          stroke="#B85C78"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="2 2"
          opacity="0.9"
        />

        {/* Monogram Seal */}
        <circle cx="200" cy="55" r="14" fill="#FFFDFC" stroke="#DED6D2" strokeWidth="1" />
        <text
          x="200"
          y="60"
          fontFamily="Cormorant Garamond, serif"
          fontSize="12"
          fontWeight="600"
          textAnchor="middle"
          fill="#542333"
        >
          TBS
        </text>

        {/* Bottom Editorial Caption */}
        <text
          x="200"
          y="495"
          fontFamily="DM Sans, sans-serif"
          fontSize="9"
          letterSpacing="2.5"
          textAnchor="middle"
          fill="#756D6F"
          style={{ textTransform: 'uppercase' }}
        >
          TRESSES BY SHABBY &bull; LAGOS
        </text>
      </svg>
    </div>
  )
}

