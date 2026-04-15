import toast from "react-hot-toast";
import { ShoppingCartIcon } from "lucide-react";
import { useUserStore } from "../stores/useUserStore.js";
import { useCartStore } from "../stores/useCartStore";
import { formatCurrency } from "../lib/format";

const ProductCard = ({ product }) => {
  const { user } = useUserStore();
  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add products to cart", { id: "login" });
      return;
    }

    addToCart(product);
  };

  return (
    <article className="glass-panel flex h-full w-full flex-col overflow-hidden rounded-[1.75rem] p-3 transition hover:-translate-y-1">
      <div className="overflow-hidden rounded-[1.25rem]">
        <img className="h-64 w-full object-cover transition duration-700 hover:scale-105" src={product.image} alt={product.name} />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3">
        <p className="text-xs uppercase tracking-[0.28em] text-emerald-100/65">{product.category || "Store item"}</p>
        <h3 className="text-2xl text-white">{product.name}</h3>
        <p className="flex-1 text-sm text-slate-300/75">{product.description}</p>
        <div className="flex items-center justify-between gap-3">
          <span className="font-sans text-3xl font-semibold tracking-tight text-emerald-200">
            {formatCurrency(product.price)}
          </span>
          <button
            type="button"
            className="rounded-full bg-emerald-300 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-200"
            onClick={handleAddToCart}
          >
            <span className="inline-flex items-center gap-2">
              <ShoppingCartIcon size={18} />
              Add
            </span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
