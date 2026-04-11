import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import AdminPage from "../pages/AdminPage.jsx";
import CategoryPage from "../pages/CategoryPage.jsx";
import CartPage from "../pages/CartPage.jsx";
import PurchaseSuccessPage from "../pages/PurchaseSuccessPAge.jsx";
import PurchaseCancelPage from "../pages/PurchaseCancelPage.jsx";
import { useUserStore } from "../stores/useUserStore.js";
import { useCartStore } from "../stores/useCartStore.js";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems } = useCartStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!user || window.location.pathname === "/purchase-success") {
      return;
    }

    const timer = setTimeout(() => {
      getCartItems();
    }, 300);

    return () => clearTimeout(timer);
  }, [getCartItems, user]);

  if (checkingAuth) {
    return <LoadingSpinner label="Preparing your storefront" />;
  }

  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-wrap">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/" replace />} />
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" replace />} />
          <Route
            path="/secret-dashboard"
            element={user?.role === "admin" ? <AdminPage /> : <Navigate to="/login" replace />}
          />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/login" replace />} />
          <Route
            path="/purchase-success"
            element={user ? <PurchaseSuccessPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/purchase-cancel"
            element={user ? <PurchaseCancelPage /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0f201a",
            color: "#effaf6",
            border: "1px solid rgba(160,255,223,0.14)",
          },
        }}
      />
    </div>
  );
}

export default App;
