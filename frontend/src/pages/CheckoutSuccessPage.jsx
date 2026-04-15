import { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import toast from "react-hot-toast";
import { ArrowRight, CheckCircle2, HeartHandshake } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "../lib/axios.js";
import { useCartStore } from "../stores/useCartStore";

const CheckoutSuccessPage = () => {
  const { clearCart, getCartItems } = useCartStore();
  const hasProcessed = useRef(false);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const sessionId =
      searchParams.get("session_id") ||
      searchParams.get("sessionId") ||
      searchParams.get("CHECKOUT_SESSION_ID");

    if (!sessionId || hasProcessed.current) {
      if (!sessionId) {
        toast.error("No session ID found. Please confirm the order from your email if payment already completed.");
      }
      return;
    }

    hasProcessed.current = true;

    const handleCheckoutSuccess = async () => {
      try {
        const response = await axios.post("/payments/checkout-success", { sessionId });
        if (response.data?.success) {
          clearCart();
          await getCartItems();
          toast.success("Order confirmed");
        } else {
          toast.error("Order confirmation incomplete. Please contact support.");
        }
      } catch (error) {
        clearCart();
        toast.error(error.response?.data?.message || "Could not complete order confirmation.");
      }
    };

    handleCheckoutSuccess();

    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, [clearCart, getCartItems]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          gravity={0.12}
          recycle={false}
          numberOfPieces={320}
        />
      )}

      <section className="glass-panel relative w-full max-w-2xl rounded-[2rem] p-8 text-center sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-300/10 text-emerald-200">
          <CheckCircle2 className="size-10" />
        </div>
        <p className="mt-6 text-sm uppercase tracking-[0.28em] text-emerald-100/65">Order placed</p>
        <h1 className="mt-3 text-4xl text-white sm:text-5xl">Purchase successful</h1>
        <p className="section-copy mx-auto mt-4 max-w-xl">
          Payment is confirmed and your order has been recorded. The cart state is cleared and synced back to the storefront.
        </p>

        <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-left">
          <div className="flex items-center justify-between gap-4 py-2">
            <span className="text-slate-300/80">Order status</span>
            <span className="text-emerald-200">Confirmed</span>
          </div>
          <div className="flex items-center justify-between gap-4 py-2">
            <span className="text-slate-300/80">Delivery estimate</span>
            <span className="text-white">2 to 3 business days</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <div className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white">
            <span className="inline-flex items-center gap-2">
              <HeartHandshake className="size-4" />
              Thanks for shopping with us
            </span>
          </div>
          <Link
            to="/"
            className="rounded-full bg-emerald-300 px-5 py-3 font-medium text-slate-950 transition hover:bg-emerald-200"
          >
            <span className="inline-flex items-center gap-2">
              Continue shopping
              <ArrowRight className="size-4" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CheckoutSuccessPage;
