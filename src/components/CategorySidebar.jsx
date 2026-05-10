import React from 'react'

/**
 * CategorySidebar
 * Sticky sidebar that lists all product categories.
 * Calls onSelect(category) when a category is clicked.
 * "All" resets the filter (passes null).
 * Accessible: uses nav + aria-current.
 */
export default function CategorySidebar({ categories = [], selectedCategory, onSelect }) {
  if (!Array.isArray(categories)) {
    console.error('[CategorySidebar] categories must be an array')
    return null
  }

  return (
    <nav
      className="category-sidebar"
      aria-label="Product categories"
      role="navigation"
    >
      <h2 className="category-sidebar__heading">Categories</h2>

      <ul className="category-sidebar__list" role="list">
        {/* All Products */}
        <li>
          <button
            className={`category-sidebar__item${!selectedCategory ? ' category-sidebar__item--active' : ''}`}
            onClick={() => onSelect(null)}
            aria-current={!selectedCategory ? 'true' : undefined}
            aria-label="Show all products"
          >
            <span className="category-sidebar__icon" aria-hidden="true">🏪</span>
            All Products
          </button>
        </li>

        {categories.map(cat => {
          const isActive = selectedCategory === cat
          return (
            <li key={cat}>
              <button
                className={`category-sidebar__item${isActive ? ' category-sidebar__item--active' : ''}`}
                onClick={() => onSelect(cat)}
                aria-current={isActive ? 'true' : undefined}
                aria-label={`Filter by ${cat}`}
              >
                <span className="category-sidebar__dot" aria-hidden="true" />
                {cat}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}