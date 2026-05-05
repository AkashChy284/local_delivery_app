import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import TrackOrder from "./pages/TrackOrder";
import MyOrders from "./pages/MyOrders";
import Login from "./pages/Login";

import AppBackButton from "./components/AppBackButton";

function App() {
  return (
    <>
      {/* ✅ Back button handler */}
      <AppBackButton />

      {/* ✅ Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/track-order/:id" element={<TrackOrder />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/login" element={<Login />} />

        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/shivam-secret-admin-123" element={<Admin />} />
      </Routes>
    </>
  );
}

export default App;