export default function ProductCard({ product }) {
  return (
    <div className="border rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-48 object-cover rounded-lg"
      />

      <h3 className="mt-3 font-semibold">
        {product.title}
      </h3>

      <p className="text-gray-500">
        ₹{product.price}
      </p>

      <button className="mt-4 w-full bg-black text-white py-2 rounded-lg">
        Add to Cart
      </button>
    </div>
  );
}