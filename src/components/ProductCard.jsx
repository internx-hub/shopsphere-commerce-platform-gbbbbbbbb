'use client'

import { Product } from '../types/product'

interface ProductCardProps {
  product: Product
}

function StarRating({ rating }: { rating: number }) {
  const clamped = Math.min(Math.max(rating, 0), 5)
  const full    = Math.floor(clamped)
  const hasHalf = clamped % 1 >= 0.5
  const empty   = 5 - full - (hasHalf ? 1 : 0)

  return (
    <span
      className="text-amber-400 tracking-wide"
      aria-label={`Rating: ${clamped.toFixed(1)} out of 5`}
    >
      {'★'.repeat(full)}
      {hasHalf ? '½' : ''}
      {'☆'.repeat(empty)}
    </span>
  )
}

/**
 * ProductCard
 *
 * Displays a single product with image, name, category, rating, price,
 * and an Add to Cart button (disabled when out of stock).
 *
 * Accessible: <article>, aria-label, keyboard-focusable, lazy image load.
 */
export default function ProductCard({ product }: ProductCardProps) {
  const {
    id,
    name        = 'Unnamed Product',
    category    = '',
    price       = 0,
    image       = '',
    rating      = 0,
    reviewCount = 0,
    inStock     = true,
  } = product

  const formattedPrice = `$${price.toFixed(2)}`

  function handleAddToCart() {
    console.info(`[ProductCard] Add to cart → id:${id}, name:"${name}"`)
  }

  return (
    <article
      className="relative bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col
                 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      aria-label={`${name}, ${formattedPrice}${!inStock ? ', out of stock' : ''}`}
      tabIndex={0}
      role="listitem"
    >
      {/* Out-of-stock badge */}
      {!inStock && (
        <span
          className="absolute top-2 left-2 z-10 bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full"
          aria-label="Out of stock"
        >
          Out of Stock
        </span>
      )}

      {/* Product image */}
      <div className="w-full h-44 overflow-hidden bg-gray-50">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-5xl text-gray-300"
            aria-hidden="true"
          >
            🛍️
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-1 p-4 flex-1">
        {category && (
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {category}
          </span>
        )}

        <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
          {name}
        </h3>

        {rating > 0 && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <StarRating rating={rating} />
            {reviewCount > 0 && (
              <span className="text-xs text-gray-400">
                ({reviewCount.toLocaleString()})
              </span>
            )}
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-3 gap-2">
          <span className="text-lg font-bold text-gray-900">
            {formattedPrice}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            aria-label={
              inStock ? `Add ${name} to cart` : `${name} is out of stock`
            }
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
                       bg-blue-600 text-white hover:bg-blue-700
                       disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {inStock ? 'Add to Cart' : 'Unavailable'}
          </button>
        </div>
      </div>
    </article>
  )
}