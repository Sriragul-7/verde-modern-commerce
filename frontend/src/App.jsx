import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { lazy, Suspense, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import { useUserStore } from "./stores/useUserStore.js";
import { useCartStore } from "./stores/useCartStore.js";

const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const SignUpPage = lazy(() => import("./pages/SignUpPage.jsx"));
const AdminPage = lazy(() => import("./pages/AdminPage.jsx"));
const CategoryPage = lazy(() => import("./pages/CategoryPage.jsx"));
const CartPage = lazy(() => import("./pages/CartPage.jsx"));
const PurchaseSuccessPage = lazy(() => import("./pages/CheckoutSuccessPage.jsx"));
const PurchaseCancelPage = lazy(() => import("./pages/PurchaseCancelPage.jsx"));

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
        <Suspense fallback={<LoadingSpinner label="Loading page" />}>
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
        </Suspense>
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
