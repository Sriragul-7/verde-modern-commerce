import { RefreshCw, Star, Trash } from "lucide-react";
import { useProductStore } from "../stores/useProductStore.js";
import { formatCurrency } from "../lib/format";

const ProductsList = () => {
  const { deleteProduct, toggleFeaturedProduct, fetchAllProducts, products, loading, error } =
    useProductStore();

  if (loading && products.length === 0) {
    return (
      <section className="glass-panel rounded-[2rem] p-8 text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-emerald-100/65">Inventory</p>
        <h3 className="mt-3 text-3xl text-white">Loading products</h3>
        <p className="section-copy mt-3">Fetching the full catalog for the admin panel.</p>
      </section>
    );
  }

  if (error && products.length === 0) {
    return (
      <section className="glass-panel rounded-[2rem] p-8 text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-rose-200/80">Inventory error</p>
        <h3 className="mt-3 text-3xl text-white">Couldn&apos;t load products</h3>
        <p className="section-copy mt-3">{error}</p>
        <button
          type="button"
          onClick={fetchAllProducts}
          className="mt-6 rounded-full bg-emerald-300 px-5 py-3 font-medium text-slate-950 transition hover:bg-emerald-200"
        >
          <span className="inline-flex items-center gap-2">
            <RefreshCw className="size-4" />
            Try again
          </span>
        </button>
      </section>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <section className="glass-panel rounded-[2rem] p-8 text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-emerald-100/65">Inventory</p>
        <h3 className="mt-3 text-3xl text-white">No products yet</h3>
        <p className="section-copy mt-3">Create a product to start building the catalog.</p>
      </section>
    );
  }

  return (
    <section className="glass-panel overflow-hidden rounded-[2rem]">
      <div className="flex items-center justify-between gap-4 border-b border-white/8 px-6 py-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-emerald-100/65">Inventory</p>
          <h3 className="mt-1 text-2xl text-white">{products.length} products</h3>
        </div>
        <button
          type="button"
          onClick={fetchAllProducts}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
        >
          <span className="inline-flex items-center gap-2">
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.24em] text-emerald-100/65">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Featured</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-t border-white/6">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img
                      className="h-12 w-12 rounded-2xl object-cover"
                      src={product.image}
                      alt={product.name}
                    />
                    <div>
                      <p className="text-white">{product.name}</p>
                      <p className="line-clamp-1 text-sm text-slate-300/70">{product.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-sans text-xl font-semibold tracking-tight text-emerald-200">
                    {formatCurrency(product.price)}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-300/80">{product.category}</td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => toggleFeaturedProduct(product._id)}
                    className={`rounded-full p-2 transition ${
                      product.isFeatured
                        ? "bg-amber-300 text-slate-950"
                        : "border border-white/10 bg-white/5 text-slate-200"
                    }`}
                  >
                    <Star className="size-4" />
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => deleteProduct(product._id)}
                    className="rounded-full border border-rose-300/20 bg-rose-300/10 p-2 text-rose-200 transition hover:bg-rose-300/20"
                  >
                    <Trash className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ProductsList;
