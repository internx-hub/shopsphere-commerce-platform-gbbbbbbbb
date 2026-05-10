import { useEffect, useState } from "react"
import ProductGrid from "../src/components/ProductGrid"
import CategorySidebar from "../src/components/CategorySidebar"
import productsData from "../data/products"

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)

        // if local data
        setProducts(productsData)

        // if using API later:
        // const response = await fetch("/api/products")
        // if (!response.ok) {
        //   throw new Error("Failed to fetch products")
        // }
        // const data = await response.json()
        // setProducts(data)

      } catch (err) {
        console.error(err)
        setError("Unable to load products.")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const categories = [
    ...new Set(products.map((product) => product.category)),
  ]

  if (loading) {
    return <h2 style={{ padding: "2rem" }}>Loading products...</h2>
  }

  if (error) {
    return (
      <h2 style={{ padding: "2rem", color: "red" }}>
        {error}
      </h2>
    )
  }

  return (
    <main style={pageStyle}>
      <CategorySidebar
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <div style={{ flex: 1 }}>
        <h1 style={headingStyle}>Products</h1>

        <ProductGrid
          products={products}
          selectedCategory={selectedCategory}
        />
      </div>
    </main>
  )
}

const pageStyle = {
  display: "flex",
  gap: "2rem",
  padding: "2rem",
  alignItems: "flex-start",
}

const headingStyle = {
  marginBottom: "1.5rem",
}