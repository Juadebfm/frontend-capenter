import React from "react";
import { useProducts } from "../contexts/ProductContext";
import ProductGrid from "../components/ProductGrid";
import Hero from "../components/Hero";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <ProductGrid />
    </div>
  );
};

export default HomePage;
