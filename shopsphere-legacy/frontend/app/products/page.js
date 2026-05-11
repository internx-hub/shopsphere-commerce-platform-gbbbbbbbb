'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import ProductCard from '@/components/product/ProductCard';
import useProducts from '@/hooks/useProducts';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Home', 'Books'];

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const categoryFromUrl = searchParams.get('category');
  useEffect(() => {
    if (categoryFromUrl && CATEGORIES.includes(categoryFromUrl)) {
      setCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  // basic debounce - could be better
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { products, loading, error } = useProducts({
    category: category === 'All' ? '' : category,
    search,
    page: 1,
    limit: 20,
  });

  const handleCategoryClick = (cat) => {
    setCategory(cat);
    if (cat === 'All') {
      router.push('/products');
    } else {
      router.push(`/products?category=${cat}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="input-field pl-9 w-64"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Category filter - horizontal chips */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === cat
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product grid */}
      {loading && (
        <p className="text-gray-500 text-center py-12">Loading products...</p>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-500 mb-2">Failed to load products.</p>
          <p className="text-sm text-gray-400">{error.message}</p>
        </div>
      )}

      {!loading && !error && products?.items?.length === 0 && (
        <div className="text-center py-16">
          <p className="text-6xl mb-4">🔍</p>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No products found</h3>
          <p className="text-gray-400 text-sm">
            Try adjusting your search or filter to find what you are looking for.
          </p>
        </div>
      )}

      {!loading && !error && products?.items?.length > 0 && (
        <div className="grid grid-cols-3 gap-6">
          {products.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination placeholder */}
      {products?.total > 20 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => console.log('Load more not implemented yet')}
            className="btn-secondary"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}