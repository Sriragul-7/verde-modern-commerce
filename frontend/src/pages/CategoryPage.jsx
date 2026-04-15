import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useProductStore } from "../stores/useProductStore.js";
import { formatCategoryLabel } from "../lib/format";

const CategoryPage = () => {
  const { fetchProductsByCategory, products, loading } = useProductStore();
  const { category } = useParams();

  useEffect(() => {
    fetchProductsByCategory(category);
  }, [fetchProductsByCategory, category]);

  const categoryLabel = formatCategoryLabel(category);

  return (
    <div className="space-y-8">
      <section className="glass-panel rounded-[2rem] p-8 sm:p-10">
        <p className="text-sm uppercase tracking-[0.28em] text-emerald-100/65">Category</p>
        <h1 className="mt-3 text-5xl text-white sm:text-6xl">{categoryLabel}</h1>
        <p className="section-copy mt-4 max-w-2xl">
          Products in this route now sit inside the same premium system as the homepage, with more breathing room and cleaner product presentation.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {!loading && products?.length === 0 && (
          <div className="glass-panel col-span-full rounded-[2rem] p-10 text-center">
            <h2 className="text-3xl text-white">No products found</h2>
            <p className="section-copy mt-3">This category is ready for merchandising once products are added.</p>
          </div>
        )}

        {products?.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </section>
    </div>
  );
};

export default CategoryPage;
