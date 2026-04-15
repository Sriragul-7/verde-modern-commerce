import { ArrowLeft, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

const PurchaseCancelPage = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <section className="glass-panel w-full max-w-2xl rounded-[2rem] p-8 text-center sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-300/10 text-rose-200">
          <XCircle className="size-10" />
        </div>
        <p className="mt-6 text-sm uppercase tracking-[0.28em] text-rose-100/70">Checkout interrupted</p>
        <h1 className="mt-3 text-4xl text-white sm:text-5xl">Purchase cancelled</h1>
        <p className="section-copy mx-auto mt-4 max-w-xl">
          No charges were made. If something felt off in checkout, the storefront is still ready for another attempt.
        </p>

        <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm text-slate-300/80">
          Need help? Review Stripe configuration, callback URLs, and auth cookies before the next checkout attempt.
        </div>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white transition hover:bg-white/10"
        >
          <ArrowLeft className="size-4" />
          Return to shop
        </Link>
      </section>
    </div>
  );
};

export default PurchaseCancelPage;
