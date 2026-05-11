'use client'

interface CategorySidebarProps {
  categories: string[]
  selectedCategory: string | null
  onSelect: (category: string | null) => void
}

const CATEGORY_ICONS: Record<string, string> = {
  Electronics:    '💻',
  Fashion:        '👗',
  'Home & Kitchen': '🏠',
  Sports:         '🏋️',
  Grocery:        '🛒',
}

/**
 * CategorySidebar
 *
 * Sticky sidebar that lists product categories.
 * Calls onSelect(category) when a category is clicked.
 * Calls onSelect(null) to reset to "All Products".
 *
 * Accessible: <nav> landmark, aria-current on the active item.
 */
export default function CategorySidebar({
  categories,
  selectedCategory,
  onSelect,
}: CategorySidebarProps) {
  return (
    <nav aria-label="Product categories">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
        Categories
      </h2>

      <ul role="list" className="flex flex-col gap-0.5">
        {/* All Products — resets filter */}
        <li>
          <button
            onClick={() => onSelect(null)}
            aria-current={!selectedCategory ? 'true' : undefined}
            aria-label="Show all products"
            className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-left transition-colors ${
              !selectedCategory
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span aria-hidden="true">🏪</span>
            All Products
          </button>
        </li>

        {/* One button per category */}
        {categories.map((cat) => {
          const isActive = selectedCategory === cat
          return (
            <li key={cat}>
              <button
                onClick={() => onSelect(cat)}
                aria-current={isActive ? 'true' : undefined}
                aria-label={`Filter by ${cat}`}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span aria-hidden="true">
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