import PropTypes from "prop-types";
import { Search, Filter, X, Calendar } from "lucide-react";
import { useState } from "react";

export default function TransactionFilters({
  filters,
  onFilterChange,
  onReset,
  categories,
  methods,
  resultCount,
  totalCount,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  function handleChange(field, value) {
    onFilterChange({ ...filters, [field]: value });
  }

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "searchTerm") return value !== "";
    return value !== "all" && value !== "";
  }).length;

  return (
    <div className="p-6 bg-white border-b border-neutral-200">
      {/* Search and Quick Filters */}
      <div className="flex items-center gap-4 mb-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.searchTerm}
            onChange={(e) => handleChange("searchTerm", e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-neutral-900 bg-white"
          />
        </div>

        {/* Type Filter */}
        <select
          value={filters.type}
          onChange={(e) => handleChange("type", e.target.value)}
          className="px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-neutral-900 font-medium cursor-pointer hover:bg-neutral-50 transition"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* Category Filter */}
        <select
          value={filters.category}
          onChange={(e) => handleChange("category", e.target.value)}
          className="px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-neutral-900 font-medium cursor-pointer hover:bg-neutral-50 transition"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`px-4 py-2.5 rounded-lg flex items-center gap-2 transition font-medium ${
            showAdvanced
              ? "bg-primary-600 text-white hover:bg-primary-700"
              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          }`}
        >
          <Filter size={18} />
          Advanced
          {activeFiltersCount > 0 && (
            <span
              className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                showAdvanced
                  ? "bg-white text-primary-600"
                  : "bg-primary-600 text-white"
              }`}
            >
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Reset Button */}
        {activeFiltersCount > 0 && (
          <button
            onClick={onReset}
            className="px-4 py-2.5 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 flex items-center gap-2 font-medium transition"
          >
            <X size={18} />
            Reset
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-4 gap-4 p-4 bg-neutral-50 rounded-lg">
          {/* Payment Method */}
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">
              Payment Method
            </label>
            <select
              value={filters.method}
              onChange={(e) => handleChange("method", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Methods</option>
              {methods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">
              <Calendar size={14} className="inline mr-1" />
              From Date
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleChange("dateFrom", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">
              <Calendar size={14} className="inline mr-1" />
              To Date
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleChange("dateTo", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Min Amount */}
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">
              Min Amount
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={filters.minAmount}
              onChange={(e) => handleChange("minAmount", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Max Amount */}
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">
              Max Amount
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={filters.maxAmount}
              onChange={(e) => handleChange("maxAmount", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="mt-4 text-sm text-neutral-600">
        Showing{" "}
        <span className="font-semibold text-neutral-900">{resultCount}</span> of{" "}
        <span className="font-semibold text-neutral-900">{totalCount}</span>{" "}
        transactions
      </div>
    </div>
  );
}

TransactionFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  methods: PropTypes.array.isRequired,
  resultCount: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
};
