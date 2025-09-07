import React, { useState } from "react";
import { useProducts } from "../context/ProductContext";

const ProductGrid = () => {
  const { products, loading, error } = useProducts();
  const [showPrice, setShowPrice] = useState(null);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        Loading products...
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center">Error: {error}</div>;

  // Only show first 7 products
  const displayProducts = products.slice(0, 7);

  const PlusIcon = () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </svg>
  );

  const handlePlusClick = (productSku) => {
    setShowPrice(showPrice === productSku ? null : productSku);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* 2-Column Masonry Grid */}
        <div className="columns-2 gap-4 space-y-4">
          {displayProducts.map((product, index) => (
            <div key={product.sku} className="break-inside-avoid mb-4">
              {/* Product Image Card */}
              <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                <img
                  src={product.images[0]?.url}
                  alt={product.images[0]?.alt || product.name}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>

              {/* Product Info Below Card */}
              <div className="mt-3 flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900 flex-1 mr-2">
                  {product.name}
                </h3>

                {/* Plus Icon Button */}
                <button
                  onClick={() => handlePlusClick(product.sku)}
                  className="flex-shrink-0 w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <PlusIcon />
                </button>
              </div>

              {/* Price Display (shows when plus is clicked) */}
              {showPrice === product.sku && (
                <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-900">
                      ${product.price}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-gray-500 line-through text-xs">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* See More Button */}
        <div className="text-center mt-8">
          <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200">
            See More
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
