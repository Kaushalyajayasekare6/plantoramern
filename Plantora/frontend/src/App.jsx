import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Cart from "./pages/Cart/Cart";
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import ContactUs from './pages/Contact/contactUs';
import ProductOverView from './pages/ProductOverView/ProductOverView';
import AdminPage from './pages/adminpage';
import HomePage from './pages/Home/HomePage';
import ProductsPage from "./pages/Products/ProductsPage";
import CheckoutPage from "./pages/Checkout/CheckoutPage";
import { CartProvider } from "./context/CartContext";
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';

import 'react-toastify/dist/ReactToastify.css';

// Component to check auth for protected routes
const AuthCheck = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/contactUs" element={<ContactUs/>} />
          
          {/* Updated route to accept productId */}
          <Route path="/productoverview/:productId" element={<ProductOverView/>} />
          
          <Route path="/admin/*" element={
            <AuthCheck>
              <AdminPage/>
            </AuthCheck>
          } />
          
          <Route path="/home" element={<HomePage/>} />
          <Route path="/products" element={<ProductsPage/>} />
          
          {/* Protected routes */}
          <Route path="/cart" element={
            <AuthCheck>
              <Cart />
            </AuthCheck>
          } />
          
          <Route path="/checkout" element={
            <AuthCheck>
              <CheckoutPage />
            </AuthCheck>
          } />

          {/* Default redirect if path invalid */}
          <Route path="/productoverview/*" element={<Navigate to="/products" replace />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;