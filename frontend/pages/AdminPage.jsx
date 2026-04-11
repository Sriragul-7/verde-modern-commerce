import { useEffect, useState } from "react";
import { BarChart3, PlusCircle, ShoppingBag } from "lucide-react";
import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import AnalyticsTab from "../components/AnalyticsTab";
import { useProductStore } from "../stores/useProductStore";

const tabs = [
  { id: "create", label: "Create Product", icon: PlusCircle },
  { id: "products", label: "Products", icon: ShoppingBag },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("create");
  const { fetchAllProducts } = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  useEffect(() => {
    if (activeTab === "products") {
      fetchAllProducts();
    }
  }, [activeTab, fetchAllProducts]);

  return (
    <div className="space-y-8">
  
      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-full px-5 py-3 text-sm transition ${
              activeTab === tab.id
                ? "bg-emerald-300 text-slate-950"
                : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <tab.icon className="size-4" />
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      <section>
        {activeTab === "create" && <CreateProductForm />}
        {activeTab === "products" && <ProductsList />}
        {activeTab === "analytics" && <AnalyticsTab />}
      </section>
    </div>
  );
};

export default AdminPage;
