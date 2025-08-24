import { createContext, useContext, useEffect, useState } from "react";

const ProductsContext = createContext();

// custom hook
export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error(
      "There was an issue with the custom context hook, ensure you're wrapping the provider around your app.js"
    );
  }
  return context;
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // a spinner keeps showing as long as loading is true
  const [error, setError] = useState(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null); // Any error before now, it is clear

      const response = await fetch(
        "https://e-commerce-backend-beta-lemon.vercel.app/api/products/"
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      // adjust to how our api data looks.
      setProducts(data.products || data);
    } catch (error) {
      setError(error.message);
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Simple functionalities needed in components
  const getProductsByCategory = (category) => {
    return products.filter(
      (product) => product.category?.toLowerCase() === category.toLowerCase()
    );
  };

  const searchProducts = (searchTerm) => {
    return products.filter(
      (product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getCategories = () => {
    const categories = products
      .map((product) => product.category)
      .filter(Boolean);

    return [...new Set(categories)];
  };

  const refetch = async () => {
    setError(null);
    await loadProducts();
  };

  const value = {
    // State
    products,
    loading,
    error,

    // Methods or funcs
    getProductsByCategory,
    getCategories,
    searchProducts,
    refetch,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};
