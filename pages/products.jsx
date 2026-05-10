// pages/products.jsx

import { useState } from "react";
import products from "../data/products";

import ProductGrid from "../components/ProductGrid";
import CategorySidebar from "../components/CategorySidebar";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (p) => p.category === selectedCategory
        );

  return (
    <div className="flex gap-8 p-6">
      
      {/* Sidebar */}
      <div className="w-64 hidden md:block">
        <CategorySidebar
          selected={selectedCategory}
          setSelected={setSelectedCategory}
        />
      </div>

      {/* Product Grid */}
      <div className="flex-1">
        <ProductGrid products={filteredProducts} />
      </div>

    </div>
  );
}