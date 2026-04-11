import { useState } from "react";
import { Loader, PlusCircle, Upload } from "lucide-react";
import { useProductStore } from "../stores/useProductStore.js";

const categories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "watches", "bags"];

const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });
  const { createProduct, loading } = useProductStore();

  const handleSubmit = async (event) => {
    event.preventDefault();
    await createProduct(newProduct);
    setNewProduct({ name: "", description: "", price: "", category: "", image: "" });
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setNewProduct({ ...newProduct, image: reader.result });
    reader.readAsDataURL(file);
  };

  return (
    <section className="glass-panel mx-auto max-w-3xl rounded-[2rem] p-6 sm:p-8">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.24em] text-emerald-100/65">Inventory</p>
        <h2 className="mt-2 text-3xl text-white">Create new product</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Product name">
          <input
            type="text"
            required
            value={newProduct.name}
            onChange={(event) => setNewProduct({ ...newProduct, name: event.target.value })}
            className="w-full rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
          />
        </Field>

        <Field label="Price">
          <input
            type="number"
            required
            value={newProduct.price}
            onChange={(event) => setNewProduct({ ...newProduct, price: event.target.value })}
            className="w-full rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
          />
        </Field>

        <Field label="Category">
          <select
            value={newProduct.category}
            onChange={(event) => setNewProduct({ ...newProduct, category: event.target.value })}
            className="w-full rounded-[1.25rem] border border-white/10 bg-[#0d1d18] px-4 py-3 text-white outline-none"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Product image">
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-[1.25rem] border border-dashed border-white/15 bg-white/5 px-4 py-3 text-white transition hover:bg-white/10">
            <Upload className="size-4" />
            {newProduct.image ? "Image selected" : "Upload image"}
            <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
          </label>
        </Field>

        <Field label="Description" className="sm:col-span-2">
          <textarea
            required
            value={newProduct.description}
            onChange={(event) => setNewProduct({ ...newProduct, description: event.target.value })}
            className="min-h-32 w-full rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
          />
        </Field>

        <button
          type="submit"
          className="sm:col-span-2 w-full rounded-full bg-emerald-300 px-5 py-3 font-medium text-slate-950 transition hover:bg-emerald-200 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader className="size-4 animate-spin" />
              Saving
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <PlusCircle className="size-4" />
              Create product
            </span>
          )}
        </button>
      </form>
    </section>
  );
};

const Field = ({ label, className = "", children }) => (
  <label className={`block space-y-2 ${className}`}>
    <span className="text-sm text-slate-200/80">{label}</span>
    {children}
  </label>
);

export default CreateProductForm;
