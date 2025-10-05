import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CataloguePage from "./pages/CataloguePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ProductsProvider } from "./contexts/ProductContext";
import { AuthProvider } from "./contexts/AuthContext";
import AccountPage from "./pages/AccountPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import { CartProvider } from "./contexts/CartContext";

const App = () => {
  return (
    <div>
      <AuthProvider>
        <ProductsProvider>
          <CartProvider>
            <Router>
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/catalogue" element={<CataloguePage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/products/:sku" element={<ProductDetailsPage />} />
              </Routes>
              <Footer />
            </Router>
          </CartProvider>
        </ProductsProvider>
      </AuthProvider>
    </div>
  );
};

export default App;
