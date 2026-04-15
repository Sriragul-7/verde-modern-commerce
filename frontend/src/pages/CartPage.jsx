import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import CartItem from "../components/CartItem";
import PeopleAlsoBought from "../components/PeopleAlsoBought";
import OrderSummary from "../components/OrderSummary";
import GiftCouponCard from "../components/GiftCouponCard";

const CartPage = () => {
  const { cart } = useCartStore();

  return (
    <div className="space-y-8">
      <section className="glass-panel rounded-[2rem] p-8 sm:p-10">
        <p className="text-sm uppercase tracking-[0.28em] text-emerald-100/65">Cart</p>
        <h1 className="mt-3 text-5xl text-white sm:text-6xl">Your bag</h1>
        <p className="section-copy mt-4 max-w-2xl">
          A more premium cart flow with clearer item controls, discount handling, and a cleaner path into checkout.
        </p>
      </section>

      <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-5">
          {cart.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {cart.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}
              <div className="pt-4">
                <PeopleAlsoBought
                  eyebrow="Add something extra"
                  title="Complete your bag"
                  description="A few matching picks that fit naturally at this stage before checkout."
                />
              </div>
            </>
          )}
        </section>

        {cart.length > 0 && (
          <aside className="space-y-5">
            <OrderSummary />
            <GiftCouponCard />
          </aside>
        )}
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="glass-panel flex flex-col items-center justify-center rounded-[2rem] px-6 py-14 text-center">
    <div className="rounded-full bg-white/5 p-5 text-emerald-200">
      <ShoppingCart className="size-12" />
    </div>
    <h2 className="mt-6 text-3xl text-white">Your cart is empty</h2>
    <p className="section-copy mt-3 max-w-md">Start with the featured edit or browse categories to add products and begin checkout.</p>
    <Link
      to="/"
      className="mt-6 rounded-full bg-emerald-300 px-6 py-3 font-medium text-slate-950 transition hover:bg-emerald-200"
    >
      Shop now
    </Link>
  </div>
);

export default CartPage;
