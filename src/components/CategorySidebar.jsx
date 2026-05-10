import React from 'react'

// Category icon map — extend as needed
const CATEGORY_ICONS = {
  Electronics: '💻',
  Fashion: '👗',
  'Home & Kitchen': '🏠',
  Sports: '🏋️',
  Grocery: '🛒',
}

/**
 * CategorySidebar
 *
 * Sticky sidebar listing all product categories derived from the live product set.
 * Calls onSelect(category) on click; onSelect(null) resets to "All".
 *
 * Accessible: <nav> landmark, aria-current on active item, keyboard-navigable buttons.
 */
export default function CategorySidebar({ categories = [], selectedCategory, onSelect }) {
  // Silent guard — no console.error left in production code
  if (!Array.isArray(categories)) return null

  return (
    <nav
      className="category-sidebar"
      aria-label="Product categories"
    >
      <h2 className="category-sidebar__heading">Categories</h2>

      <ul className="category-sidebar__list" role="list">
        {/* All Products reset */}
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

        {categories.map((cat) => {
          const isActive = selectedCategory === cat
          return (
            <li key={cat}>
              <button
                className={`category-sidebar__item${isActive ? ' category-sidebar__item--active' : ''}`}
                onClick={() => onSelect(cat)}
                aria-current={isActive ? 'true' : undefined}
                aria-label={`Filter by ${cat}`}
              >
                <span className="category-sidebar__icon" aria-hidden="true">
                  {CATEGORY_ICONS[cat] ?? '📦'}
                </span>
                {cat}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}