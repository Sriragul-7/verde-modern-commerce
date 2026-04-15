import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const CategoryItem = ({ category }) => {
  return (
    <Link
      to={`/category${category.href}`}
      className="group relative block min-h-80 overflow-hidden rounded-[2rem] border border-white/10 bg-black/20"
    >
      <img
        src={category.imageUrl}
        alt={category.name}
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#06100d] via-[#06100d]/30 to-transparent" />
      <div className="relative flex h-full min-h-80 flex-col justify-end p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-emerald-100/70">Collection</p>
            <h3 className="text-3xl text-white">{category.name}</h3>
            <p className="mt-2 text-sm text-emerald-50/80">Explore clean silhouettes and best sellers.</p>
          </div>
          <div className="rounded-full border border-white/15 bg-white/10 p-3 text-white transition group-hover:bg-emerald-300 group-hover:text-slate-950">
            <ArrowUpRight className="size-5" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryItem;
