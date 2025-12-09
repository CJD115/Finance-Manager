import { useState } from "react";

export default function TransactionTable({ transactions, loading, onDelete, onAddNew, onEdit }) {
  const [openMenuId, setOpenMenuId] = useState(null);

  function toggleMenu(id) {
    setOpenMenuId(openMenuId === id ? null : id);
  }

  return (
    <main className="flex-1 flex flex-col p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-neutral-900">Transactions</h1>
        <p className="text-sm text-neutral-400 mt-1">Overview of your activities</p>
      </div>

      <div className="flex-1 bg-white overflow-hidden flex flex-col rounded-xl border border-neutral-200 shadow-sm">
        <div className="p-6 border-b border-neutral-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-neutral-900">All Transactions</h2>
          <button
            onClick={onAddNew}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            + Add Transaction
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-neutral-400">Loading...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-neutral-400">No transactions found.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-neutral-50 sticky top-0">
                <tr>
                  <th className="p-4 text-neutral-500 font-medium text-xs uppercase tracking-wider">Type</th>
                  <th className="p-4 text-neutral-500 font-medium text-xs uppercase tracking-wider">Amount</th>
                  <th className="p-4 text-neutral-500 font-medium text-xs uppercase tracking-wider">Currency</th>
                  <th className="p-4 text-neutral-500 font-medium text-xs uppercase tracking-wider">Method</th>
                  <th className="p-4 text-neutral-500 font-medium text-xs uppercase tracking-wider">Category</th>
                  <th className="p-4 text-neutral-500 font-medium text-xs uppercase tracking-wider">Date</th>
                  <th className="p-4 text-neutral-500 font-medium text-xs uppercase tracking-wider">Description</th>
                  <th className="p-4 text-neutral-500 font-medium text-xs uppercase tracking-wider">Status</th>
                  <th className="p-4 text-neutral-500 font-medium text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t._id} className="border-b border-neutral-100 hover:bg-neutral-50 transition">
                    <td className="p-4">
                      <span className="capitalize text-neutral-900 font-medium">{t.type}</span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`font-semibold ${
                          t.type === "income" ? "text-success-800" : "text-neutral-900"
                        }`}
                      >
                        {t.type === "income" ? "+" : ""}{t.amount}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-700">{t.currency || "USD"}</td>
                    <td className="p-4 text-neutral-700">{t.method || "-"}</td>
                    <td className="p-4 text-neutral-900 font-medium">{t.category}</td>
                    <td className="p-4 text-neutral-600 text-sm">
                      {new Date(t.date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-neutral-600">{t.description || "-"}</td>
                    <td className="p-4">
                      {t.status && (
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            t.status === "Completed"
                              ? "bg-success-200 text-success-800"
                              : "bg-warning-200 text-warning-500"
                          }`}
                        >
                          {t.status}
                        </span>
                      )}
                    </td>
                    <td className="p-4 relative">
                      <button
                        onClick={() => toggleMenu(t._id)}
                        className="p-2 hover:bg-neutral-100 rounded-lg transition"
                      >
                        <svg className="w-5 h-5 text-neutral-600" fill="currentColor" viewBox="0 0 16 16">
                          <circle cx="8" cy="3" r="1.5"/>
                          <circle cx="8" cy="8" r="1.5"/>
                          <circle cx="8" cy="13" r="1.5"/>
                        </svg>
                      </button>
                      
                      {openMenuId === t._id && (
                        <div className="absolute right-8 top-12 bg-white border border-neutral-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                          <button
                            onClick={() => {
                              onEdit(t);
                              setOpenMenuId(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 transition flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              onDelete(t._id);
                              setOpenMenuId(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-danger-500 hover:bg-danger-50 transition flex items-center gap-2 border-t border-neutral-100"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
