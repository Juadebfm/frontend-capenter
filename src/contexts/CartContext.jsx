import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(); // initializing the createContext hook from react

// create a custom hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within Cart Provider");
  return context;
};

const STORAGE_KEY = "sw_cart_v1";

// Create a provider
export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }); // items =  ["marble chair", "marble chair", "another product", "another product"]

  // marble chair X 2
  // another product X

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Failed to get universal cart items", error);
    }
  }, [items]);

  const findIndex = (sku) => items.findIndex((i) => i.sku === sku);

  // functionalities
  const addItem = (product, qty = 1) => {
    setItems((prev) => {
      const index = prev.findIndex((p) => p.sku === product.sku);
      if (index > -1) {
        const copy = [...prev];
        copy[index] = { ...copy[index], qty: copy[index].qty + qty };

        return copy;
      }

      const item = {
        sku: product.sku,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.url || null,
        qty: qty,
      };

      return [...prev, item];
    });
  }; // STORAGE_KEY: ["marble chair", "marble chair", "another product"]

  const value = {
    addItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
