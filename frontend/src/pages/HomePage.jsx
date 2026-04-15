import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem.jsx";
import { useProductStore } from "../stores/useProductStore.js";
import FeaturedProducts from "../components/FeaturedProducts.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const categories = [
  { href: "/t-shirts", name: "T-shirts", imageUrl: "/tshirts.jpg" },
  { href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
  { href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
  { href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
  { href: "/watches", name: "Watches", imageUrl: "/watches.jpg" },
  { href: "/glasses", name: "Glasses", imageUrl: "/glasses.png" },
];

const HomePage = () => {
  const { loadingFeatured, featuredProducts, fetchFeaturedProducts } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <div className="relative -mt-8 min-h-screen overflow-hidden text-white sm:-mt-10">
      <div className="relative mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <h1 className="mb-4 text-center text-4xl font-bold text-emerald-400">
          Explore Our Categories
        </h1>
        <p className="mx-auto mb-10 max-w-3xl text-center text-xl text-gray-300">
          Discover the latest trends in eco-friendly fashion.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>

        <section className="mt-10">
          {loadingFeatured && featuredProducts.length === 0 ? (
            <LoadingSpinner compact label="Loading on demand from redis" />
          ) : featuredProducts.length > 0 ? (
            <FeaturedProducts featuredProducts={featuredProducts} />
          ) : (
            <div className="glass-panel rounded-[2rem] px-6 py-8 text-center">
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-100/65">
                Featured
              </p>
              <h2 className="mt-2 text-3xl text-white">No featured products yet</h2>
              <p className="mt-3 text-slate-300/75">
                Mark products as featured from the admin dashboard to show them here.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
