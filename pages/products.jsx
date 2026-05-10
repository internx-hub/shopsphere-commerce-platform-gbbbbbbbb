import { useState } from "react";

import ProductGrid from "../components/ProductGrid";
import CategorySidebar from "../components/CategorySidebar";

import products from "../data/products";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product) =>
            product.category === selectedCategory
        );

  return (
    <div className="flex gap-8 p-6">
      
      <div className="hidden md:block w-64">
        <CategorySidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={
            setSelectedCategory
          }
        />
      </div>

      <div className="flex-1">
        <ProductGrid
          products={filteredProducts}
        />
      </div>

    </div>
  );
}