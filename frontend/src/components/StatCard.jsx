import PropTypes from "prop-types";
import { TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";

export default function StatCard({ title, amount, percentage, trend }) {
  const isPositive = trend === "up";

  return (
    <div className="bg-white rounded-2xl p-6 border border-neutral-200 hover:shadow-md transition">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-neutral-600 text-sm font-medium">{title}</h3>
        <button className="text-neutral-400 hover:text-neutral-600">
          <ArrowUpRight size={18} />
        </button>
      </div>

      <div className="mb-2">
        <span className="text-3xl font-bold text-neutral-900">{amount}</span>
        <span className="text-neutral-300 text-2xl">.00</span>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span
          className={`${
            isPositive ? "text-success-800" : "text-danger-500"
          } font-semibold flex items-center gap-1`}
        >
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {percentage}
        </span>
        <span className="text-neutral-400">vs last month</span>
      </div>
    </div>
  );
}
