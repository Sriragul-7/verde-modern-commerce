import { useState } from "react";
import { ArrowRight, Loader, Lock, Mail, User, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore.js";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { signup, loading } = useUserStore();

  const handleSubmit = (event) => {
    event.preventDefault();
    signup(formData);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
      <section className="space-y-6">
        <span className="pill text-sm uppercase tracking-[0.24em]">New account</span>
        <h1 className="section-title text-white">Create a customer profile that feels native to the storefront.</h1>
        <p className="section-copy max-w-xl text-lg">
          Sign-up now lives in the same visual system as the shopping journey, with stronger spacing, clearer forms, and a more premium first impression.
        </p>
      </section>

      <section className="glass-panel rounded-[2rem] p-6 sm:p-8">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.28em] text-emerald-100/65">Sign up</p>
          <h2 className="mt-2 text-4xl text-white">Create your account</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { key: "name", label: "Full name", type: "text", icon: User, placeholder: "Sri Ragul" },
            { key: "email", label: "Email address", type: "email", icon: Mail, placeholder: "name@example.com" },
            { key: "password", label: "Password", type: "password", icon: Lock, placeholder: "Create a password" },
            {
              key: "confirmPassword",
              label: "Confirm password",
              type: "password",
              icon: Lock,
              placeholder: "Confirm your password",
            },
          ].map((field) => (
            <label className="block space-y-2" key={field.key}>
              <span className="text-sm text-slate-200/80">{field.label}</span>
              <span className="flex items-center gap-3 rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3">
                <field.icon className="size-5 text-emerald-200" />
                <input
                  id={field.key}
                  type={field.type}
                  required
                  value={formData[field.key]}
                  onChange={(event) => setFormData({ ...formData, [field.key]: event.target.value })}
                  className="w-full bg-transparent text-white outline-none placeholder:text-slate-400"
                  placeholder={field.placeholder}
                />
              </span>
            </label>
          ))}

          <button
            type="submit"
            className="w-full rounded-full bg-emerald-300 px-5 py-3 font-medium text-slate-950 transition hover:bg-emerald-200 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader className="size-4 animate-spin" />
                Creating account
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <UserPlus className="size-4" />
                Sign up
              </span>
            )}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-300/80">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-emerald-200 hover:text-emerald-100">
            Login here <ArrowRight className="inline size-4" />
          </Link>
        </p>
      </section>
    </div>
  );
};

export default SignUpPage;
