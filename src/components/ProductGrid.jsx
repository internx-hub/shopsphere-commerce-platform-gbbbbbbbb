import React, { useMemo } from "react";
import ProductCard from "./ProductCard";

function SkeletonCard() {
  return <div style={styles.skeleton} aria-hidden="true" />;
}

export default function ProductGrid({
  products = [],
  selectedCategory = null,
  loading = false,
}) {
  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return products;

    return products.filter(
      (p) =>
        (p.category || "").toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [products, selectedCategory]);

  if (loading) {
    return (
      <section aria-label="Loading products" aria-busy="true">
        <div style={styles.grid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (!products.length) {
    return (
      <div style={styles.emptyBox}>
        <h3>No products available</h3>
        <p>Please try again later.</p>
      </div>
    );
  }

  if (!filteredProducts.length) {
    return (
      <div style={styles.emptyBox}>
        <h3>No products found in "{selectedCategory}"</h3>
        <p>Try selecting a different category.</p>
      </div>
    );
  }

  return (
    <section aria-label="Product grid">
      <p style={styles.countText}>
        Showing <b>{filteredProducts.length}</b> product
        {filteredProducts.length !== 1 ? "s" : ""}
        {selectedCategory ? ` in "${selectedCategory}"` : ""}
      </p>

      <div style={styles.grid}>
        {filteredProducts.map((product) => (
          <ProductCard key={product.id || product.name} product={product} />
        ))}
      </div>
    </section>
  );
}

const styles = {
  countText: {
    marginBottom: "1rem",
    fontSize: "0.9rem",
    color: "#6b7280",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "1.25rem",
  },
  skeleton: {
    height: 280,
    borderRadius: "14px",
    background: "#e5e7eb",
    animation: "pulse 1.4s ease-in-out infinite",
  },
  emptyBox: {
    padding: "3rem",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    textAlign: "center",
    color: "#374151",
  },
};