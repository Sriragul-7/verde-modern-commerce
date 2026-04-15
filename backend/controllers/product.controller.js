import redis from "../lib/redis.js";
import Product from "../models/product.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllProducts = async (_req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ products });
  } catch (error) {
    console.log("Error fetching all products", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getFeaturedProducts = async (_req, res) => {
  try {
    let featuredProducts = null;

    try {
      const cachedFeaturedProducts = await redis.get("featured_products");
      featuredProducts = normalizeFeaturedProductsCache(cachedFeaturedProducts);
    } catch (redisError) {
      console.log("Redis get failed, using database only:", redisError?.message);
    }

    if (featuredProducts) {
      return res.json(featuredProducts);
    }

    featuredProducts = await Product.find({ isFeatured: true }).lean();

    if (featuredProducts.length === 0) {
      return res.status(200).json([]);
    }

    try {
      await redis.set("featured_products", featuredProducts);
    } catch (redisError) {
      console.log("Redis set failed, skipping cache:", redisError?.message);
    }

    return res.json(featuredProducts);
  } catch (error) {
    try {
      await redis.del("featured_products");
    } catch {
      // cache cleanup is best effort
    }
    console.log("Error in getFeaturedProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, isFeatured, category } = req.body;
    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      isFeatured,
      image: cloudinaryResponse?.secure_url || "",
      category,
    });

    res.status(200).json(product);
  } catch (error) {
    console.log("Error in createProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
      } catch (error) {
        console.log("Error deleting image from Cloudinary", error.message);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    await updateFeaturedProductsCache();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error in deleteProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getRecommendedProducts = async (_req, res) => {
  try {
    const products = await Product.aggregate([
      { $sample: { size: 4 } },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
          category: 1,
        },
      },
    ]);

    res.json(products);
  } catch (error) {
    console.log("Error in getRecommendedProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const products = await Product.find({ category });
    res.json({ products });
  } catch (error) {
    console.log("Error in getProductsByCategory controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isFeatured = !product.isFeatured;
    const updatedProduct = await product.save();
    await updateFeaturedProductsCache();

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error in toggleFeaturedProduct controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

async function updateFeaturedProductsCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", featuredProducts);
  } catch (error) {
    console.log("Error updating featured products cache", error.message);
  }
}

function normalizeFeaturedProductsCache(value) {
  if (!value) {
    return null;
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    return JSON.parse(value);
  }

  if (typeof value === "object") {
    return value;
  }

  return null;
}
