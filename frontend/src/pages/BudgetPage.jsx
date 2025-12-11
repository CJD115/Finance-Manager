import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import API from "../api.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import EmptyState from "../components/EmptyState.jsx";
import {
  RefreshCw,
  PiggyBank,
  ShoppingBag,
  Car,
  Film,
  Activity,
  Lightbulb,
  CreditCard,
} from "lucide-react";

/**
 * Budget page for managing spending limits by category
 */
export default function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState({
    totalBudget: 0,
    totalSpent: 0,
    remaining: 0,
  });
  const [topExpenses, setTopExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("This month");

  async function fetchBudgets() {
    try {
      const res = await API.get("/budgets");
      setBudgets(res.data);
    } catch (err) {
      console.error("Fetch budgets error:", err);
    }
  }

  async function fetchSummary() {
    try {
      const res = await API.get("/budgets/summary");
      setSummary(res.data);
    } catch (err) {
      console.error("Fetch summary error:", err);
    }
  }

  async function fetchTopExpenses() {
    try {
      const res = await API.get("/budgets/top-expenses");
      setTopExpenses(res.data);
    } catch (err) {
      console.error("Fetch top expenses error:", err);
    }
  }

  const fetchData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchBudgets(), fetchSummary(), fetchTopExpenses()]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleSubmitBudget(formData) {
    try {
      if (editingBudget) {
        await API.put(`/budgets/${editingBudget._id}`, formData);
      } else {
        await API.post("/budgets", formData);
      }
      await fetchData();
      handleCloseModal();
    } catch (err) {
      console.error("Submit error:", err);
      alert(`Error: ${err.response?.data?.message || err.message}`);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this budget?")) return;
    try {
      await API.delete(`/budgets/${id}`);
      fetchData();
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  async function handleSync() {
    try {
      await API.post("/budgets/sync");
      await fetchData();
    } catch (err) {
      console.error("Sync error:", err);
    }
  }

  function handleOpenCreate() {
    setEditingBudget(null);
    setIsModalOpen(true);
  }

  function handleEdit(budget) {
    setEditingBudget(budget);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setEditingBudget(null);
  }

  if (loading) {
    return <LoadingSpinner message="Loading budgets..." />;
  }

  return (
    <div className="bg-white min-h-full p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-neutral-900">Budget</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Creating and manage your budgets
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
        >
          + Add new budget
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm"
        >
          <option>This month</option>
          <option>Last month</option>
          <option>This year</option>
        </select>
        <select className="px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm">
          <option>Amount</option>
          <option>Category</option>
          <option>Status</option>
        </select>
        <select className="px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm">
          <option>Sort by: Default</option>
          <option>Sort by: Amount</option>
          <option>Sort by: Spent</option>
        </select>
        <button
          onClick={handleSync}
          className="px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm hover:bg-neutral-100 flex items-center gap-2"
        >
          <RefreshCw size={16} /> Sync
        </button>
        <button className="ml-auto px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg text-sm">
          Reset all
        </button>
      </div>

      {budgets.length === 0 ? (
        <EmptyState
          icon="💰"
          title="You haven't created any budgets yet"
          message="Start managing your spending by creating budget limits for different categories"
          actionLabel="Add new budget"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Budget Cards */}
          <div className="col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {budgets.map((budget) => (
                <BudgetCard
                  key={budget._id}
                  budget={budget}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>

          {/* Right Column - Summary Cards */}
          <div className="space-y-6">
            {/* Monthly Budget Summary */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-neutral-900">
                  Monthly budget
                </h3>
                <span className="text-xs text-neutral-500">⋮</span>
              </div>

              <div className="mb-4">
                <div className="text-3xl font-bold text-neutral-900 mb-1">
                  ${summary.totalBudget.toLocaleString()}
                </div>
                <div className="text-sm text-success-800 flex items-center gap-1">
                  ✓ On track
                </div>
              </div>

              {/* Donut Chart */}
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-40 h-40">
                  <svg className="transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#F0EFF1"
                      strokeWidth="12"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#8470FF"
                      strokeWidth="12"
                      strokeDasharray={`${
                        (summary.totalSpent / summary.totalBudget) * 251
                      } 251`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-bold text-neutral-900">
                      ${summary.totalSpent.toLocaleString()}
                    </span>
                    <span className="text-xs text-neutral-500">
                      of ${summary.totalBudget.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center text-sm text-neutral-600">
                You've spent{" "}
                {summary.totalBudget > 0
                  ? ((summary.totalSpent / summary.totalBudget) * 100).toFixed(
                      0
                    )
                  : 0}
                % of your budget
              </div>
            </div>

            {/* Most Expenses */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-neutral-900">
                  Most expenses
                </h3>
                <select className="text-xs text-neutral-500 bg-transparent border-none">
                  <option>This month</option>
                  <option>Last month</option>
                </select>
              </div>

              <div className="space-y-3">
                {topExpenses.map((expense, i) => (
                  <ExpenseItem key={i} expense={expense} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <BudgetModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitBudget}
          initialData={editingBudget}
        />
      )}
    </div>
  );
}

// Budget card component
function BudgetCard({ budget, onEdit, onDelete }) {
  const percentage = Math.min((budget.spent / budget.amount) * 100, 100);
  const remaining = budget.amount - budget.spent;
  const statusColors = {
    "on track": {
      stroke: "#34A853",
      bg: "bg-success-200",
      text: "text-success-800",
    },
    "near limit": {
      stroke: "#F9970C",
      bg: "bg-warning-200",
      text: "text-warning-500",
    },
    "over budget": {
      stroke: "#E83B38",
      bg: "bg-danger-200",
      text: "text-danger-500",
    },
  };
  const colors = statusColors[budget.status] || statusColors["on track"];

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-semibold text-neutral-900">{budget.category}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(budget)}
            className="text-neutral-400 hover:text-neutral-600"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(budget._id)}
            className="text-neutral-400 hover:text-red-600"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Donut Chart */}
      <div className="flex items-center justify-center mb-4">
        <div className="relative w-32 h-32">
          <svg className="transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="#F0EFF1"
              strokeWidth="10"
            />
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke={colors.stroke}
              strokeWidth="10"
              strokeDasharray={`${percentage * 2.2} 220`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-lg font-bold text-neutral-900">
              ${budget.spent}
            </span>
            <span className="text-xs text-neutral-400">/ ${budget.amount}</span>
          </div>
        </div>
      </div>

      <div
        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text} mb-2`}
      >
        ✓ {budget.status}
      </div>

      {remaining > 0 && (
        <p className="text-xs text-neutral-500">
          ${remaining.toLocaleString()} left to spend
        </p>
      )}
    </div>
  );
}

BudgetCard.propTypes = {
  budget: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    spent: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

// Expense item component
function ExpenseItem({ expense }) {
  const iconMap = {
    Food: ShoppingBag,
    Shopping: ShoppingBag,
    Transportation: Car,
    Transport: Car,
    Entertainment: Film,
    Health: Activity,
    Utilities: Lightbulb,
    Other: CreditCard,
  };

  const isPositive = parseFloat(expense.percentage) > 0;
  const IconComponent = iconMap[expense.category] || CreditCard;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-600">
          <IconComponent size={18} />
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-900">
            ${expense.amount.toLocaleString()}
          </p>
          <p className="text-xs text-neutral-500">{expense.category}</p>
        </div>
      </div>
      <span
        className={`text-sm font-medium ${
          isPositive ? "text-danger-500" : "text-success-800"
        }`}
      >
        {isPositive ? "↑" : "↓"} {expense.percentage}%
      </span>
    </div>
  );
}

ExpenseItem.propTypes = {
  expense: PropTypes.shape({
    category: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    percentage: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
  }).isRequired,
};

// Budget modal component
function BudgetModal({ isOpen, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    category: initialData?.category || "",
    amount: initialData?.amount?.toString() || "",
    spent: initialData?.spent?.toString() || "",
    period: initialData?.period || "monthly",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.category || !form.amount) {
      alert("Please fill required fields.");
      return;
    }

    await onSubmit({
      category: form.category,
      amount: Number(form.amount),
      spent: Number(form.spent) || 0,
      period: form.period,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-600"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-neutral-900 mb-6">
          {initialData ? "Edit budget" : "Add new budget"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-neutral-700 text-xs font-medium">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="e.g., Food & Groceries, Entertainment"
              className="w-full p-3 bg-neutral-50 border-none rounded-lg text-neutral-600 text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-2 text-neutral-700 text-xs font-medium">
                Budget Amount
              </label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="1000"
                className="w-full p-3 bg-neutral-50 border-none rounded-lg text-neutral-600 text-sm"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-neutral-700 text-xs font-medium">
                Spent
              </label>
              <input
                type="number"
                name="spent"
                value={form.spent}
                onChange={handleChange}
                placeholder="0"
                className="w-full p-3 bg-neutral-50 border-none rounded-lg text-neutral-600 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-neutral-700 text-xs font-medium">
              Period
            </label>
            <select
              name="period"
              value={form.period}
              onChange={handleChange}
              className="w-full p-3 bg-neutral-50 border-none rounded-lg text-neutral-600 text-sm"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 p-3 bg-white border border-neutral-200 rounded-xl font-semibold text-neutral-700 hover:bg-neutral-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 p-3 bg-primary-600 rounded-xl font-semibold text-white hover:bg-primary-700 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

BudgetModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};
