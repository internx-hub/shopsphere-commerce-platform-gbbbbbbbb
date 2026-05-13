import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function HomePage() {
  const { data: featuredProducts, error } = useSWR(
    '/api/products?limit=4',
    fetcher
  );

  const categories = [
    { name: 'Electronics', slug: 'Electronics', image: '🔌', color: 'bg-blue-50' },
    { name: 'Clothing', slug: 'Clothing', image: '👕', color: 'bg-pink-50' },
    { name: 'Home', slug: 'Home', image: '🏠', color: 'bg-green-50' },
    { name: 'Books', slug: 'Books', image: '📚', color: 'bg-yellow-50' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-600 to-brand-800 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Shop Smart, Live Better
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Discover curated products from small retailers. Quality you can trust,
            prices you will love.
          </p>
          <Link
            href="/products"
            className="inline-block bg-white text-brand-700 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className={`${cat.color} rounded-xl p-6 text-center hover:shadow-md transition-shadow`}
            >
              <span className="text-4xl block mb-2">{cat.image}</span>
              <span className="font-medium text-gray-800">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link href="/products" className="text-brand-600 hover:underline text-sm font-medium">
            View All →
          </Link>
        </div>
        {error && (
          <p className="text-red-500">Failed to load featured products.</p>
        )}
        {!featuredProducts && !error && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton-pulse bg-gray-200 rounded-xl h-64" />
            ))}
          </div>
        )}
        {featuredProducts?.items && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredProducts.items.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="card group hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-medium text-sm truncate">{product.name}</h3>
                <p className="text-brand-600 font-semibold mt-1">
                  ${product.price?.toFixed(2)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Trust badges */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-2xl mb-1">🚚</p>
            <p className="font-medium text-sm">Free Shipping</p>
            <p className="text-xs text-gray-500">On orders over $50</p>
          </div>
          <div>
            <p className="text-2xl mb-1">🔒</p>
            <p className="font-medium text-sm">Secure Payment</p>
            <p className="text-xs text-gray-500">Powered by Stripe</p>
          </div>
          <div>
            <p className="text-2xl mb-1">↩️</p>
            <p className="font-medium text-sm">Easy Returns</p>
            <p className="text-xs text-gray-500">30-day return policy</p>
          </div>
        </div>
      </section>
    </div>
  );
}