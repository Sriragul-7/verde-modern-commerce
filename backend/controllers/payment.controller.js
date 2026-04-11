import dotenv from "dotenv";
import Coupon from "../models/coupon.model.js";
import stripe from "../lib/stripe.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";

dotenv.config();

const getClientUrl = () => process.env.CLIENT_URI?.split(",")[0]?.trim() || "http://localhost:5173";

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid or empty products" });
    }

    let totalAmount = 0;

    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100);
      totalAmount += amount * (product.quantity || 1);

      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
        quantity: product.quantity || 1,
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
          products.map((product) => ({
            id: product._id,
            quantity: product.quantity,
            price: product.price,
          }))
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
