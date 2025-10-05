import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useProducts } from "../contexts/ProductContext";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

// Local Fallbacks
const HARD_FALLBACK_BY_CATEGORY = {
  Chairs: "/placeholders/bg_hero.svg",
  Sofas: "/placeholders/bg_hero.svg",
  Desks: "/placeholders/bg_hero.svg",
  Tables: "/placeholders/bg_hero.svg",
  Lighting: "/placeholders/bg_hero.svg",
  Shelves: "/placeholders/bg_hero.svg",
  Beds: "/placeholders/bg_hero.svg",
  Storage: "/placeholders/bg_hero.svg",
  Stools: "/placeholders/bg_hero.svg",
  "Side Tables": "/placeholders/bg_hero.svg",
  Benches: "/placeholders/bg_hero.svg",
  "TV Stands": "/placeholders/bg_hero.svg",
  Outdoor: "/placeholders/bg_hero.svg",
};

const DEFAULT_HARD_FALLBACK = "/placeholders/bg_hero.svg";

const CATEGORY_LABELS = {
  Chairs: "Chair",
  Desks: "Desk",
  Tables: "Table",
  Sofas: "Sofa",
  Lighting: "Lamp",
  Shelves: "Bookshelf",
  Beds: "Bed",
  Outdoor: "Outdoor",
  Storage: "Cabinet",
  Stools: "Stool",
  "Side Tables": "Side Table",
  Benches: "Bench",
  "TV Stands": "TV Stand",
};

const ProductDetailsPage = () => {
  // read sku and product id
  const params = useParams();
  const sku = params.sku ?? params.id ?? params.productId ?? "";

  const location = useLocation();
  const { products, loading, error } = useProducts();

  // Strictly use sku for live db data
  const list = Array.isArray(products) ? products : products?.data ?? [];

  const product = useMemo(() => {
    if (!sku) return null;
    return list.find((p) => p.sku === sku) || null;
  }, [list, sku]);

  // require image index or state
  const qsIndex = Number(new URLSearchParams(location.search).get("img"));
  const stateIndex = Number(location.state?.imageIndex);
  const requestedIndex = Number.isFinite(qsIndex)
    ? qsIndex
    : Number.isFinite(stateIndex)
    ? stateIndex
    : 0;

  // use provided images first and then build fallbacks
  const images = useMemo(() => {
    if (!product) return [];

    const provided =
      (product.images || []).filter(Boolean).map((img) => ({
        url: img.url,
        alt: img.alt || product.name,
      })) || [];

    const desired = Math.max(4, provided.length || 1);

    // Network “pretty” fallback (category-aware). Preference to unsplash
    // unlikely to 403. Picsum is reliable; Unsplash hotlinks often returns 403.
    const prettySeed =
      product.category || product.collections || product.name || "furniture";
    const pretty = (i) =>
      `https://picsum.photos/seed/${encodeURIComponent(
        `${prettySeed}-${i + 1}`
      )}/800/800`;

    const fallbacks = Array.from(
      { length: desired - provided.length },
      (_, i) => ({
        url: pretty(i), // nice-looking network fallback
        alt: product.name,
      })
    );

    const result = [...provided, ...fallbacks];
    if (result.length === 0) {
      // Will be replaced by hard fallback in <img onError>, but set something anyway
      result.push({ url: pretty(0), alt: product.name });
    }
    return result;
  }, [product?.images, product?.name, product?.category, product?.collections]);

  // index state
  const [index, setIndex] = useState(() =>
    Math.min(Math.max(0, requestedIndex), Math.max(0, images.length - 1))
  );

  useEffect(() => {
    const safe = Math.min(
      Math.max(0, requestedIndex),
      Math.max(0, images.length - 1)
    );
    setIndex(safe);
  }, [product?.sku, images.length]);

  const current = images[index] || images[0];

  // Ensure local fallbacks never fails
  const hardFallback =
    HARD_FALLBACK_BY_CATEGORY[product?.category] || DEFAULT_HARD_FALLBACK;

  // Fix rating stars
  const stars = useMemo(() => {
    const avg = Math.round(product?.ratings?.average ?? 0);
    return Array.from({ length: 5 }, (_, i) => (i < avg ? "★" : "☆")).join("");
  }, [product?.ratings?.average]);

  const related = useMemo(() => {
    if (!product) return []; // If there's no product, return an empty list

    return products
      .filter(
        (p) =>
          p.sku !== product.sku && // Don't include the same product
          (p.category === product.category ||
            p.collections === product.collections)
      )
      .slice(0, 4); // Only take the first 4 matching products
  }, [products, product]); // Recalculate only when products or product changes

  // Notification messages
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-slate-200">
        Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-red-500 text-center h-64 px-20 flex justify-center items-center font-bold text-xl">
        Error occurred. Try again later.
      </div>
    );
  }
  if (!product) {
    return (
      <div className="text-red-500 text-center h-64 px-20 flex flex-col gap-2 justify-center items-center font-bold text-xl">
        <p>Product not found</p>
        <Link
          to="/"
          className="underline underline-offset-2 font-normal text-base"
        >
          Go back to homepage
        </Link>
      </div>
    );
  }

  // Previous and next functionalities
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10  py-6 md:py-10">
        {/* Breadcrumbs */}
        <div className="text-sm text-swBlack mb-10">
          <Link to="/" className="text-gray-400 hover:text-swBlack">
            Home
          </Link>
          <span className="mx-2">/</span>
          {product.collections ? (
            <span className="text-gray-400 hover:text-swBlack cursor-default">
              {product.collections}
            </span>
          ) : null}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Image Gallery */}
          <div>
            <div className="bg-gray-100 rounded-lg overflow-hidden shadow-sm relative">
              <img
                src={current?.url || hardFallback}
                alt={current?.alt || product.name}
                className="w-full h-auto object-contain aspect-square"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  if (e.currentTarget.src !== hardFallback) {
                    e.currentTarget.src = hardFallback; // final local image
                  }
                }}
              />

              {images.length > 1 && (
                <>
                  <button
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-swBlack w-10 h-10 rounded-full shadow flex items-center justify-center"
                    onClick={prev}
                    aria-label="Previous image"
                    type="button"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-swBlack w-10 h-10 rounded-full shadow flex items-center justify-center"
                    onClick={next}
                    aria-label="Next image"
                    type="button"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={img.url || idx}
                    onClick={() => setIndex(idx)}
                    type="button"
                    className={`border rounded overflow-hidden focus:outline-none ${
                      idx === index
                        ? "ring-2 ring-black"
                        : "hover:ring-1 hover:ring-gray-700"
                    }`}
                    aria-label={`Image ${idx + 1} for ${product.name}`}
                  >
                    <img
                      src={img.url || hardFallback}
                      alt={img.alt || product.name}
                      className="w-full h-20 object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        if (e.currentTarget.src !== hardFallback) {
                          e.currentTarget.src = hardFallback; // final local image
                        }
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="">
            <h1 className="text-2xl md:text-3xl font-semibold text-swBlack">
              {product.name}
            </h1>

            <div className="mt-2 flex items-center gap-3 text-sm">
              <span className="text-yellow-500" aria-hidden>
                {stars}
              </span>
              <span className="text-gray-700">
                {product.ratings?.average?.toFixed?.(1) || "0.0"}
              </span>
              <span className="text-gray-500">
                ({product.ratings?.count || 0})
              </span>
            </div>
            <div className="mt-8 flex items-center justify-between border-b border-[#E0E0E0] pb-[25px]">
              <div>
                <p className="uppercase text-[#828282] tracking-wider">
                  as low as
                </p>
                <span className="text-3xl font-semibold text-swBlack">
                  ${product.price}
                </span>
              </div>
              <div>
                <span className="ml-auto inline-flex items-center gap-1">
                  {product.inStock ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-green-700">In stock</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-red-600" />
                      <span className="text-red-700">Out of stock</span>
                    </>
                  )}
                </span>

                <p className="font-light">#SKU: {product.sku}</p>
              </div>
            </div>
          </div>

          {/* Quantity & Add to cart */}
          <div></div>
        </div>
      </div>

      {/* Accordions */}
      <Accordion product={product} />

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-[58px]">
          <h2 className="text-center text-2xl font-light mb-6">
            Related Products
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[30px] px-[170px]">
            {related.map((p) => (
              <Link
                key={p.sku}
                to={`/products/${p.sku}`}
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState({}, "", `/products/${p.sku}`);
                  window.dispatchEvent(new PopStateEvent("popstate"));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <div className="bg-swBlack/50 rounded-lg overflow-hidden">
                  <img
                    src={p.images?.[0]?.url}
                    alt={p.images?.[0]?.alt || p.name}
                    className="w-full h-40 object-cover"
                  />
                </div>
                <div className="mt-4 text-sm">
                  <p>{p.name}</p>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  {p.originalPrice > p.price && (
                    <span className="text-gray-400 line-through">
                      ${p.originalPrice}
                    </span>
                  )}
                  <span>${p.price}</span>
                </div>

                <div className="mt-2 flex items-center gap-3 text-sm">
                  <span className="text-yellow-500" aria-hidden>
                    {stars}
                  </span>
                  <span className="text-gray-700">
                    {p.ratings?.average?.toFixed?.(1) || "0.0"}
                  </span>
                  <span className="text-gray-500">
                    ({p.ratings?.count || 0})
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;

const Accordion = ({ product }) => {
  const sections = [
    { title: "Details", content: product.description }, //0
    {
      title: "Sizes",
      content: product.dimensions
        ? `${product.dimensions.height} x ${product.dimensions.width} x ${product.dimensions.depth} x ${product.dimensions.unit}`
        : "",
    }, // 1
    { title: "Care Instructions", content: product.careInstructions || "--" },
    {
      title: "Quality and environmental information",
      content: (product.materials || []).join(", ") || "--",
    },
    { title: "Packing Information", content: "Ships in standard packaging" },
    {
      title: "Instructions and documents",
      content: "Instructions and documents",
    },
    {
      title: "Product Availability",
      content: product.inStock ? "In stock" : "Out of stock",
    },
    {
      title: "Reviews",
      content: `${product.ratings?.count || 0} reviews`,
    },
  ];

  // States need for the accordion drop down actions
  const [open, setOpen] = useState(0);

  return (
    <div className="mt-10 px-[170px] divide-y">
      {sections.map((section, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            className="w-full flex items-center justify-start py-4 text-left gap-[21px]"
          >
            <span className="text-swBlack text-2xl">
              {open === i ? "-" : "+"}
            </span>
            <span className="text-swBlack font-bold">{section.title}</span>
          </button>
          {open === i && (
            <div className="pb-4 pl-[47px] font-light">{section.content}</div>
          )}
        </div>
      ))}
    </div>
  );
};
