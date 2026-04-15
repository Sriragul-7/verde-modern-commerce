import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore } from "../stores/useCartStore.js";
import axios from "../lib/axios.js";
import { formatCurrency } from "../lib/format";

const OrderSummary = () => {
  const { total, subtotal, appliedCoupon, isCouponApplied, cart } = useCartStore();
  const savings = subtotal - total;

  const handlePayment = async () => {
    try {
      const res = await axios.post("/payments/create-checkout-session", {
        products: cart,
        couponCode: isCouponApplied ? appliedCoupon?.code : null,
      });

      if (res.data?.url) {
        window.location.href = res.data.url;
        return;
      }

      toast.error("Failed to start checkout. Please try again.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to start checkout. Please try again.");
    }
  };

  return (
    <section className="glass-panel space-y-5 rounded-[1.75rem] p-5 sm:p-6">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-emerald-100/65">Checkout</p>
        <h2 className="mt-2 text-3xl text-white">Order summary</h2>
      </div>

      <div className="space-y-3 text-sm">
        <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
        {savings > 0 && <SummaryRow label="Savings" value={`-${formatCurrency(savings)}`} accent />}
        {isCouponApplied && appliedCoupon && (
          <SummaryRow
            label={`Coupon (${appliedCoupon.code})`}
            value={`-${appliedCoupon.discountPercentage}%`}
            accent
          />
        )}
        <div className="border-t border-white/10 pt-3">
          <SummaryRow label="Total" value={formatCurrency(total)} strong />
        </div>
      </div>

      <button
        type="button"
        className="w-full rounded-full bg-emerald-300 px-5 py-3 font-medium text-slate-950 transition hover:bg-emerald-200"
        onClick={handlePayment}
      >
        Proceed to checkout
      </button>

      <div className="text-center text-sm text-slate-300/80">
        or{" "}
        <Link to="/" className="font-medium text-emerald-200 hover:text-emerald-100">
          Continue shopping <MoveRight className="inline size-4" />
        </Link>
      </div>
    </section>
  );
};

const SummaryRow = ({ label, value, accent = false, strong = false }) => (
  <div className="flex items-center justify-between gap-4">
    <span className={strong ? "text-base text-white" : "text-slate-300/80"}>{label}</span>
    <span
      className={
        strong
          ? "font-sans text-2xl font-semibold tracking-tight text-white"
          : accent
            ? "font-sans text-xl font-semibold tracking-tight text-emerald-200"
            : "font-sans text-xl font-semibold tracking-tight text-slate-100"
      }
    >
      {value}
    </span>
  </div>
);

export default OrderSummary;
