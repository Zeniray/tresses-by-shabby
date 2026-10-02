/**
 * useProducts — fetches the Tresses by Shabby product catalogue from Supabase.
 *
 * Queries `public.products` with their related `public.product_variants` in a
 * single request using PostgREST foreign-key expansion, then maps the result
 * into the existing frontend `Product` shape so all downstream components
 * (ProductCard, bag, inspect modal) continue to work without modification.
 *
 * Only `products` and `product_variants` are queried. Orders and order items
 * are never touched here.
 */

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.ts'
import type { Product, ProductVariant } from '../types/product.ts'

// ---------------------------------------------------------------------------
// Raw shapes returned by the Supabase Data API
// ---------------------------------------------------------------------------

interface RawVariant {
  id: string
  product_id: string
  length: string
  price: number | string
  stock: number | string
}

interface RawProduct {
  id: string
  name: string
  description: string | null
  category: string | null
  image_url: string | null
  created_at: string
  product_variants: RawVariant[] | null
}

// ---------------------------------------------------------------------------
// Mapper: DB row → frontend Product shape
// ---------------------------------------------------------------------------

function mapProduct(raw: RawProduct): Product {
  const variants: ProductVariant[] = (raw.product_variants ?? []).map((v) => ({
    id: v.id,
    product_id: v.product_id,
    length: v.length,
    price: Number(v.price),
    stock: Number(v.stock),
  }))

  // Sort variants ascending by length number so pills render in order
  variants.sort((a, b) => {
    const numA = parseFloat(a.length)
    const numB = parseFloat(b.length)
    return numA - numB
  })

  return {
    id: raw.id,
    name: raw.name,
    subtitle: '',
    description: raw.description ?? '',
    texture: raw.category ?? '',
    construction: '',
    images: {
      primary: raw.image_url ?? '',
      alt: raw.name,
    },
    variants,
    created_at: raw.created_at,
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export interface UseProductsResult {
  products: Product[]
  loading: boolean
  error: string | null
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchProducts() {
      setLoading(true)
      setError(null)

      const { data, error: sbError } = await supabase
        .from('products')
        .select('*, product_variants(*)')
        .order('created_at', { ascending: true })

      if (cancelled) return

      if (sbError) {
        setError("We couldn't load the catalogue right now. Please refresh to try again.")
        setLoading(false)
        return
      }

      const mapped = ((data as RawProduct[]) ?? [])
        .map(mapProduct)
        // Products without at least one variant can't be selected in the UI
        .filter((p) => p.variants.length > 0)
      setProducts(mapped)
      setLoading(false)
    }

    fetchProducts()

    return () => {
      cancelled = true
    }
  }, [])

  return { products, loading, error }
}
