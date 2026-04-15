import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "../stores/useCartStore.js";
import { formatCurrency } from "../lib/format";

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCartStore();

  return (
    <article className="glass-panel rounded-[1.75rem] p-4 sm:p-5">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <img className="h-24 w-24 rounded-[1.25rem] object-cover sm:h-28 sm:w-28" src={item.image} alt={item.name} />
          <div className="space-y-2">
            <p className="text-xl text-white">{item.name}</p>
            <p className="text-sm text-slate-300/75">{item.description}</p>
            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm text-rose-300 transition hover:text-rose-200"
              onClick={() => removeFromCart(item._id)}
            >
              <Trash className="size-4" />
              Remove
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 md:justify-end">
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2">
            <button type="button" onClick={() => updateQuantity(item._id, item.quantity - 1)} className="text-white">
              <Minus className="size-4" />
            </button>
            <span className="min-w-6 text-center text-white">{item.quantity}</span>
            <button type="button" onClick={() => updateQuantity(item._id, item.quantity + 1)} className="text-white">
              <Plus className="size-4" />
            </button>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/65">Item total</p>
            <p className="font-sans text-3xl font-semibold tracking-tight text-emerald-200">
              {formatCurrency(item.price * item.quantity)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CartItem;
