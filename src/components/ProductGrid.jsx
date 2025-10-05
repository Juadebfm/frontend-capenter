import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../contexts/ProductContext";

const ProductGrid = () => {
  const { products, loading, error } = useProducts();
  const [showPrice, setShowPrice] = useState(null);
  const INITIAL_COUNT = 10;
  const STEP = 10;
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        Loading products...
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center">Error: {error}</div>;

  const displayProducts = products.slice(0, visibleCount);

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

  const canSeeMore = visibleCount < products.length;
  const handleSeeMore = () => {
    if (canSeeMore) {
      setVisibleCount((c) => Math.min(c + STEP, products.length));
    } else {
      setVisibleCount(INITIAL_COUNT);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto w-full">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
          {displayProducts.map((product, index) => (
            <div key={product.sku} className="break-inside-avoid mb-4 sm:mb-6">
              {/* Product Image Card */}
              <Link to={`/products/${product.sku}`} className="block">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <img
                    src={product.images[0]?.url}
                    alt={product.images[0]?.alt || product.name}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>
              </Link>

              {/* Product Info Below Card */}
              <div className="mt-3 flex items-center justify-start gap-3">
                {/* Plus Icon Button */}
                <button
                  onClick={() => handlePlusClick(product.sku)}
                  className="flex-shrink-0 w-6 h-6 bg-[#7DB800] hover:bg-[#7DB800]/80 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <PlusIcon />
                </button>
                <h3 className="text-sm font-light text-[#212121] flex-1 mr-2">
                  <Link
                    to={`/products/${product.sku}`}
                    className="hover:underline"
                  >
                    {product.name}
                  </Link>
                </h3>
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
          {products.length > INITIAL_COUNT && (
            <button
              onClick={handleSeeMore}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 sm:px-8 py-3 rounded font-semibold transition-colors duration-300"
              aria-label={
                canSeeMore ? "See more products" : "Collapse products"
              }
            >
              {canSeeMore ? "See More" : "See Less"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
