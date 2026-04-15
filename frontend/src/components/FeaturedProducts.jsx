import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore.js";
import { formatCurrency } from "../lib/format";

const FeaturedProducts = ({ featuredProducts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const { addToCart } = useCartStore();
  const { user } = useUserStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else if (window.innerWidth < 1280) setItemsPerPage(3);
      else setItemsPerPage(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(featuredProducts.length - itemsPerPage, 0);

  const handleAddToCart = (product) => {
    if (!user) {
      toast.error("Please login to add products to cart", { id: "login" });
      return;
    }

    addToCart(product);
  };

  return (
    <section className="glass-panel rounded-[2rem] px-5 py-8 sm:px-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-emerald-100/65">Featured</p>
          <h2 className="text-4xl text-white">Current demand</h2>
        </div>
        <p className="max-w-xl text-sm text-slate-300/75">
          A streamlined carousel for your promoted products, with cleaner pricing and stronger purchase calls.
        </p>
      </div>

      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
          >
            {featuredProducts.map((product) => (
              <div
                key={product._id}
                className="w-full shrink-0 px-3 sm:w-1/2 lg:w-1/3 xl:w-1/4"
              >
                <article className="h-full rounded-[1.75rem] border border-white/10 bg-white/5 p-3 transition hover:-translate-y-1 hover:border-emerald-200/25">
                  <div className="overflow-hidden rounded-[1.25rem]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-64 w-full object-cover transition duration-700 hover:scale-105"
                    />
                  </div>
                  <div className="space-y-3 p-3">
                    <p className="text-xs uppercase tracking-[0.28em] text-emerald-100/65">
                      Featured product
                    </p>
                    <h3 className="text-xl text-white">{product.name}</h3>
                    <p className="font-sans text-3xl font-semibold tracking-tight text-emerald-200">
                      {formatCurrency(product.price)}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="w-full rounded-full bg-emerald-300 px-4 py-3 text-sm font-medium text-slate-950 transition hover:bg-emerald-200"
                    >
                      <span className="inline-flex items-center gap-2">
                        <ShoppingCart className="size-4" />
                        Add to cart
                      </span>
                    </button>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setCurrentIndex((index) => Math.max(index - 1, 0))}
            disabled={currentIndex === 0}
            className="rounded-full border border-white/10 bg-white/5 p-3 text-white transition disabled:opacity-40"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentIndex((index) => Math.min(index + 1, maxIndex))}
            disabled={currentIndex >= maxIndex}
            className="rounded-full border border-white/10 bg-white/5 p-3 text-white transition disabled:opacity-40"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
