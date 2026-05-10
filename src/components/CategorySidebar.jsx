export default function CategorySidebar({
  categories = [],
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <aside style={sidebarStyle}>
      <h2 style={titleStyle}>Categories</h2>

      <button
        onClick={() => setSelectedCategory("All")}
        style={{
          ...buttonStyle,
          ...(selectedCategory === "All" ? activeStyle : {}),
        }}
      >
        All
      </button>

      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          style={{
            ...buttonStyle,
            ...(selectedCategory === category ? activeStyle : {}),
          }}
        >
          {category}
        </button>
      ))}
    </aside>
  )
}

const sidebarStyle = {
  position: "sticky",
  top: "20px",
  alignSelf: "flex-start",
  padding: "1rem",
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  minWidth: "220px",
  height: "fit-content",
}

const titleStyle = {
  marginBottom: "1rem",
  fontSize: "1.2rem",
}

const buttonStyle = {
  display: "block",
  width: "100%",
  padding: "0.8rem 1rem",
  marginBottom: "0.6rem",
  border: "none",
  borderRadius: "8px",
  background: "#f3f4f6",
  cursor: "pointer",
  textAlign: "left",
  transition: "0.2s",
}

const activeStyle = {
  background: "#111827",
  color: "#ffffff",
}