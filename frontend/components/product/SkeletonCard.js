export default function SkeletonCard() {
  return (
    <div className="card">
      <div className="aspect-square rounded-lg bg-gray-200 skeleton-pulse mb-3" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded skeleton-pulse w-3/4" />
        <div className="h-4 bg-gray-200 rounded skeleton-pulse w-1/2" />
        <div className="flex justify-between items-center mt-2">
          <div className="h-5 bg-gray-200 rounded skeleton-pulse w-16" />
          <div className="h-8 bg-gray-200 rounded-lg skeleton-pulse w-20" />
        </div>
      </div>
    </div>
  );
}