import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useLocation, useNavigate } from "react-router-dom";

// all orders stored
const ORDERS_STORAGE_KEY = "sw_orders_v1";
// last order
const LAST_ORDER_KEY = "sw_last_order_v1";
// Shipping details
const SHIPPING_STORAGE_KEY = "sw_shipping_v1";
// Delay in milliseconds before placing an order
const PLACE_ORDER_DELAY = 1500;
// Delay need for the sadhboard page: tbi
const AUTO_DASHBOARD_DELAY = 60000;

const SHIPPING_FORM_TEMPLATE = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  address1: "",
  address2: "",
  city: "",
  country: "",
  state: "",
  zip: "",
  shippingMethod: "best",
  phone: "",
};

// directly from cal;/fetch
const splitFullName = (fullName = "") => {
  if (!fullName?.trim()) return { first: "", last: "" };

  const parts = fullName.trim().split(/\s+/);

  const [first, ...rest] = parts;

  return { first: first || "", last: rest.join(" ").trim() };
};

// to get user details especially splitted and normalized name
const getUserProfileFields = (user) => {
  if (!user) return { firstName: "", lastName: "", email: "" };

  const derived =
    user.firstName || user.lastName
      ? { first: user.firstName || "", last: user.lastName || "" }
      : splitFullName(user.name);

  return {
    firstName: derived.first || "",
    lastName: derived.last || "",
    email: derived.first || "",
  };
};

// json
const safeReadJson = (key, fallback) => {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const readStoredOrders = () => safeReadJson(ORDERS_STORAGE_KEY, []);

const readLastOrderSnapshot = () => {
  const last = safeReadJson(LAST_ORDER_KEY, null);
  if (last) return last;
  const orders = readStoredOrders();
  return orders[0] || null;
};

const formatCurrency = (value) => `$${value.toFixed(2)}`;

const StepIndicator = ({ currentStep }) => {
  const steps = [
    { id: "shipping", label: "Shipping" },
    { id: "review", label: "Review & Payments" },
  ];
  const currentIndex = Math.max(
    steps.findIndex((step) => step.id === currentStep),
    0
  );

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {steps.map((step, idx) => {
        const isComplete = idx < currentIndex;
        const isActive = idx === currentIndex;
        const base =
          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold";

        const stateClass = isActive
          ? "bg-swGreen text-white"
          : isComplete
          ? "bg-swGreen text-white"
          : "bg-gray-200 text-gray-500";

        return (
          <React.Fragment key={step.id}>
            <div className={`${base} ${stateClass}`}>{idx + 1}</div>
            <span
              className={`text-sm ${
                isActive ? "text-gray-900 font-semibold" : "text-gray-500"
              }`}
            >
              {step.label}
            </span>
            {idx < steps.length - 1 && (
              <span className="w-12 h-px bg-gray-200" aria-hidden="true" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default function Checkout() {
  const { items, clearCart, getSubTotal } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const storedOrders = useMemo(() => readStoredOrders(), []);
  const storedLastOrder = useMemo(() => readLastOrderSnapshot(), []);

  // states
  const [orders, setOrders] = useState();
  const [orderDetails, setOrderDetails] = useState(storedLastOrder);
  const initialPhase =
    location.state?.view === "dashboard" && storedLastOrder
      ? "dashboard"
      : "shipping";

  const [phase, setPhase] = useState(initialPhase);
  const [formError, setFormError] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [autoRedirectSeconds, setAutoRedirectSeconds] = useState(
    AUTO_DASHBOARD_DELAY / 1000
  );

  // refs
  const countdownRef = useRef(null);
  const redirectRef = useRef(null);

  // functionalities on the page
  // for calling and prefilling user details on inputs
  const userProfileDefaults = useMemo(() => getUserProfileFields(user), [user]);

  // get details and help prefill
  const [form, setForm] = useState(() => {
    const stored = safeReadJson(SHIPPING_STORAGE_KEY, null);
    return stored
      ? { ...SHIPPING_FORM_TEMPLATE, ...stored }
      : { ...SHIPPING_FORM_TEMPLATE, ...userProfileDefaults };
  });

  // shipping details in the localstorage
  useEffect(() => {
    try {
      localStorage.setItem(SHIPPING_STORAGE_KEY, JSON.stringify(form));
    } catch {
      // nada
    }
  }, [form]);

  useEffect(() => {
    setForm((prev) => {
      if (!prev) return prev;

      const updates = {};

      if (!prev.firstName?.trim() && userProfileDefaults.firstName) {
        updates.firstName = userProfileDefaults.firstName;
      }
      if (!prev.lastName?.trim() && userProfileDefaults.lastName) {
        updates.lastName = userProfileDefaults.lastName;
      }
      if (!prev.email?.trim() && userProfileDefaults.email) {
        updates.email = userProfileDefaults.email;
      }

      return Object.keys(updates).length ? { ...prev, ...updates } : prev;
    });
  }, [
    userProfileDefaults.firstName,
    userProfileDefaults.lastName,
    userProfileDefaults.email,
  ]);
}
