'use client'

import { useMemo } from 'react'
import { Product } from '../types/product'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: Product[]
  selectedCategory: string | null  // null = show all
  loading: boolean
  error: string | null
}

/** Skeleton card shown while data is loading */
function SkeletonCard() {
  return (
    <div
      aria-hidden="true"
      className="h-72 rounded-xl bg-gray-200 animate-pulse"
    />
  )
}

/**
 * ProductGrid
 *
 * Renders a responsive grid of ProductCards.
 * Filters by selectedCategory when non-null.
 * Shows skeletons while loading and friendly messages for empty/error states.
 */
export default function ProductGrid({
  products,
  selectedCategory,
  loading,
  error,
}: ProductGridProps) {
  /**
   * Category filter — useMemo is at the top level (before any early returns)
   * to satisfy the Rules of Hooks. Filtering is case-insensitive.
   */
  const filtered = useMemo(() => {
    if (!selectedCategory) return products
    return products.filter(
      (p) =>
        (p.category ?? '').toLowerCase() === selectedCategory.toLowerCase()
    )
  }, [products, selectedCategory])

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <section aria-label="Loading products" aria-busy="true">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    )
  }

  // ── Fetch error ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div
        role="alert"
        className="flex flex-col items-center gap-2 py-16 text-center text-gray-500
                   bg-gray-50 rounded-xl border border-gray-200"
      >
        <span className="text-4xl">⚠️</span>
        <p className="font-semibold">{error}</p>
        <p className="text-sm">Please try refreshing the page.</p>
      </div>
    )
  }

  // ── No products at all ─────────────────────────────────────────────────────
  if (products.length === 0) {
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-2 py-16 text-center text-gray-500
                   bg-gray-50 rounded-xl border border-gray-200"
      >
        <span className="text-4xl">🛒</span>
        <p className="font-semibold">No products available</p>
      </div>
    )
  }

  // ── Category has no matching products ──────────────────────────────────────
  if (filtered.length === 0) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center gap-2 py-16 text-center text-gray-500
                   bg-gray-50 rounded-xl border border-gray-200"
      >
        <span className="text-4xl">🔍</span>
        <p className="font-semibold">
          No products in &ldquo;{selectedCategory}&rdquo;
        </p>
        <p className="text-sm">Try selecting a different category.</p>
      </div>
    )
  }

  // ── Render grid ────────────────────────────────────────────────────────────
  return (
    <section
      aria-label={
        selectedCategory ? `${selectedCategory} products` : 'All products'
      }
    >
      {/* Result count — updates announced to screen readers */}
      <p
        aria-live="polite"
        className="text-sm text-gray-500 mb-4"
      >
        Showing{' '}
        <strong className="text-gray-800">{filtered.length}</strong>{' '}
        product{filtered.length !== 1 ? 's' : ''}
        {selectedCategory ? ` in "${selectedCategory}"` : ''}
      </p>

      <div
        role="list"
        aria-label="Product list"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
      >
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}