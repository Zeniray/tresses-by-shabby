import type { Product, TextureDetail } from '../types/product.ts'

export const PRODUCTS: Product[] = [
  {
    id: 'prod-raw-burmese-body-wave',
    name: 'Classic Body Wave',
    subtitle: 'Soft S-Wave · 13×6 Frontal · Glueless',
    description:
      'Soft S-wave pattern with natural movement and a light finish, designed for easy daily wear and versatile styling.',
    texture: 'Wavy',
    construction: '13×6 Frontal · Glueless',
    badge: 'Popular',
    images: {
      primary: '/products/classic-body-wave.jfif',
      detail: '/products/classic-body-wave.jfif',
      alt: 'Classic Body Wave wig with soft S-wave texture',
    },
    variants: [
      { id: 'var-bw-16', product_id: 'prod-raw-burmese-body-wave', length: '16"', price: 385000, stock: 4 },
      { id: 'var-bw-18', product_id: 'prod-raw-burmese-body-wave', length: '18"', price: 425000, stock: 6 },
      { id: 'var-bw-20', product_id: 'prod-raw-burmese-body-wave', length: '20"', price: 480000, stock: 5 },
      { id: 'var-bw-22', product_id: 'prod-raw-burmese-body-wave', length: '22"', price: 540000, stock: 3 },
      { id: 'var-bw-24', product_id: 'prod-raw-burmese-body-wave', length: '24"', price: 610000, stock: 2 },
    ],
    created_at: '2026-09-15T10:00:00Z',
  },
  {
    id: 'prod-cambodian-silky-straight',
    name: 'Silky Straight',
    subtitle: '13×6 Lace · Pre-Plucked',
    description:
      'Sleek, fluid straight texture that stays smooth and polished, whether worn bone-straight or gently curled.',
    texture: 'Straight',
    construction: '13×6 Lace · Pre-Plucked',
    badge: 'Bestseller',
    images: {
      primary: '/products/silky-straight.jfif',
      detail: '/products/silky-straight.jfif',
      alt: 'Silky Straight wig with sleek smooth finish',
    },
    variants: [
      { id: 'var-cs-18', product_id: 'prod-cambodian-silky-straight', length: '18"', price: 410000, stock: 5 },
      { id: 'var-cs-20', product_id: 'prod-cambodian-silky-straight', length: '20"', price: 470000, stock: 8 },
      { id: 'var-cs-22', product_id: 'prod-cambodian-silky-straight', length: '22"', price: 535000, stock: 4 },
      { id: 'var-cs-26', product_id: 'prod-cambodian-silky-straight', length: '26"', price: 620000, stock: 2 },
    ],
    created_at: '2026-09-18T10:00:00Z',
  },
  {
    id: 'prod-south-indian-deep-curly',
    name: 'Deep Curly',
    subtitle: '5×5 Lace · Breathable Cap',
    description:
      'Defined, bouncy curls with natural volume and shape, designed for an expressive and confident look.',
    texture: 'Curly',
    construction: '5×5 Lace · Breathable Cap',
    images: {
      primary: '/products/deep-curly.jfif',
      detail: '/products/deep-curly.jfif',
      alt: 'Deep Curly wig with defined bouncy curls',
    },
    variants: [
      { id: 'var-ic-16', product_id: 'prod-south-indian-deep-curly', length: '16"', price: 395000, stock: 3 },
      { id: 'var-ic-18', product_id: 'prod-south-indian-deep-curly', length: '18"', price: 445000, stock: 5 },
      { id: 'var-ic-20', product_id: 'prod-south-indian-deep-curly', length: '20"', price: 495000, stock: 4 },
      { id: 'var-ic-22', product_id: 'prod-south-indian-deep-curly', length: '22"', price: 560000, stock: 2 },
    ],
    created_at: '2026-09-20T10:00:00Z',
  },
  {
    id: 'prod-hd-lace-body-wave',
    name: 'HD Body Wave',
    subtitle: '13×4 Frontal · Bleached Knots',
    description:
      'Classic, soft body wave with a lightweight cap, designed for effortless everyday wear and quick styling.',
    texture: 'Wavy',
    construction: '13×4 Frontal · Bleached Knots',
    badge: 'Classic',
    images: {
      primary: '/products/hd-lace-body-wave.jfif',
      detail: '/products/hd-lace-body-wave.jfif',
      alt: 'HD Body Wave wig with soft natural waves',
    },
    variants: [
      { id: 'var-hd-14', product_id: 'prod-hd-lace-body-wave', length: '14"', price: 340000, stock: 7 },
      { id: 'var-hd-16', product_id: 'prod-hd-lace-body-wave', length: '16"', price: 380000, stock: 9 },
      { id: 'var-hd-18', product_id: 'prod-hd-lace-body-wave', length: '18"', price: 430000, stock: 6 },
      { id: 'var-hd-20', product_id: 'prod-hd-lace-body-wave', length: '20"', price: 485000, stock: 4 },
      { id: 'var-hd-24', product_id: 'prod-hd-lace-body-wave', length: '24"', price: 590000, stock: 3 },
    ],
    created_at: '2026-09-22T10:00:00Z',
  },
  {
    id: 'prod-raw-indonesian-kinky-straight',
    name: 'Kinky Straight',
    subtitle: '13×6 Frontal · Reinforced Band',
    description:
      'Full, textured blowout feel that mirrors naturally pressed hair, offering gentle hold and full-bodied volume.',
    texture: 'Kinky Straight',
    construction: '13×6 Frontal · Reinforced Band',
    images: {
      primary: '/products/kinky-straight.jfif',
      detail: '/products/kinky-straight.jfif',
      alt: 'Kinky Straight wig with natural blowout texture',
    },
    variants: [
      { id: 'var-ik-18', product_id: 'prod-raw-indonesian-kinky-straight', length: '18"', price: 435000, stock: 4 },
      { id: 'var-ik-20', product_id: 'prod-raw-indonesian-kinky-straight', length: '20"', price: 495000, stock: 5 },
      { id: 'var-ik-22', product_id: 'prod-raw-indonesian-kinky-straight', length: '22"', price: 565000, stock: 3 },
      { id: 'var-ik-26', product_id: 'prod-raw-indonesian-kinky-straight', length: '26"', price: 645000, stock: 2 },
    ],
    created_at: '2026-09-25T10:00:00Z',
  },
  {
    id: 'prod-natural-wave-bleached-knots',
    name: 'Natural Wave',
    subtitle: 'Full Lace · Custom Sized Cap',
    description:
      'Refined loose wave style with soft body and custom cap sizing, created for dressed-up moments and special occasions.',
    texture: 'Wavy',
    construction: 'Full Lace · Custom Sized Cap',
    images: {
      primary: '/products/gala-natural-wave.jfif',
      detail: '/products/gala-natural-wave.jfif',
      alt: 'Natural Wave wig with soft open waves',
    },
    variants: [
      { id: 'var-gn-20', product_id: 'prod-natural-wave-bleached-knots', length: '20"', price: 520000, stock: 3 },
      { id: 'var-gn-22', product_id: 'prod-natural-wave-bleached-knots', length: '22"', price: 590000, stock: 2 },
      { id: 'var-gn-24', product_id: 'prod-natural-wave-bleached-knots', length: '24"', price: 660000, stock: 3 },
      { id: 'var-gn-28', product_id: 'prod-natural-wave-bleached-knots', length: '28"', price: 780000, stock: 1 },
    ],
    created_at: '2026-09-28T10:00:00Z',
  },
]

export const TEXTURE_GUIDES: TextureDetail[] = [
  {
    id: 'guide-wavy',
    name: 'Wavy',
    description:
      'Soft movement with an effortless finish. Easy for everyday looks and dressed-up moments.',
  },
  {
    id: 'guide-silky-straight',
    name: 'Silky Straight',
    description:
      'Sleek, smooth and clean. For when you want your hair to make a statement without saying too much.',
  },
  {
    id: 'guide-deep-curly',
    name: 'Deep Curly',
    description:
      "Defined curls with plenty of personality. For days when subtle isn't really the plan.",
  },
  {
    id: 'guide-kinky-straight',
    name: 'Kinky Straight',
    description:
      'Full, textured and beautifully familiar. A polished take on a naturally textured look.',
  },
]
