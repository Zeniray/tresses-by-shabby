/**
 * Tresses by Shabby - Currency Formatting Utilities
 *
 * Tresses by Shabby is a Nigerian luxury wig brand.
 * All prices must be formatted in Nigerian Naira (₦).
 */

/**
 * Formats a numeric amount in Nigerian Naira (₦) with standard thousands separators.
 *
 * Examples:
 *   formatNaira(580000) => "₦580,000"
 *   formatNaira(425000) => "₦425,000"
 *   formatNaira(315000) => "₦315,000"
 */
export function formatNaira(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₦0'
  }

  const rounded = Math.round(amount)
  return `₦${rounded.toLocaleString('en-NG')}`
}

