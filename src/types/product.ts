/**
 * Tresses by Shabby - Product & Catalog Types
 * Structured to cleanly map to Supabase PostgreSQL schema.
 */

export interface ProductVariant {
  id: string
  product_id: string
  length: string // e.g. '14"', '16"', '18"', '20"', '22"', '24"'
  price: number // Numeric value in Nigerian Naira (₦)
  stock: number
}

export interface Product {
  id: string
  name: string
  subtitle: string
  description: string
  texture: string
  construction: string
  badge?: string
  images: {
    primary: string
    detail?: string
    alt: string
  }
  variants: ProductVariant[]
  created_at: string
}

export type WigTextureCategory = 'Wavy' | 'Silky Straight' | 'Deep Curly' | 'Kinky Straight'

export interface TextureDetail {
  id: string
  name: WigTextureCategory
  description: string
}
