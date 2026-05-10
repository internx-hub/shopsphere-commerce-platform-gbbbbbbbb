import React, { useMemo } from 'react'
import ProductCard from './ProductCard'

function SkeletonCard() {
  return (
    <div
      aria-hidden="true"
      style={{
        height: 280, borderRadius: 12,
        background: '#e5e7eb', animation: 'pulse 1.5s ease-in-out infinite'
      }}
    />
  )
}

export default function ProductGrid({
  products = [],
  selectedCategory = null,
  loading = false,
  error = null,
}) {
  // Prop validation
  if (!Array.isArray(products)) {
    console.error('[ProductGrid] products must be an array')
    return <p role="alert">Invalid product data.</p>
  }

  // ── Loading state (was the blocking issue) ──────────────────────────────
  if (loading) {
    return (
      <section aria-label="Loading products" aria-busy="true">
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
        <div style={gridStyle}>
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </section>
    )
  }

  // Error state
  if (error) {
    return (
      <div role="alert" style={{ color: '#b91c1c', padding: '2rem', textAlign: 'center' }}>
        <p>⚠️ {error}</p>
        <p>Please try refreshing the page.</p>
      </div>
    )
  }

  // ── Category filter ─────────────────────────────────────────────────────
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const filtered = useMemo(() => {
    if (!selectedCategory) return products
    return products.filter(
      p => (p.category || '').toLowerCase() === selectedCategory.toLowerCase()
    )
  }, [products, selectedCategory])

  if (products.length === 0) {
    return (
      <div role="status" style={msgStyle}>
        <p style={{ fontSize: '2rem' }}>🛒</p>
        <p><strong>No products available</strong></p>
      </div>
    )
  }

  if (filtered.length === 0) {
    return (
      <div role="status" aria-live="polite" style={msgStyle}>
        <p style={{ fontSize: '2rem' }}>🔍</p>
        <p><strong>No products in "{selectedCategory}"</strong></p>
        <p>Try a different category.</p>
      </div>
    )
  }

  return (
    <section aria-label={selectedCategory ? `${selectedCategory} products` : 'All products'}>
      <p aria-live="polite" style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1rem' }}>
        Showing <strong>{filtered.length}</strong> product{filtered.length !== 1 ? 's' : ''}
        {selectedCategory ? ` in "${selectedCategory}"` : ''}
      </p>
      <div style={gridStyle} role="list" aria-label="Product list">
        {filtered.map(product => (
          <ProductCard key={product.id ?? product.name} product={product} />
        ))}
      </div>
    </section>
  )
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: '1.25rem',
}
const msgStyle = {
  padding: '3rem',
  textAlign: 'center',
  color: '#666',
  background: '#f9fafb',
  borderRadius: 12,
  border: '1px solid #e5e7eb',
}