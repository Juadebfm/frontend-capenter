import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../contexts/ProductContext";
import { PlusIcon } from "lucide-react";

const ProductGrid = () => {
  // Context funcs
  const { products, loading, error } = useProducts();
  const items = Array.isArray(products) ? products : products?.data ?? [];

  console.log(products.length);
  const [showPrice, setShowPrice] = useState(null);
  // How many products to see on the page load = 10
  const INITIAL_COUNT = 10;
  // When the see more button is clicked
  const STEP = 10;
  // How many products to show after see more button
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  // Loading UI
  if (loading)
    return (
      <div className="flex justify-center items-center h-64 bg-slate-200">
        Loading products...
      </div>
    );

  // Error UI
  if (error)
    return (
      <div className="text-red-500 text-center h-64 px-20 flex justify-center items-center font-bold text-xl capitalize">
        Error Occured Try Again Later
      </div>
    );

  // To create the first set of products to see i.e 10 products
  const displayedProducts = items.slice(0, visibleCount);

  // func for plus click
  const handlePlusClick = (productSku) => {
    setShowPrice(showPrice === productSku ? null : productSku);
  };

  const canSeeMore = visibleCount < items.length;

  // button: see more
  const handleSeeMore = () => {
    if (canSeeMore) {
      setVisibleCount((c) => Math.min(c + STEP, items.length));
    } else {
      setVisibleCount(INITIAL_COUNT);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto w-full">
        {/* Product grid actual */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
          {displayedProducts.map((product, index) => (
            <div key={product.sku} className="break-inside-avoid mb-4 sm:mb-6">
              {/* Product Image */}
              <Link to={`/products/${product.sku}`} className="block">
                <img
                  src={product.images[0]?.url}
                  alt={product.images[0]?.alt || product.name}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </Link>

              {/* Product info card */}
              <div className="mt-3 flex items-center justify-start gap-3">
                {/* Plus icon */}
                <button
                  onClick={() => handlePlusClick(product.sku)}
                  className="flex-shrink-0 w-6 h-6 bg-[#7DB800] hover:bg-[#7DB800]/80 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <PlusIcon />
                </button>
                <h3 className="text-sm font-light text-swBlack flex-1 mr-2">
                  <Link
                    to={`/products/${product.sku}`}
                    className="hover:underline"
                  >
                    {product.name}
                  </Link>
                </h3>
              </div>

              {/* Price Display (shows when the plus icon is clicked) */}
              {showPrice === product.sku && (
                <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-swBlack">
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
        {/* // See more  */}
        <div className="text-center mt-8">
          {items.length > INITIAL_COUNT && (
            <button
              aria-label={
                canSeeMore ? "See More Products" : "Collapse Products"
              }
              onClick={handleSeeMore}
              className="bg-[#7DB800] hover:bg-[#7DB800]/80 text-white px-8 py-3 rounded font-semibold transition-all duration-300 flex items-center gap-2 drop-shadow-lg"
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
