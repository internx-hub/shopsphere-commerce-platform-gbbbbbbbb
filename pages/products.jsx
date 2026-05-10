import React, { useState, useEffect, useMemo } from "react";
import CategorySidebar from "../src/components/CategorySidebar";
import ProductGrid from "../src/components/ProductGrid";
import products as STATIC_PRODUCTS from "../data/products";

function isValidProduct(p) {
  return (
    p &&
    typeof p === "object" &&
    (typeof p.id === "number" || typeof p.id === "string") &&
    typeof p.name === "string" &&
    typeof p.price === "number"
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const API =
          process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL;

        if (!API) {
          setProducts(STATIC_PRODUCTS.filter(isValidProduct));
          return;
        }

        const res = await fetch(`${API}/api/products`);

        if (!res.ok) {
          throw new Error(`Server error (${res.status})`);
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid API response format");
        }

        const validProducts = data.filter(isValidProduct);

        if (!cancelled) {
          setProducts(validProducts);
        }
      } catch (err) {
        if (!cancelled) {
          setProducts(STATIC_PRODUCTS.filter(isValidProduct));
          setError(
            "Live product data could not be loaded. Showing fallback products."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    return [...new Set(products.map((p) => p.category).filter(Boolean))].sort();
  }, [products]);

  return (
    <div style={layoutStyles.page}>
      <aside style={layoutStyles.sidebar}>
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </aside>

      <main style={layoutStyles.main}>
        <header style={layoutStyles.header}>
          <h1 style={layoutStyles.title}>
            {selectedCategory ? selectedCategory : "All Products"}
          </h1>

          <p style={layoutStyles.subtitle}>
            Browse products and filter by category.
          </p>

          {error && (
            <div style={layoutStyles.errorBox} role="alert">
              ⚠️ {error}
            </div>
          )}
        </header>

        <ProductGrid
          products={products}
          selectedCategory={selectedCategory}
          loading={loading}
        />
      </main>
    </div>
  );
}

const layoutStyles = {
  page: {
    display: "flex",
    gap: "2rem",
    padding: "1.5rem",
    minHeight: "100vh",
    background: "#f9fafb",
  },
  sidebar: {
    width: 240,
    flexShrink: 0,
    position: "sticky",
    top: "1.5rem",
    alignSelf: "flex-start",
    height: "fit-content",
  },
  main: {
    flex: 1,
    padding: "0.5rem 0",
  },
  header: {
    marginBottom: "1.5rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: 700,
    marginBottom: "0.25rem",
  },
  subtitle: {
    fontSize: "0.95rem",
    color: "#6b7280",
  },
  errorBox: {
    marginTop: "1rem",
    padding: "0.75rem 1rem",
    borderRadius: "10px",
    background: "#fee2e2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    fontSize: "0.9rem",
  },
};