import { useEffect, useState } from "react";
import { IndianRupee, Package, ShoppingCart, Users } from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import axios from "../lib/axios";
import LoadingSpinner from "./LoadingSpinner";
import { formatCurrency } from "../lib/format";

const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState({
    users: 0,
    products: 0,
    totalSales: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [dailySalesData, setDailySalesData] = useState([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get("/analytics");
        setAnalyticsData(response.data.analyticsData);
        setDailySalesData(response.data.dailySalesData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner compact label="Loading analytics" />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <AnalyticsCard title="Total users" value={analyticsData.users.toLocaleString()} icon={Users} />
        <AnalyticsCard title="Total products" value={analyticsData.products.toLocaleString()} icon={Package} />
        <AnalyticsCard title="Total sales" value={analyticsData.totalSales.toLocaleString()} icon={ShoppingCart} />
        <AnalyticsCard title="Total revenue" value={formatCurrency(analyticsData.totalRevenue)} icon={IndianRupee} />
      </div>

      <section
        className="glass-panel rounded-[2rem] p-5 sm:p-6"
      >
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.24em] text-emerald-100/65">Performance</p>
          <h3 className="mt-2 text-3xl text-white">7-day sales trend</h3>
        </div>
        <ResponsiveContainer width="100%" height={360}>
          <LineChart data={dailySalesData}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="date" stroke="#d0f7ea" />
            <YAxis yAxisId="left" stroke="#d0f7ea" />
            <YAxis yAxisId="right" orientation="right" stroke="#d0f7ea" />
            <Tooltip
              contentStyle={{
                background: "#0d1d18",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "18px",
              }}
            />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#63f5c7" strokeWidth={3} name="Sales" />
            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#f7c76a" strokeWidth={3} name="Revenue" />
          </LineChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
};

const AnalyticsCard = (props) => (
  <article className="glass-panel relative overflow-hidden rounded-[1.75rem] p-5">
    <p className="text-sm uppercase tracking-[0.24em] text-emerald-100/65">{props.title}</p>
    <p className="mt-3 text-3xl text-white">{props.value}</p>
    <div className="absolute -bottom-4 -right-4 text-emerald-100/10">
      <props.icon className="size-20" />
    </div>
  </article>
);

export default AnalyticsTab;
