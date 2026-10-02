/**
 * Order creation for guest checkout.
 *
 * Orders and items are created atomically inside the Postgres function
 * `public.create_order` (SECURITY DEFINER, executable by the anonymous
 * role). The function — not the browser — validates variants, checks stock,
 * and computes the total from current Supabase prices. Nothing here trusts
 * localStorage prices, and there is no half-created order because the whole
 * thing runs in one transaction.
 */

import { supabase } from './supabase.ts'

export interface CheckoutCustomer {
  customerName: string
  email: string
  phone: string
  deliveryAddress: string
}

export interface CheckoutBagItem {
  productVariantId: string
  quantity: number
}

export interface CreatedOrder {
  id: string
  email: string
  total: number
}

export class CheckoutError extends Error {}

export async function createOrder(
  customer: CheckoutCustomer,
  items: CheckoutBagItem[]
): Promise<CreatedOrder> {
  if (items.length === 0) {
    throw new CheckoutError('Your bag is empty. Add a piece before checking out.')
  }

  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new CheckoutError('Each item must have a quantity of at least 1.')
    }
  }

  const { data, error } = await supabase.rpc('create_order', {
    p_email: customer.email,
    p_customer_name: customer.customerName,
    p_phone: customer.phone,
    p_delivery_address: customer.deliveryAddress,
    p_items: items.map((item) => ({
      product_variant_id: item.productVariantId,
      quantity: item.quantity,
    })),
  })

  if (error) {
    // Keep the raw error out of the UI, but available for debugging
    console.error('create_order failed:', error)

    if (error.message.includes('empty_bag')) {
      throw new CheckoutError('Your bag is empty. Add a piece before checking out.')
    }
    if (error.message.includes('insufficient_stock')) {
      throw new CheckoutError('Not enough stock for one of the pieces in your bag. Please adjust the quantity.')
    }
    if (error.message.includes('variant_unavailable')) {
      throw new CheckoutError('One of the pieces in your bag is no longer available. Please review your bag.')
    }
    if (error.message.includes('invalid_quantity')) {
      throw new CheckoutError('Each item must have a quantity of at least 1.')
    }
    throw new CheckoutError('We could not place your order. Please try again.')
  }

  const result = data as { id?: string; total?: number } | null
  if (!result?.id || typeof result.total !== 'number') {
    console.error('create_order returned unexpected data:', data)
    throw new CheckoutError('We could not place your order. Please try again.')
  }

  return { id: result.id, email: customer.email, total: result.total }
}
