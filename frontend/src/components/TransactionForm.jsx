import { useEffect, useState } from "react";

const emptyForm = {
  type: "income",
  currency: "USD",
  amount: "",
  description: "",
  method: "",
  category: "",
  date: "",
  status: ""
};

export default function TransactionForm({ isOpen, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setForm({
        ...emptyForm,
        ...initialData,
        amount: initialData.amount?.toString() || "",
        date: initialData.date ? new Date(initialData.date).toISOString().slice(0, 10) : "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [isOpen, initialData]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.amount || !form.category || !form.date) {
      alert("Please fill required fields.");
      return;
    }

    await onSubmit({
      type: form.type,
      amount: Number(form.amount),
      category: form.category,
      date: form.date,
      description: form.description,
      currency: form.currency,
      method: form.method,
      status: form.status
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

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">
            {initialData ? "Edit transaction" : "Adding a new transaction"}
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            {initialData ? "Update the fields below" : "Please fill in the form below"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block mb-2 text-neutral-700 text-xs font-medium">Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full p-3 bg-neutral-50 border-none rounded-lg text-neutral-600 text-sm"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-neutral-700 text-xs font-medium">Currency</label>
              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="w-full p-3 bg-neutral-50 border-none rounded-lg text-neutral-600 text-sm"
              >
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
                <option value="EUR">EUR</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-neutral-700 text-xs font-medium">Amount</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="$10,500.00"
                className="w-full p-3 bg-neutral-50 border-none rounded-lg text-neutral-600 text-sm placeholder:text-neutral-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-neutral-700 text-xs font-medium">Description</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Name of transaction or short description"
              className="w-full p-3 bg-neutral-50 border-none rounded-lg text-neutral-600 text-sm placeholder:text-neutral-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-2 text-neutral-700 text-xs font-medium">Method</label>
              <select
                name="method"
                value={form.method}
                onChange={handleChange}
                className="w-full p-3 bg-neutral-50 border-none rounded-lg text-neutral-600 text-sm"
              >
                <option value="">Select method</option>
                <option value="Mastercard">Mastercard **154</option>
                <option value="Visa">Visa **254</option>
                <option value="Cash">Cash</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-neutral-700 text-xs font-medium">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full p-3 bg-neutral-50 border-none rounded-lg text-neutral-600 text-sm"
                required
              >
                <option value="">Select a category</option>
                <option value="Food">Food</option>
                <option value="Shopping">Shopping</option>
                <option value="Transport">Transport</option>
                <option value="Entertainment">Entertainment</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-2 text-neutral-700 text-xs font-medium">Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full p-3 bg-neutral-50 border-none rounded-lg text-neutral-600 text-sm"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-neutral-700 text-xs font-medium">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full p-3 bg-neutral-50 border-none rounded-lg text-neutral-600 text-sm"
              >
                <option value="">Select a status</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
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
