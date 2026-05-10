import React from "react";

export default function CategorySidebar({
  categories = [],
  selectedCategory,
  onSelect,
}) {
  return (
    <nav style={styles.sidebar} aria-label="Product categories">
      <h2 style={styles.heading}>Categories</h2>

      <button
        style={{
          ...styles.item,
          ...(selectedCategory === null ? styles.active : {}),
        }}
        onClick={() => onSelect(null)}
      >
        All Products
      </button>

      {categories.map((cat) => {
        const isActive = selectedCategory === cat;

        return (
          <button
            key={cat}
            style={{ ...styles.item, ...(isActive ? styles.active : {}) }}
            onClick={() => onSelect(cat)}
          >
            {cat}
          </button>
        );
      })}
    </nav>
  );
}

const styles = {
  sidebar: {
    padding: "1rem",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
  },
  heading: {
    fontSize: "1rem",
    fontWeight: 700,
    marginBottom: "1rem",
  },
  item: {
    width: "100%",
    textAlign: "left",
    padding: "0.75rem 0.85rem",
    marginBottom: "0.5rem",
    borderRadius: "10px",
    border: "1px solid transparent",
    background: "#f9fafb",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: 500,
  },
  active: {
    background: "#dbeafe",
    border: "1px solid #93c5fd",
    fontWeight: 700,
  },
};