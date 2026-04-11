import { Link, NavLink } from "react-router-dom";
import { LogIn, LogOut, Lock, ShoppingBag, ShoppingCart, UserPlus } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const Navbar = () => {
  const { user, logout } = useUserStore();
  const { cart } = useCartStore();
  const isAdmin = user?.role === "admin";

  const linkClassName = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm transition ${
      isActive
        ? "bg-white/10 text-emerald-200"
        : "text-slate-200/90 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#081410]/80 backdrop-blur-2xl">
      <div className="mx-auto flex w-[min(1180px,calc(100%-1rem))] items-center justify-between gap-4 py-4">
        <Link to="/" className="group flex items-center gap-3">
          <div className="rounded-2xl border border-white/10 bg-emerald-300/10 p-3 text-emerald-200 shadow-lg shadow-emerald-950/30">
            <ShoppingBag className="size-5" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-[0.18em] text-white">VERDE</p>
            <p className="text-xs uppercase tracking-[0.42em] text-emerald-200/70">
              Modern Commerce
            </p>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-2">
          <NavLink to="/" className={linkClassName}>
            Home
          </NavLink>

          {user && (
            <NavLink to="/cart" className={linkClassName}>
              <span className="inline-flex items-center gap-2">
                <ShoppingCart className="size-4" />
                Cart
                {cart.length > 0 && (
                  <span className="rounded-full bg-emerald-300 px-2 py-0.5 text-xs font-semibold text-slate-950">
                    {cart.length}
                  </span>
                )}
              </span>
            </NavLink>
          )}

          {isAdmin && (
            <NavLink to="/secret-dashboard" className={linkClassName}>
              <span className="inline-flex items-center gap-2">
                <Lock className="size-4" />
                Dashboard
              </span>
            </NavLink>
          )}

          {user ? (
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
            >
              <span className="inline-flex items-center gap-2">
                <LogOut className="size-4" />
                Log out
              </span>
            </button>
          ) : (
            <>
              <Link
                to="/signup"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
              >
                <span className="inline-flex items-center gap-2">
                  <UserPlus className="size-4" />
                  Sign up
                </span>
              </Link>
              <Link
                to="/login"
                className="rounded-full bg-emerald-300 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-200"
              >
                <span className="inline-flex items-center gap-2">
                  <LogIn className="size-4" />
                  Login
                </span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
