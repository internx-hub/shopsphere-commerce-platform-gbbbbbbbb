import React from 'react'

/**
 * ProductCard
 * Displays a single product with image, name, category, price, and rating.
 * Accessible: uses article element, aria-label, keyboard-focusable.
 */
function StarRating({ rating }) {
  const full  = Math.floor(rating)
  const half  = rating % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return (
    <span className="star-rating" aria-label={`Rating: ${rating} out of 5`}>
      {'★'.repeat(full)}
      {half ? '½' : ''}
      {'☆'.repeat(empty)}
    </span>
  )
}

export default function ProductCard({ product }) {
  if (!product) return null

  const {
    id,
    name       = 'Unnamed Product',
    category   = '',
    price      = 0,
    image      = '',
    rating     = 0,
    reviewCount = 0,
    inStock    = true,
  } = product

  const formattedPrice = typeof price === 'number'
    ? `$${price.toFixed(2)}`
    : price

  return (
    <article
      className="product-card"
      aria-label={`${name}, ${formattedPrice}`}
      tabIndex={0}
      role="listitem"
    >
      {/* Badge */}
      {!inStock && (
        <span className="product-card__badge product-card__badge--out" aria-label="Out of stock">
          Out of Stock
        </span>
      )}

      {/* Image */}
      <div className="product-card__image-wrap">
        {image ? (
          <img
            src={image}
            alt={name}
            className="product-card__image"
            loading="lazy"
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
        ) : (
          <div className="product-card__image-placeholder" aria-hidden="true">
            🛍️
          </div>
        )}
      </div>

      {/* Body */}
      <div className="product-card__body">
        <span className="product-card__category">{category}</span>
        <h3 className="product-card__name">{name}</h3>

        {rating > 0 && (
          <div className="product-card__rating">
            <StarRating rating={rating} />
            {reviewCount > 0 && (
              <span className="product-card__review-count">({reviewCount})</span>
            )}
          </div>
        )}

        <div className="product-card__footer">
          <span className="product-card__price">{formattedPrice}</span>
          <button
            className="product-card__btn"
            disabled={!inStock}
            aria-label={inStock ? `Add ${name} to cart` : `${name} is out of stock`}
            onClick={() => console.info(`[ProductCard] Add to cart: ${id}`)}
          >
            {inStock ? 'Add to Cart' : 'Unavailable'}
          </button>
        </div>
      </div>
    </article>
  )
}