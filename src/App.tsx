import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Home from "./pages/Home";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./context/CardContext";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./admin/AdminDashboard";
import LoginModal from "./components/LoginModal";

const App: React.FC = () => {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<LoginModal />} />


        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
};

export default App;
