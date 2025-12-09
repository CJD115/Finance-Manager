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
    <div className="min-h-screen bg-slate-900 text-white flex w-full">
      
      {/* --- LEFT SIDEBAR: ADD TRANSACTION FORM --- */}
      <aside className="w-80 bg-slate-800 p-6 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button className="w-full mt-3 p-2 bg-emerald-500 rounded font-semibold hover:bg-emerald-600 transition">
            Add Transaction
          </button>
        </form>
      </aside>

      {/* --- RIGHT SIDE: TRANSACTIONS TABLE (FULL WIDTH) --- */}
      <main className="flex-1 w-full flex flex-col bg-slate-900">
        <div className="p-6">
          <h1 className="text-3xl font-semibold">Transactions</h1>
        </div>

        <div className="flex-1 mx-6 mb-6 bg-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-semibold">All Transactions</h2>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <p>Loading...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-slate-400">No transactions found.</p>
            </div>
          ) : (
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-700 sticky top-0">
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
                    <tr key={t._id} className="border-b border-slate-700 hover:bg-slate-700/50 transition">
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
                          className="px-3 py-1 bg-red-500 rounded text-sm hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
