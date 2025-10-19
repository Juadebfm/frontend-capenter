import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { useProducts } from "../contexts/ProductContext";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Minus,
  Plus,
  Heart,
  Mail,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
import { MdEmail } from "react-icons/md";

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

  // Quantity State
  const { items, addItem, updateQty, removeItem } = useCart();
  const { show } = useToast ? useToast() : { show: () => {} };
  const [qty, setQty] = useState(1);

  // Keep local quantity in sync with the cart when the product items list changes.
  useEffect(() => {
    if (!product) return;

    const existing = items.find((i) => i.sku === product.sku);

    if (existing) setQty(existing.qty);
  }, [product?.sku, items]);

  // Increment and decrement
  const inc = () => {
    const existing = items.find((i) => i.sku === product.sku);

    if (existing) {
      const next = existing.qty + 1;
      updateQty(product.sku, next);
      setQty(next);
      show && show(`${product.name} quantity updated: ${next}`);
    } else {
      // Auto add on first increment
      addItem(product, 1);
      setQty(1);
      show && show(`${product.name} added to cart`);
    }
  };

  const dec = () => {
    const existing = items.find((i) => i.sku === product.sku);
    if (existing) {
      const next = existing.qty - 1;
      if (next <= 0) {
        removeItem(product.sku);
        setQty(1);
        show && show(`${product.name} removed from cart`);
      } else {
        updateQty(product.sku, next);
        setQty(next);
        show && show(`${product.name} quantity updated: ${next}`);
      }
    } else {
      setQty((q) => Math.max(1, q - 1));
    }
  };

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 lg:px-[150px] py-6 md:py-10">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-gray-700">
            Home
          </Link>
          <span className="mx-2">/</span>
          {product.collections ? (
            <>
              <span>{product.collections}</span>
              <span className="mx-2">/</span>
            </>
          ) : null}
          <span className="text-gray-700">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Image gallery with thumbnails and nav */}
          <div>
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm relative">
              <img
                src={current.url}
                alt={current.alt || product.name}
                className="w-full h-auto object-contain aspect-square"
              />
              {images.length > 1 && (
                <>
                  <button
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 w-10 h-10 rounded-full shadow flex items-center justify-center"
                    onClick={() =>
                      setIndex((i) => (i - 1 + images.length) % images.length)
                    }
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 w-10 h-10 rounded-full shadow flex items-center justify-center"
                    onClick={() => setIndex((i) => (i + 1) % images.length)}
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setIndex(idx)}
                    className={`border rounded overflow-hidden focus:outline-none ${
                      idx === index
                        ? "ring-2 ring-green-500"
                        : "hover:ring-1 hover:ring-gray-300"
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img
                      src={img.url}
                      alt={img.alt || product.name}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
              {product.name}
            </h1>

            <div className="mt-2 flex items-center gap-3 text-sm text-gray-600">
              <span className="text-yellow-500" aria-hidden>
                {" "}
                {stars}{" "}
              </span>
              <span>{product.rating?.average?.toFixed?.(1) || "0.0"}</span>
              <span className="text-gray-400">·</span>
              <span>{product.rating?.count || 0} reviews</span>
              <span className="ml-auto inline-flex items-center gap-1 text-green-600">
                <CheckCircle2 className="w-4 h-4" /> In stock
              </span>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div className="flex items-end gap-3">
                <span className="text-3xl font-semibold text-gray-900">
                  ${product.price}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-gray-400 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">SKU: {product.sku}</p>
            </div>

            {/* Quantity + Add to cart */}
            <div className="mt-6">
              <label className="block text-sm text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center border rounded">
                  <button
                    onClick={dec}
                    className="p-2 hover:bg-gray-50"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 min-w-[2rem] text-center select-none">
                    {qty}
                  </span>
                  <button
                    onClick={inc}
                    className="p-2 hover:bg-gray-50"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <AddToCartButton product={product} qty={qty} />
              </div>
            </div>

            {/* Secondary actions */}
            <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <button className="inline-flex items-center gap-2 hover:text-gray-800">
                <Heart className="w-4 h-4" /> Add to wishlist
              </button>
              <button className="inline-flex items-center gap-2 hover:text-gray-800">
                Add to compare
              </button>
              <button className="inline-flex items-center gap-2 hover:text-gray-800">
                <Mail className="w-4 h-4" /> Email
              </button>
            </div>
          </div>
        </div>

        {/* Accordions */}
        <Accordion product={product} />

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="text-center text-xl font-medium mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {related.map((p) => (
                <Link
                  key={p.sku}
                  to={`/products/${p.sku}`}
                  className="group"
                  onClick={(e) => {
                    // defend against any outer handlers and ensure navigation + scroll
                    e.preventDefault();
                    // use programmatic navigation to ensure the route updates
                    // (Link would normally handle this, but some layouts swallow clicks)
                    window.history.pushState({}, "", `/products/${p.sku}`);
                    // force react-router to navigate programmatically
                    // NOTE: using location assign via the browser ensures URL change; react-router will pick it up
                    window.dispatchEvent(new PopStateEvent("popstate"));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    <img
                      src={p.images?.[0]?.url}
                      alt={p.images?.[0]?.alt || p.name}
                      className="w-full h-40 object-cover"
                    />
                  </div>
                  <div className="mt-3 text-sm">
                    <p className="text-gray-900 group-hover:underline line-clamp-2">
                      {p.name}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="font-semibold">${p.price}</span>
                      {p.originalPrice > p.price && (
                        <span className="text-gray-400 line-through text-xs">
                          ${p.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
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
    <div className="mt-10 divide-y">
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

// Reusable Add to cart button
const AddToCartButton = ({ product, qty }) => {
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handle = () => {
    addItem(product, qty);
    navigate("/cart");
  };

  return (
    <button
      onClick={handle}
      className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 px-6 py-3 rounded font-semibold transition-colors"
    >
      Add To Cart
    </button>
  );
};
