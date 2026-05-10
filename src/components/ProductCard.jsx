import React from 'react'

/**
 * StarRating
 * Renders filled/half/empty stars with an accessible aria-label.
 */
function StarRating({ rating }) {
  const clamped = Math.min(Math.max(Number(rating) || 0, 0), 5)
  const full    = Math.floor(clamped)
  const hasHalf = clamped % 1 >= 0.5
  const empty   = 5 - full - (hasHalf ? 1 : 0)

  return (
    <span
      className="star-rating"
      aria-label={`Rating: ${clamped.toFixed(1)} out of 5`}
      title={`${clamped.toFixed(1)} / 5`}
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
 * Displays a single product: image, name, category badge, star rating,
 * price, and an Add to Cart button (disabled when out of stock).
 *
 * Accessible: <article> element, aria-label, keyboard-focusable, lazy image.
 */
export default function ProductCard({ product }) {
  if (!product) return null

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

  const formattedPrice =
    typeof price === 'number' ? `$${price.toFixed(2)}` : String(price)

  function handleAddToCart() {
    // Replace with real cart dispatch in a full implementation
    console.info(`[ProductCard] Add to cart → id:${id}, name:"${name}"`)
  }

  return (
    <article
      className="product-card"
      aria-label={`${name}, ${formattedPrice}${!inStock ? ', out of stock' : ''}`}
      tabIndex={0}
      role="listitem"
    >
      {/* Out-of-stock badge */}
      {!inStock && (
        <span
          className="product-card__badge product-card__badge--out"
          aria-label="Out of stock"
        >
          Out of Stock
        </span>
      )}

      {/* Product image */}
      <div className="product-card__image-wrap">
        {image ? (
          <img
            src={image}
            alt={name}
            className="product-card__image"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="product-card__image-placeholder" aria-hidden="true">
            🛍️
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="product-card__body">
        {category && (
          <span className="product-card__category">{category}</span>
        )}

        <h3 className="product-card__name">{name}</h3>

        {rating > 0 && (
          <div className="product-card__rating">
            <StarRating rating={rating} />
            {reviewCount > 0 && (
              <span className="product-card__review-count">
                ({reviewCount.toLocaleString()})
              </span>
            )}
          </div>
        )}

        <div className="product-card__footer">
          <span className="product-card__price">{formattedPrice}</span>
          <button
            className="product-card__btn"
            disabled={!inStock}
            aria-label={
              inStock
                ? `Add ${name} to cart`
                : `${name} is out of stock`
            }
            onClick={handleAddToCart}
          >
            {inStock ? 'Add to Cart' : 'Unavailable'}
          </button>
        </div>
      </div>
    </article>
  )
}