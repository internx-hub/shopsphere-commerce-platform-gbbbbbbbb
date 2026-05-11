import React, { useState, useEffect, useMemo } from 'react'
import CategorySidebar from '../src/components/CategorySidebar'
import ProductGrid from '../src/components/ProductGrid'
import STATIC_PRODUCTS from '../data/products'   // fixed: was "import products as"

// ---------------------------------------------------------------------------
// Validate a product object has the minimum required shape
// ---------------------------------------------------------------------------
function isValidProduct(p) {
  return (
    p !== null &&
    typeof p === 'object' &&
    (typeof p.id === 'number' || typeof p.id === 'string') &&
    typeof p.name === 'string' &&
    typeof p.price === 'number'
  )
}

// ---------------------------------------------------------------------------
// ProductsPage
// ---------------------------------------------------------------------------
export default function ProductsPage() {
  const [products, setProducts]               = useState([])
  const [loading, setLoading]                 = useState(true)
  const [error, setError]                     = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadProducts() {
      setLoading(true)
      setError(null)

      try {
        const apiBase =
          process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL

        if (apiBase) {
          const res = await fetch(`${apiBase}/api/products`)
          if (!res.ok) throw new Error(`HTTP ${res.status}`)

          const data = await res.json()
          if (!Array.isArray(data)) throw new Error('Response is not an array')

          if (!cancelled) setProducts(data.filter(isValidProduct))
        } else {
          // No API configured — use bundled static data
          if (!cancelled) setProducts(STATIC_PRODUCTS.filter(isValidProduct))
        }
      } catch (err) {
        if (!cancelled) {
          // Graceful degradation: show static data with a soft warning
          setProducts(STATIC_PRODUCTS.filter(isValidProduct))
          setError(`Could not load live data: ${err.message}`)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadProducts()
    return () => { cancelled = true }
  }, [])

  // Derive category list from the live product set
  const categories = useMemo(
    () =>
      [...new Set(products.map((p) => p.category).filter(Boolean))].sort(),
    [products]
  )

  return (
    <>
      {/* Inject component styles once — move to a .css file in a real project */}
      <style>{COMPONENT_STYLES}</style>

      <div className="products-page">
        {/* Sticky category sidebar */}
        <aside className="products-page__sidebar">
          <CategorySidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </aside>

        {/* Main content */}
        <main className="products-page__main">
          <h1 className="products-page__title">
            {selectedCategory ?? 'All Products'}
          </h1>

          {/* Soft error banner — still shows static data below */}
          {error && (
            <p role="alert" className="products-page__error">
              ⚠️ {error}
            </p>
          )}

          <ProductGrid
            products={products}
            selectedCategory={selectedCategory}
            loading={loading}
            error={null}   // error shown in banner above; grid shows data
          />
        </main>
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// Component styles (move to products.module.css or globals.css in production)
// ---------------------------------------------------------------------------
const COMPONENT_STYLES = `
  /* Layout */
  .products-page {
    display: flex;
    gap: 2rem;
    padding: 1.5rem;
    min-height: 100vh;
    font-family: system-ui, sans-serif;
    box-sizing: border-box;
  }

  .products-page__sidebar {
    width: 220px;
    flex-shrink: 0;
    align-self: flex-start;
    position: sticky;
    top: 1rem;
  }

  .products-page__main {
    flex: 1;
    min-width: 0;
  }

  .products-page__title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 1rem;
    color: #111827;
  }

  .products-page__error {
    padding: 0.75rem 1rem;
    background: #fef3c7;
    border: 1px solid #f59e0b;
    border-radius: 8px;
    color: #92400e;
    margin-bottom: 1rem;
    font-size: 0.875rem;
  }

  /* CategorySidebar */
  .category-sidebar__heading {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #6b7280;
    margin: 0 0 0.75rem;
  }

  .category-sidebar__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .category-sidebar__item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: none;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    color: #374151;
    text-align: left;
    transition: background 0.15s;
  }

  .category-sidebar__item:hover {
    background: #f3f4f6;
  }

  .category-sidebar__item--active {
    background: #eff6ff;
    color: #1d4ed8;
    font-weight: 600;
  }

  .category-sidebar__icon {
    font-size: 1rem;
    flex-shrink: 0;
  }

  /* ProductCard */
  .product-card {
    position: relative;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: box-shadow 0.2s, transform 0.2s;
    outline: none;
  }

  .product-card:hover,
  .product-card:focus-visible {
    box-shadow: 0 4px 16px rgba(0,0,0,0.10);
    transform: translateY(-2px);
  }

  .product-card__badge {
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 20px;
    z-index: 1;
  }

  .product-card__badge--out {
    background: #fee2e2;
    color: #991b1b;
  }

  .product-card__image-wrap {
    width: 100%;
    height: 180px;
    overflow: hidden;
    background: #f9fafb;
  }

  .product-card__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }

  .product-card:hover .product-card__image {
    transform: scale(1.04);
  }

  .product-card__image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    color: #d1d5db;
  }

  .product-card__body {
    padding: 0.875rem 1rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }

  .product-card__category {
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #6b7280;
  }

  .product-card__name {
    font-size: 0.95rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .product-card__rating {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.85rem;
    color: #f59e0b;
    margin-top: 2px;
  }

  .product-card__review-count {
    color: #9ca3af;
    font-size: 0.8rem;
  }

  .product-card__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    padding-top: 10px;
    gap: 8px;
  }

  .product-card__price {
    font-size: 1.1rem;
    font-weight: 700;
    color: #111827;
  }

  .product-card__btn {
    padding: 0.45rem 0.9rem;
    border-radius: 8px;
    border: none;
    background: #2563eb;
    color: #fff;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
    white-space: nowrap;
  }

  .product-card__btn:hover:not(:disabled) {
    background: #1d4ed8;
  }

  .product-card__btn:disabled {
    background: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;
  }

  /* Star rating */
  .star-rating {
    letter-spacing: 1px;
  }

  /* Responsive: collapse sidebar below 640px */
  @media (max-width: 640px) {
    .products-page {
      flex-direction: column;
      padding: 1rem;
    }
    .products-page__sidebar {
      width: 100%;
      position: static;
    }
    .category-sidebar__list {
      flex-direction: row;
      flex-wrap: wrap;
    }
    .category-sidebar__item {
      width: auto;
      flex-shrink: 0;
    }
  }
`