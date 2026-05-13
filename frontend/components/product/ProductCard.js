'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/stores/cartStore';

export default function ProductCard({ product }) {
  const [imgError, setImgError] = useState(false);
  // BUG: dispatches to 'addToCart' but the store method is 'addItem'
  const { addToCart } = useCartStore();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return;

    console.log('Adding to cart:', product.name);

    // This calls addToCart which does NOT exist in the store
    // The store has addItem - this is the bug
    addToCart(product);

    // TODO: show toast notification on success
    // probably need a toast library or custom implementation
  };

  const formatPrice = (price) => {
    if (typeof price !== 'number') return '$0.00';
    return `$${price.toFixed(2)}`;
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="card block group hover:shadow-lg transition-all duration-200"
    >
      {/* Product image */}
      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3 relative">
        {!imgError && product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 33vw"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-medium text-sm bg-black/60 px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product info */}
      <h3 className="font-medium text-sm text-gray-800 line-clamp-2 mb-1 min-h-[2.5rem]">
        {product.name}
      </h3>
      <div className="flex items-center justify-between mt-2">
        <span className="text-brand-600 font-bold text-base">
          {formatPrice(product.price)}
        </span>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            product.stock === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-brand-600 text-white hover:bg-brand-700'
          }`}
        >
          {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
}