import dotenv from "dotenv";
import Coupon from "../models/coupon.model.js";
import stripe from "../lib/stripe.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";

dotenv.config();

const getClientUrl = () => process.env.CLIENT_URI?.split(",")[0]?.trim() || "http://localhost:5173";

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid or empty products" });
    }

    const normalizedCartItems = normalizeCartItems(products);

    if (normalizedCartItems.length === 0) {
      return res.status(400).json({ error: "Cart items are invalid" });
    }

    const productIds = normalizedCartItems.map((product) => product.productId);
    const dbProducts = await Product.find({ _id: { $in: productIds } }).lean();
    const productsById = new Map(dbProducts.map((product) => [product._id.toString(), product]));

    if (dbProducts.length !== normalizedCartItems.length) {
      return res.status(400).json({ error: "One or more products no longer exist" });
    }

    let totalAmount = 0;

    const lineItems = normalizedCartItems.map(({ productId, quantity }) => {
      const product = productsById.get(productId);
      const amount = Math.round(product.price * 100);
      totalAmount += amount * quantity;

      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: product.name,
            images: product.image ? [product.image] : [],
          },
          unit_amount: amount,
        },
        quantity,
      };
    });

    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });

      if (coupon) {
        totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
      }
    }

    const clientUrl = getClientUrl();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${clientUrl}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/purchase-cancel`,
      discounts: coupon
        ? [
            {
              coupon: await createStripeCoupon(coupon.discountPercentage),
            },
          ]
        : [],
      metadata: {
        userId: req.user._id.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          normalizedCartItems.map(({ productId, quantity }) => {
            const product = productsById.get(productId);

            return {
              id: product._id,
              quantity,
              price: product.price,
            };
          })
        ),
      },
    });

    if (totalAmount >= 200000) {
      await createNewCoupon(req.user._id);
    }

    res.status(200).json({ id: session.id, url: session.url, totalAmount: totalAmount / 100 });
  } catch (error) {
    console.log("Error in createCheckoutSession controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: "Missing session_id" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const metadata = session.metadata || {};

    if (session.payment_status !== "paid") {
      return res.status(400).json({ success: false, message: "Payment not completed yet." });
    }

    const userId = metadata.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID missing from session metadata." });
    }

    if (userId !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "This checkout session does not belong to the current user." });
    }

    const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
    if (existingOrder) {
      await User.findByIdAndUpdate(userId, { $set: { cartItems: [] } });
      return res.status(200).json({
        success: true,
        message: "Order already processed.",
        orderId: existingOrder._id,
      });
    }

    if (metadata.couponCode) {
      await Coupon.findOneAndUpdate(
        { code: metadata.couponCode, userId },
        { isActive: false }
      );
    }

    const products = JSON.parse(metadata.products || "[]");

    const newOrder = new Order({
      user: userId,
      products: products.map((product) => ({
        product: product.id,
        quantity: product.quantity,
        price: product.price,
      })),
      totalAmount: (session.amount_total || 0) / 100,
      stripeSessionId: sessionId,
    });

    await newOrder.save();
    await User.findByIdAndUpdate(userId, { $set: { cartItems: [] } }, { new: true });

    res.status(200).json({
      success: true,
      message: "Payment successful and order created.",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.log("Error processing successful checkout", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });

  return coupon.id;
}

async function createNewCoupon(userId) {
  await Coupon.findOneAndDelete({ userId });

  const newCoupon = new Coupon({
    code: `GIFT${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    userId,
  });

  await newCoupon.save();
  return newCoupon;
}

function normalizeCartItems(products) {
  return products
    .map((product) => ({
      productId: product?._id?.toString?.() || "",
      quantity: Number(product?.quantity) || 0,
    }))
    .filter((product) => product.productId && Number.isInteger(product.quantity) && product.quantity > 0);
}
