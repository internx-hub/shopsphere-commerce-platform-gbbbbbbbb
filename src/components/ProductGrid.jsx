import React, { useMemo } from 'react'
import ProductCard from './ProductCard'

// ---------------------------------------------------------------------------
// SkeletonCard — shown while products are loading
// ---------------------------------------------------------------------------
function SkeletonCard() {
  return (
    <div
      aria-hidden="true"
      style={{
        height: 300,
        borderRadius: 12,
        background: '#e5e7eb',
        animation: 'pulse 1.5s ease-in-out infinite',
      }}
    />
  )
}

// ---------------------------------------------------------------------------
// ProductGrid
// Props:
//   products         {Array}       – full product list from parent
//   selectedCategory {string|null} – active filter (null = all)
//   loading          {boolean}     – show skeletons while fetching
//   error            {string|null} – non-null when fetch failed
// ---------------------------------------------------------------------------
export default function ProductGrid({
  products = [],
  selectedCategory = null,
  loading = false,
  error = null,
}) {
  // ── useMemo at top level — fixes the conditional hook bug ────────────────
  const filtered = useMemo(() => {
    if (!Array.isArray(products)) return []
    if (!selectedCategory) return products
    return products.filter(
      (p) => (p.category || '').toLowerCase() === selectedCategory.toLowerCase()
    )
  }, [products, selectedCategory])

  // ── Guard: invalid prop ──────────────────────────────────────────────────
  if (!Array.isArray(products)) {
    return <p role="alert">Invalid product data.</p>
  }

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <section aria-label="Loading products" aria-busy="true">
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
        <div style={gridStyle}>
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    )
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <div role="alert" style={msgStyle}>
        <p style={{ fontSize: '2rem' }}>⚠️</p>
        <p><strong>{error}</strong></p>
        <p>Please try refreshing the page.</p>
      </div>
    )
  }

  // ── Empty catalogue ──────────────────────────────────────────────────────
  if (products.length === 0) {
    return (
      <div role="status" style={msgStyle}>
        <p style={{ fontSize: '2rem' }}>🛒</p>
        <p><strong>No products available</strong></p>
      </div>
    )
  }

  // ── No results for this category ─────────────────────────────────────────
  if (filtered.length === 0) {
    return (
      <div role="status" aria-live="polite" style={msgStyle}>
        <p style={{ fontSize: '2rem' }}>🔍</p>
        <p><strong>No products in &ldquo;{selectedCategory}&rdquo;</strong></p>
        <p>Try a different category.</p>
      </div>
    )
  }

  // ── Happy path ───────────────────────────────────────────────────────────
  return (
    <section aria-label={selectedCategory ? `${selectedCategory} products` : 'All products'}>
      <p
        aria-live="polite"
        style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}
      >
        Showing <strong>{filtered.length}</strong>{' '}
        product{filtered.length !== 1 ? 's' : ''}
        {selectedCategory ? ` in "${selectedCategory}"` : ''}
      </p>

      <div style={gridStyle} role="list" aria-label="Product list">
        {filtered.map((product) => (
          <ProductCard key={product.id ?? product.name} product={product} />
        ))}
      </div>
    </section>
  )
}

// ── Styles ───────────────────────────────────────────────────────────────────
const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: '1.25rem',
}

const msgStyle = {
  padding: '3rem',
  textAlign: 'center',
  color: '#6b7280',
  background: '#f9fafb',
  borderRadius: 12,
  border: '1px solid #e5e7eb',
}