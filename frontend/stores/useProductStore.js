import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../lib/axios.js";

const FEATURED_PRODUCTS_TTL_MS = 5 * 60 * 1000;

export const useProductStore = create((set, get) => ({
  products: [],
  featuredProducts: [],
  featuredProductsLoadedAt: 0,
  loading: false,
  loadingFeatured: false,
  error: null,

  setProducts: (products) => set({ products }),

  createProduct: async (productData) => {
    set({ loading: true, error: null });

    try {
      const res = await axios.post("/products", productData);
      set((state) => ({
        products: [...state.products, res.data],
        loading: false,
      }));
      toast.success("Product created");
    } catch (error) {
      set({ loading: false, error: error.response?.data?.error || "Failed to create product" });
      toast.error(error.response?.data?.error || "Failed to create product");
    }
  },

  fetchAllProducts: async () => {
    set({ loading: true, error: null });

    try {
      const res = await axios.get("/products");
      set({ products: res.data.products, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response?.data?.error || "Failed to fetch products");
    }
  },

  fetchProductsByCategory: async (category) => {
    set({ loading: true, error: null });

    try {
      const res = await axios.get(`/products/category/${category}`);
      set({ products: res.data.products, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response?.data?.error || "Failed to fetch products");
    }
  },

  deleteProduct: async (productId) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/products/${productId}`);
      set((state) => ({
        products: state.products.filter((product) => product._id !== productId),
        featuredProducts: state.featuredProducts.filter((product) => product._id !== productId),
        loading: false,
      }));
      toast.success("Product removed");
    } catch (error) {
      set({ loading: false, error: "Failed to delete product" });
      toast.error(error.response?.data?.error || "Failed to delete product");
    }
  },

  toggleFeaturedProduct: async (productId) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.patch(`/products/${productId}`);
      set((state) => {
        const updatedProducts = state.products.map((product) =>
          product._id === productId ? { ...product, isFeatured: res.data.isFeatured } : product
        );

        const toggledProduct = updatedProducts.find((product) => product._id === productId);
        const featuredProducts = toggledProduct?.isFeatured
          ? [
              ...state.featuredProducts.filter((product) => product._id !== productId),
              toggledProduct,
            ]
          : state.featuredProducts.filter((product) => product._id !== productId);

        return {
          products: updatedProducts,
          featuredProducts,
          featuredProductsLoadedAt: Date.now(),
          loading: false,
        };
      });
    } catch (error) {
      set({ loading: false, error: "Failed to update product" });
      toast.error(error.response?.data?.error || "Failed to update product");
    }
  },

  fetchFeaturedProducts: async ({ force = false } = {}) => {
    const { featuredProducts, featuredProductsLoadedAt } = get();
    const cacheIsFresh =
      !force &&
      featuredProducts.length > 0 &&
      Date.now() - featuredProductsLoadedAt < FEATURED_PRODUCTS_TTL_MS;

    if (cacheIsFresh) {
      return featuredProducts;
    }

    set({ loadingFeatured: true, error: null });
    try {
      const response = await axios.get("/products/featured");
      set({
        featuredProducts: response.data,
        featuredProductsLoadedAt: Date.now(),
        loadingFeatured: false,
      });
      return response.data;
    } catch (error) {
      set({ error: "Failed to fetch featured products", loadingFeatured: false });
      toast.error(error.response?.data?.error || "Failed to fetch featured products");
      return [];
    }
  },
}));
