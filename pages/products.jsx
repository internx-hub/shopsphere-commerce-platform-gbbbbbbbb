import React, { useState, useEffect, useMemo } from 'react'
import CategorySidebar from '../src/components/CategorySidebar'
import ProductGrid from '../src/components/ProductGrid'
import products as STATIC_PRODUCTS from '../data/products'

// Validate a single product has required fields
function isValidProduct(p) {
  return (
    p &&
    typeof p === 'object' &&
    (typeof p.id === 'number' || typeof p.id === 'string') &&
    typeof p.name === 'string' &&
    typeof p.price === 'number'
  )
}

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL
        if (API) {
          const res = await fetch(`${API}/api/products`)
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          const data = await res.json()
          if (!Array.isArray(data)) throw new Error('Response is not an array')
          const valid = data.filter(isValidProduct)
          if (!cancelled) setProducts(valid)
        } else {
          if (!cancelled) setProducts(STATIC_PRODUCTS.filter(isValidProduct))
        }
      } catch (err) {
        if (!cancelled) {
          setProducts(STATIC_PRODUCTS.filter(isValidProduct))
          setError(`Could not load live data: ${err.message}`)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const categories = useMemo(
    () => [...new Set(products.map(p => p.category).filter(Boolean))].sort(),
    [products]
  )

  return (
    <div style={{ display: 'flex', gap: '2rem', padding: '1.5rem', minHeight: '100vh' }}>
      <aside style={{ width: 220, flexShrink: 0, alignSelf: 'flex-start', position: 'sticky', top: '1rem' }}>
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </aside>
      <main style={{ flex: 1 }}>
        <h1>{selectedCategory ?? 'All Products'}</h1>
        {error && <p role="alert" style={{ color: '#b91c1c' }}>⚠️ {error}</p>}
        <ProductGrid
          products={products}
          selectedCategory={selectedCategory}
          loading={loading}
          error={null}  // error shown above; grid shows fallback data
        />
      </main>
    </div>
  )
}