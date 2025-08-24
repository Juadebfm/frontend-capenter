import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CataloguePage from "./pages/CataloguePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ProductsProvider } from "./contexts/ProductContext";

const App = () => {
  return (
    <div>
      <ProductsProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalogue" element={<CataloguePage />} />
          </Routes>
          <Footer />
        </Router>
      </ProductsProvider>
    </div>
  );
};

export default App;
