'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import ProductCard from '@/components/product/ProductCard';
import { useCartStore } from '@/stores/cartStore';

const fetcher = (url) => fetch(url).then((res) => {
  if (!res.ok) throw new Error('Product not found');
  return res.json();
});

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id;

  const { data: product, error, isLoading } = useSWR(
    productId ? `/api/products/${productId}` : null,
    fetcher
  );

  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [adding, setAdding] = useState(false);

  // Reset state when product changes
  useEffect(() => {
    setQuantity(1);
    setSelectedImage(0);
  }, [productId]);

  const images = product?.images?.length
    ? product.images
    : product?.image_url
      ? [product.image_url]
      : [];

  const handleAddToCart = async () => {
    if (!product || product.stock === 0) return;
    setAdding(true);
    try {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
    } catch (err) {
      console.error('Failed to add to cart', err);
    } finally {
      setAdding(false);
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-6xl mb-4">😕</p>
        <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6">
          The product you are looking for does not exist or has been removed.
        </p>
        <button onClick={() => router.push('/products')} className="btn-primary">
          Back to Products
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="skeleton-pulse bg-gray-200 rounded-xl h-96 mb-8" />
        <div className="skeleton-pulse bg-gray-200 rounded-lg h-8 w-1/3 mb-4" />
        <div className="skeleton-pulse bg-gray-200 rounded-lg h-6 w-1/4" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-flex items-center gap-1"
      >
        ← Back
      </button>

      <div className="grid grid-cols-2 gap-10">
        {/* Image gallery */}
        <div>
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4">
            <img
              src={images[selectedImage] || '/placeholder.svg'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === idx ? 'border-brand-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div>
          <p className="text-sm text-gray-500 mb-1">{product.category}</p>
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
          <p className="text-3xl font-bold text-brand-600 mb-4">
            ${product.price?.toFixed(2)}
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            {product.description}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-gray-500">Quantity:</span>
            <input
              type="number"
              min="1"
              max="10"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(10, Number(e.target.value))))}
              disabled={product.stock === 0}
              className="input-field w-20 text-center"
            />
            <span className="text-sm text-gray-500">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || adding}
            className="btn-primary w-full py-3 text-lg flex items-center justify-center gap-2"
          >
            {adding ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Adding...
              </>
            ) : product.stock === 0 ? (
              'Out of Stock'
            ) : (
              'Add to Cart'
            )}
          </button>

          <div className="mt-8 space-y-3 text-sm text-gray-500">
            <p>🚚 Free shipping on orders over $50</p>
            <p>↩️ 30-day easy returns</p>
            <p>🔒 Secure checkout powered by Stripe</p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {product.category && (
        <div className="mt-16">
          <h2 className="text-xl font-bold mb-4">Related Products</h2>
          <RelatedProducts categoryId={product.category} currentId={product.id} />
        </div>
      )}
    </div>
  );
}

function RelatedProducts({ categoryId, currentId }) {
  const { data, error } = useSWR(
    `/api/products?category=${categoryId}&limit=4`,
    (url) => fetch(url).then((r) => r.json())
  );

  if (error || !data?.items) return null;

  const related = data.items.filter((p) => p.id !== currentId).slice(0, 4);

  if (related.length === 0) return null;

  return (
    <div className="grid grid-cols-4 gap-4">
      {related.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}