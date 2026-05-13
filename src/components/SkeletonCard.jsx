import React from "react";

const SkeletonCard = () => {
  return (
    <div className="animate-pulse border rounded-lg p-4">
      <div className="bg-gray-300 h-40 rounded mb-4"></div>

      <div className="bg-gray-300 h-4 w-3/4 rounded mb-2"></div>

      <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
    </div>
  );
};

export default SkeletonCard;