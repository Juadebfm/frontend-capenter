import React, { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProducts } from "../contexts/ProductContext";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

const ProductDetailsPage = () => {
  // Use the SKU to find the product in the context
  const { sku } = useParams();
  // Bring in the contexts values
  const { products, loading, error, getProductById } = useProducts();

  // Allowing check/lookup for both _id, and sku
  const product = getProductById(sku) || products.find((p) => p.sku === sku);

  // Image Gallery
  const images = useMemo(() => {
    if (!product) return [];
    const provided = (product.images || []).filter(Boolean).map((img, i) => ({
      url: img.url,
      alt: img.alt || `${product.name}`,
    }));

    const desired = Math.max(4, provided.length || 1);

    const q = encodeURIComponent(
      [product.category || "furniture", product.collections, product.name]
        .filter(Boolean)
        .join(", ")
    );

    const fallbacks = [];
    for (let i = 0; i < desired - provided.length; i++) {
      // use lightweight stock image as our fallback (vary with sig)
      fallbacks.push({
        url: `https://source.unsplash.com/800x800/?${q}&sig=${i + 1}`,
        alt: `${product.name}`,
      });
    }

    const result = [...provided, ...fallbacks];

    if (result.length === 0) {
      result.push({
        url: "https://source.unsplash.com/random/300x300",
        alt: product.name,
      });
    }

    return result;
    // Only recompute when the product's relevant fields change *---->>>>Subject to change>>>>>>>
  }, [product?.images, product?.name, product?.category, product?.collections]);

  // States for the page
  const [index, setIndex] = useState(0);
  const current = images[index] || images[0];

  // Quantity state
  const [qty, setQty] = useState(1);
  const inc = () => setQty((q) => q + 1);
  const dec = () => setQty((q) => Math.max(1, q - 1));

  // Stars
  // const stars = useMemo(() => {
  //   const val = Math.round(product.ratings.average || 0);
  //   return Array.from({ length: 5 }, (_, i) =>
  //     i < val ? <IoIosStar key={i} /> : <IoIosStarOutline key={i} />
  //   );
  // }, [product?.ratings.average]);

  const stars = useMemo(() => {
    const avg = Math.round(product?.rating?.average ?? 0);
    return Array.from({ length: 5 }, (_, i) => (i < avg ? "★" : "☆")).join("");
  }, [product?.rating?.average]);

  <span
    className="text-yellow-500 font-medium"
    aria-label={`Rating: ${product?.rating?.average ?? 0} out of 5`}
  >
    {stars}
  </span>;

  const related = useMemo(() => {
    return products
      .filter(
        (relatedProduct) =>
          relatedProduct.sku !== product.sku &&
          (relatedProduct.category === product.category ||
            relatedProduct.collections === product.collections)
      )
      .slice(0, 4);
  }, [products, product]);

  // Loading UI
  if (loading)
    return (
      <div className="flex justify-center items-center h-64 bg-slate-200">
        Loading...
      </div>
    );

  // Error UI
  if (error)
    return (
      <div className="text-red-500 text-center h-64 px-20 flex justify-center items-center font-bold text-xl capitalize">
        Error Occured Try Again Later
      </div>
    );

  if (!product) {
    return (
      <div className="text-red-500 text-center h-64 px-20 flex justify-center items-center font-bold text-xl capitalize">
        <p className="text-red-500">Product Not Found</p>
        <Link to="/" className="underline underline-offset-2">
          Go Back To Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-atuo px-4 sm:px-6 md:px-10 lg:px-[150px] py-6 md:py-10">
        {/* Breadcrumps */}
        <div className="text-sm text-swBlack mb-10">
          <Link to="/" className="text-gray-400 hover:text-swBlack">
            Home
          </Link>
          <span className="mx-2">/</span>
          {product.collections ? (
            <>
              <span className="text-gray-400 hover:text-swBlack cursor-pointer">
                {product.collections}
              </span>
            </>
          ) : null}
        </div>

        {/* Image Gallery container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Imge gallery box */}
          <div>
            <div className="bg-gray-500 rounded-lg overflow-hidden shadow-sm relative">
              <img
                src={current.url}
                alt={current.alt || product.name}
                className="w-full h-auto object-contain apsect-square"
              />
              {images.length > 1 && (
                <>
                  <button
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-swBlack w-10 h-10 rounded-full shadow flex items-center justfiy-center"
                    onClick={() =>
                      setIndex((i) => (i - 1 + images.length) % images.length)
                    }
                    aria-label="Previous Image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-swBlack w-10 h-10 rounded-full shadow flex items-center justify-center"
                    onClick={() => setIndex((i) => (i + 1) % images.length)}
                    aria-label="Next Image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {images.map((img, idx) => {
                  <button
                    key={idx}
                    onClick={() => setIndex(idx)}
                    className={`border rounded overflow-hidden focus:outline-none ${
                      idx === index
                        ? "ring-2 ring-black"
                        : "hover:ring-1 hover:ring-gray-700"
                    }`}
                    aria-label={`Image number ${idx + 1} for ${product.name}`}
                  >
                    <img
                      src={img.url}
                      alt={img.alt || product.name}
                      className="w-full h-20 object-cover"
                    />
                  </button>;
                })}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-swBlack">
              {product.name}
            </h1>

            <div>
              <span className="text-yellow-500" aria-hidden>
                {stars}
              </span>
              <span>{product.rating?.average?.toFixed?.(1) || "0.0"}</span>
              <span>{product.rating?.count || 0}</span>
              <span className="ml-auto inline-flex items-center gap-1 ">
                {product.inStock === true ? (
                  <CheckCircle2 className="w-2 h-2 bg-green-500 text-green-500 rounded-full" />
                ) : (
                  <CheckCircle2 className="w-2 h-2 bg-red-500 text-red-500 rounded-full" />
                )}
                In Stock
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
