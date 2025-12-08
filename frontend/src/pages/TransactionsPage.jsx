import { useEffect, useState } from "react";
import API from "../api.js";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    date: "",
    description: ""
  });

  const [loading, setLoading] = useState(true);

  // Fetch all transactions on mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    try {
      setLoading(true);
      const res = await API.get("/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  // Handle form input change
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Handle submit
  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.amount || !form.category || !form.date) {
      alert("Please fill amount, category, and date.");
      return;
    }

    try {
      await API.post("/transactions", form);
      setForm({
        type: "expense",
        amount: "",
        category: "",
        date: "",
        description: ""
      });
      fetchTransactions(); // reload the list
    } catch (err) {
      console.error("Add transaction error:", err);
    }
  }

  // Delete transaction
  async function handleDelete(id) {
    if (!confirm("Delete this transaction?")) return;
    try {
      await API.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">

      <h1 className="text-3xl font-semibold mb-6">Transactions</h1>

      {/* --- ADD TRANSACTION FORM --- */}
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-6 rounded-xl mb-10 max-w-xl space-y-4"
      >
        <h2 className="text-xl font-semibold">Add Transaction</h2>

        <div>
          <label className="block mb-1">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full p-2 bg-slate-700 rounded"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Amount (£)</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="w-full p-2 bg-slate-700 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-2 bg-slate-700 rounded"
            placeholder="e.g. Food, Rent, Shopping"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full p-2 bg-slate-700 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Description (optional)</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 bg-slate-700 rounded"
            placeholder="Optional note"
          />
        </div>

        <button className="w-full mt-3 p-2 bg-emerald-500 rounded font-semibold">
          Add Transaction
        </button>
      </form>

      {/* --- TRANSACTIONS TABLE --- */}
      <div className="bg-slate-800 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">All Transactions</h2>

        {loading ? (
          <p>Loading...</p>
        ) : transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-700">
              <tr>
                <th className="p-3">Type</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Category</th>
                <th className="p-3">Date</th>
                <th className="p-3">Description</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id} className="border-b border-slate-700">
                  <td className="p-3 capitalize">{t.type}</td>
                  <td className="p-3">£{t.amount}</td>
                  <td className="p-3">{t.category}</td>
                  <td className="p-3">
                    {new Date(t.date).toLocaleDateString()}
                  </td>
                  <td className="p-3">{t.description || "-"}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="px-3 py-1 bg-red-500 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
}
