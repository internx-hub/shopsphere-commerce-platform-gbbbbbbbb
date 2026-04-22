import React from 'react';

const ProductCard = ({ image, name, price, onAddToCart }) => {
  return (
    <div className="max-w-sm rounded-xl overflow-hidden shadow-lg bg-white border border-gray-200 transition-transform duration-300 hover:scale-105">
      {/* Product Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-contain p-4"
        />
      </div>

      {/* Product Details */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 truncate">
          {name}
        </h3>
        
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xl font-extrabold text-blue-600">
            ${price.toFixed(2)}
          </span>
          
          <button
            onClick={onAddToCart}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;