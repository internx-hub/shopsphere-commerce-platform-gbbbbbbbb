const categories = [
  "All",
  "Electronics",
  "Fashion",
  "Books"
];

export default function CategorySidebar({
  selectedCategory,
  setSelectedCategory
}) {
  return (
    <aside className="sticky top-4 h-fit">
      <h2 className="font-bold mb-4">
        Categories
      </h2>

      <div className="flex flex-col gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() =>
              setSelectedCategory(category)
            }
            className={`px-4 py-2 rounded-lg text-left ${
              selectedCategory === category
                ? "bg-black text-white"
                : "bg-gray-100"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </aside>
  );
}