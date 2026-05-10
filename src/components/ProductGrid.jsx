import ProductCard from "./ProductCard"

export default function ProductGrid({
  products = [],
  selectedCategory = "All",
}) {
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product) =>
            product.category?.toLowerCase() ===
            selectedCategory.toLowerCase()
        )

  if (filteredProducts.length === 0) {
    return (
      <div style={emptyStyle}>
        <h3>No products found</h3>
        <p>Try selecting another category.</p>
      </div>
    )
  }

  return (
    <section>
      <div style={gridStyle}>
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id || product.name}
            product={product}
          />
        ))}
      </div>
    </section>
  )
}

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "1.5rem",
  width: "100%",
}

const emptyStyle = {
  padding: "3rem",
  textAlign: "center",
  background: "#f8fafc",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
}