// components/CategorySidebar.jsx

const categories = [
  "All",
  "Electronics",
  "Fashion",
  "Books"
];

export default function CategorySidebar({
  selected,
  setSelected
}) {
  return (
    <aside className="sticky top-4 h-fit">
      <h2 className="font-bold mb-4">
        Categories
      </h2>

      <div className="flex flex-col gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelected(cat)}
            className={`text-left px-3 py-2 rounded ${
              selected === cat
                ? "bg-black text-white"
                : "bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </aside>
  );
}