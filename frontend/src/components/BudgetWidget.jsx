import PropTypes from "prop-types";
import { ArrowUpRight } from "lucide-react";

export default function BudgetWidget({ spent, total, categories }) {
  const percentage = (spent / total) * 100;

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Budget</h2>
        <button className="text-neutral-400 hover:text-neutral-600">
          <ArrowUpRight size={18} />
        </button>
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className="relative w-40 h-40">
          <svg className="transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#F0EFF1"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#8470FF"
              strokeWidth="8"
              strokeDasharray={`${percentage * 2.51} 251`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-xs text-neutral-500">Remaining</span>
            <span className="text-2xl font-bold text-neutral-900">
              ${Math.round(total - spent)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {categories.map((cat, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: cat.color }}
              ></div>
              <span className="text-neutral-600">{cat.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
