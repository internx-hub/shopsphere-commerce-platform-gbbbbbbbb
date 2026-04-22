import React from 'react';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import ProductGallery from '@/components/product/ProductGallery'; // Shared client component
import QuantitySelector from '@/components/product/QuantitySelector'; // Shared client component

// Fetch product data from the FastAPI backend [cite: 87]
async function getProductData(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, {
    next: { revalidate: 60 } // SWR-like behavior [cite: 64]
  });
  
  if (res.status === 404) return null; // [cite: 92]
  if (!res.ok) throw new Error('Failed to fetch product');
  
  return res.json();
}

export default async function ProductDetailPage({ params }) {
  const product = await getProductData(params.id);

  // Graceful 404 handling [cite: 92, 98]
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <a href="/products" className="text-blue-600 hover:underline">← Back to all products</a>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Hero image gallery [cite: 83, 88, 95] */}
        <ProductGallery images={product.image_urls || [product.image_url]} />

        {/* Product Info & Quantity Selector [cite: 83, 89] */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-2xl font-semibold text-blue-600">${product.price.toFixed(2)}</p>
          <div className="border-t border-b py-4">
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Logic for Quantity and Cart [cite: 89, 90, 97] */}
          <QuantitySelector 
            product={product} 
            maxStock={Math.min(product.stock, 10)} 
          />
          
          {product.stock <= 5 && product.stock > 0 && (
            <p className="text-orange-500 text-sm font-medium">
              Only {product.stock} left in stock!
            </p>
          )}
        </div>
      </div>

      {/* Related Products Section [cite: 83, 91, 96] */}
      <section className="mt-20">
        <h2 className="text-2xl font-bold mb-8">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {product.related?.map((item) => (
            <ProductCard key={item.id} {...item} />
          ))}
        </div>
      </section>
    </div>
  );
}