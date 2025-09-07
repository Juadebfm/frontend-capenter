import { LucideSearch, Menu, ShoppingBag, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// Mock data for Links
const LINKS = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Product" },
  { to: "/elements", label: "Elements" },
  { to: "/pages", label: "Pages" },
  { to: "/shop", label: "Shop" },
  { to: "/sale", label: "Sale" },
];

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  // State for menu toggle
  const [open, setOpen] = useState(false);

  // state for the Background of the navbar
  const [solid, setSolid] = useState(false);

  const lastY = useRef(0);

  // Create ref
  const mqlRef = useRef(
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 770px)")
      : {
          matches: true,
          addEventListener: () => {},
          removeEventListener: () => {},
        }
  );

  // Logic for dynamic scroll
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onScroll = () => {
      if (!mqlRef.current.matches) return; // reference only works on small screens
      if (!isHome) return; // Works only on home screen

      const y = window.screenY;
      const goingUp = y < lastY.current;

      // show solid bg whne scrolling up beyond a threshold, otherwise it is transparent
      if (goingUp && y > 10) setSolid(true);
      if (!goingUp) setSolid(false);
      if (y <= 10) setSolid(false);

      lastY.current = y;
    };

    const onChange = () => {
      // reset when breakpoint (responsiveness) changes
      setSolid(false);
      lastY.current = window.scrollY || 0;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    mqlRef.current.addEventListener?.("change", onChange);

    return () => {
      window.removeEventListener("scroll", onScroll);
      mqlRef.current.removeEventListener?.("change", onChange);
    };
  }, [isHome]);

  // Link class
  const linkClass = (to) =>
    `block py-2 hover:text-swGreen hover:underline underline-offset-4 transition-all ${
      location.pathname === to ? "text-swGreen underline" : ""
    }`;

  // Mobile nav classes
  const mobileBar =
    open || !isHome
      ? "bg-white text-gray-900 border-b"
      : solid
      ? "bg-white text-gray-900 border-b"
      : "bg-transparent text-white";

  return (
    <>
      {/* {MOBILE NAV} */}
      <nav
        className={`md:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${mobileBar}`}
      >
        <div className="mx-auto max-w-screen px-4 h-16 flex items-center justify-between">
          {/* Hamburger / Menu Icon */}
          <button
            className="inline-flex items-center justify-center rounded-lg p-2 transition"
            aria-label="Toggle menu"
            aria-expanded={open}
            // aria-control="mobile-drawer"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="w-6 h-6 transition-transform duration-200 rotate-90" />
            ) : (
              <Menu className="w-6 h-6 transition-transform duration-200" />
            )}
          </button>

          {/* Center: SimpleWood */}
          <Link to="/">
            <img src="/sm_logo.svg" alt="" />
          </Link>

          {/* Right: */}

          <div className="flex items-center gap-4">
            <button aria-label="Search">
              <LucideSearch className="h-5 w-5" />
            </button>

            <Link to="/cart" className="inline-flex relative" aria-label="Cart">
              <span className="w-5 h-5 bg-smGreen text-white rounded-full flex items-center justify-center text-sm absolute -right-2 -top-2">
                2
              </span>
              <ShoppingBag className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
