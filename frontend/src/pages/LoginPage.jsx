import { useState } from "react";
import { ArrowRight, LogIn, Loader, Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore.js";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useUserStore();

  const handleSubmit = (event) => {
    event.preventDefault();
    login({ email, password });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
      <section className="space-y-6">
        <span className="pill text-sm uppercase tracking-[0.24em]">Member access</span>
        <h1 className="section-title text-white">Step back into your cart, orders, and saved storefront flow.</h1>
        <p className="section-copy max-w-xl text-lg">
          The login experience now matches the rest of the storefront with a stronger visual shell and cleaner focus states.
        </p>
      </section>

      <section className="glass-panel rounded-[2rem] p-6 sm:p-8">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.28em] text-emerald-100/65">Login</p>
          <h2 className="mt-2 text-4xl text-white">Welcome back</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block space-y-2">
            <span className="text-sm text-slate-200/80">Email address</span>
            <span className="flex items-center gap-3 rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3">
              <Mail className="size-5 text-emerald-200" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full bg-transparent text-white outline-none placeholder:text-slate-400"
                placeholder="name@example.com"
              />
            </span>
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-slate-200/80">Password</span>
            <span className="flex items-center gap-3 rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3">
              <Lock className="size-5 text-emerald-200" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full bg-transparent text-white outline-none placeholder:text-slate-400"
                placeholder="Enter your password"
              />
            </span>
          </label>

          <button
            type="submit"
            className="w-full rounded-full bg-emerald-300 px-5 py-3 font-medium text-slate-950 transition hover:bg-emerald-200 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader className="size-4 animate-spin" />
                Signing in
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <LogIn className="size-4" />
                Login
              </span>
            )}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-300/80">
          Not a member yet?{" "}
          <Link to="/signup" className="font-medium text-emerald-200 hover:text-emerald-100">
            Create an account <ArrowRight className="inline size-4" />
          </Link>
        </p>
      </section>
    </div>
  );
};

export default LoginPage;
