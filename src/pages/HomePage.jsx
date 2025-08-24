import React from "react";
import { useProducts } from "../contexts/ProductContext";

const HomePage = () => {
  const { products } = useProducts();
  console.log(products);
  return <div className="min-h-screen bg-red-500">HomePage</div>;
};

export default HomePage;
