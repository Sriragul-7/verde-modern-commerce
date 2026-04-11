import Stripe from "stripe";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "..", "..", ".env"), quiet: true });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default stripe;
