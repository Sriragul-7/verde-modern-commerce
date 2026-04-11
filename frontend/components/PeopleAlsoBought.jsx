import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProductCard from "./ProductCard";
import axios from "../lib/axios";
import LoadingSpinner from "./LoadingSpinner";

const PeopleAlsoBought = ({
  eyebrow = "You may also like",
  title = "People also bought",
  description = "",
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get("/products/recommended");
        setRecommendations(res.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred while fetching recommendations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (isLoading) {
    return <LoadingSpinner compact label="Finding related picks" />;
  }

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-emerald-100/65">{eyebrow}</p>
        <h3 className="mt-2 text-3xl text-white">{title}</h3>
        {description && <p className="section-copy mt-2 max-w-2xl text-sm">{description}</p>}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {recommendations.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default PeopleAlsoBought;
