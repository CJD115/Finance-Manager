import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import API from "../api.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { Target, Menu } from "lucide-react";

/**
 * Goals page component for managing financial goals
 */
export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    thisYear: 0,
    statusCounts: {},
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  useEffect(() => {
    fetchGoals();
    fetchSummary();
  }, []);

  async function fetchGoals() {
    try {
      setLoading(true);
      const res = await API.get("/goals");
      setGoals(res.data);
    } catch (err) {
      console.error("Fetch goals error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchSummary() {
    try {
      const res = await API.get("/goals/summary");
      setSummary(res.data);
    } catch (err) {
      console.error("Fetch summary error:", err);
    }
  }

  async function handleSubmitGoal(formData) {
    try {
      if (editingGoal) {
        await API.put(`/goals/${editingGoal._id}`, formData);
      } else {
        await API.post("/goals", formData);
      }
      await fetchGoals();
      await fetchSummary();
      handleCloseModal();
    } catch (err) {
      console.error("Submit error:", err);
      alert(`Error: ${err.response?.data?.message || err.message}`);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this goal?")) return;
    try {
      await API.delete(`/goals/${id}`);
      fetchGoals();
      fetchSummary();
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  function handleOpenCreate() {
    setEditingGoal(null);
    setIsModalOpen(true);
  }

  function handleEdit(goal) {
    setEditingGoal(goal);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setEditingGoal(null);
  }

  if (loading && goals.length === 0) {
    return <LoadingSpinner message="Loading goals..." />;
  }

  return (
    <div className="bg-white min-h-full p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-neutral-900">Goals</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Create, manage and monitor your savings
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
        >
          + Add new goal
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400"
        />
        <select className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-900 font-medium cursor-pointer hover:bg-neutral-50 transition">
          <option>This year</option>
          <option>Last year</option>
          <option>All time</option>
        </select>
        <select className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-900 font-medium cursor-pointer hover:bg-neutral-50 transition">
          <option>Sort by: Date A-Z</option>
          <option>Sort by: Date Z-A</option>
          <option>Sort by: Amount</option>
        </select>
        <button className="p-2 border border-neutral-200 rounded-lg hover:bg-neutral-50">
          <Menu size={18} />
        </button>
      </div>

      {goals.length === 0 ? (
        <EmptyState
          icon="🎯"
          title="You haven't added any goals yet"
          message="Start planning for your future by creating your first savings goal"
          actionLabel="Add new goal"
          onAction={handleOpenCreate}
        />
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <SummaryCard label="Total goals" value={summary.total} />
            <SummaryCard label="This year" value={summary.thisYear} />
            <SummaryCard
              label="Not started"
              value={summary.statusCounts.notStarted || 0}
              color="yellow"
            />
            <SummaryCard
              label="In progress"
              value={summary.statusCounts.inProgress || 0}
              color="green"
            />
          </div>

          {/* Goals Grid */}
          <div className="grid grid-cols-4 gap-4">
            {goals.map((goal) => (
              <GoalCard
                key={goal._id}
                goal={goal}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {isModalOpen && (
        <GoalModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitGoal}
          initialData={editingGoal}
        />
      )}
    </div>
  );
}

// Summary card component
function SummaryCard({ label, value, color = "primary" }) {
  const colorClasses = {
    primary: "bg-primary-100 text-primary-600",
    yellow: "bg-warning-200 text-warning-500",
    green: "bg-success-200 text-success-800",
  };

  return (
    <div className="bg-neutral-50 rounded-xl p-4">
      <p className="text-xs text-neutral-500 mb-2">{label}</p>
      <div className="flex items-center gap-2">
        <div
          className={`w-10 h-10 rounded-full ${colorClasses[color]} flex items-center justify-center font-bold text-lg`}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

SummaryCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  color: PropTypes.oneOf(["primary", "yellow", "green"]),
};

// Goal card component
function GoalCard({ goal, onEdit, onDelete }) {
  const percentage = Math.min(
    (goal.currentAmount / goal.targetAmount) * 100,
    100
  );
  const statusColors = {
    "not started": { bg: "bg-warning-200", text: "text-warning-500" },
    "in progress": { bg: "bg-success-200", text: "text-success-800" },
    canceled: { bg: "bg-neutral-200", text: "text-neutral-600" },
    finished: { bg: "bg-primary-200", text: "text-primary-600" },
  };
  const colors = statusColors[goal.status] || statusColors["not started"];

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-semibold text-neutral-900">{goal.name}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(goal)}
            className="text-neutral-400 hover:text-neutral-600"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(goal._id)}
            className="text-neutral-400 hover:text-danger-500"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-neutral-900">
            ${goal.currentAmount.toLocaleString()}
          </span>
          <span className="text-sm text-neutral-500">
            / ${goal.targetAmount.toLocaleString()}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-neutral-100 rounded-full h-2 mb-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-neutral-500">
          {Math.round(percentage)}% of target amount
        </p>
      </div>

      <div
        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
      >
        {goal.status}
      </div>
    </div>
  );
}

GoalCard.propTypes = {
  goal: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    currentAmount: PropTypes.number.isRequired,
    targetAmount: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

// Goal modal component
function GoalModal({ isOpen, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
    category: "",
    status: "not started",
    color: "#8470FF",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        targetAmount: initialData.targetAmount?.toString() || "",
        currentAmount: initialData.currentAmount?.toString() || "",
        deadline: initialData.deadline
          ? new Date(initialData.deadline).toISOString().slice(0, 10)
          : "",
        category: initialData.category || "",
        status: initialData.status || "not started",
        color: initialData.color || "#8470FF",
      });
    }
  }, [initialData]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.targetAmount) {
      alert("Please fill required fields.");
      return;
    }

    await onSubmit({
      name: form.name,
      targetAmount: Number(form.targetAmount),
      currentAmount: Number(form.currentAmount) || 0,
      deadline: form.deadline || null,
      category: form.category,
      status: form.status,
      color: form.color,
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
          {initialData ? "Edit goal" : "Add new goal"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-neutral-700 text-xs font-medium">
              Goal Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g., New car, Vacation"
              className="w-full p-3 bg-neutral-50 border-none rounded-lg text-neutral-600 text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-2 text-neutral-700 text-xs font-medium">
                Target Amount
              </label>
              <input
                type="number"
                name="targetAmount"
                value={form.targetAmount}
                onChange={handleChange}
                placeholder="10000"
                className="w-full p-3 bg-neutral-50 border-none rounded-lg text-neutral-600 text-sm"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-neutral-700 text-xs font-medium">
                Current Amount
              </label>
              <input
                type="number"
                name="currentAmount"
                value={form.currentAmount}
                onChange={handleChange}
                placeholder="0"
                className="w-full p-3 bg-neutral-50 border-none rounded-lg text-neutral-600 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-2 text-neutral-700 text-xs font-medium">
                Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                className="w-full p-3 bg-neutral-50 border-none rounded-lg text-neutral-600 text-sm"
              />
            </div>

            <div>
              <label className="block mb-2 text-neutral-700 text-xs font-medium">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full p-3 bg-neutral-50 border-none rounded-lg text-neutral-600 text-sm"
              >
                <option value="not started">Not Started</option>
                <option value="in progress">In Progress</option>
                <option value="canceled">Canceled</option>
                <option value="finished">Finished</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-neutral-700 text-xs font-medium">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Travel, Education, etc."
              className="w-full p-3 bg-neutral-50 border-none rounded-lg text-neutral-600 text-sm"
            />
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

GoalModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};
