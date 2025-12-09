export default function TransactionTable({ transactions, loading, onDelete, onAddNew }) {
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
              <thead className="bg-neutral-100 sticky top-0">
                <tr>
                  <th className="p-4 text-neutral-600 font-medium text-sm">Type</th>
                  <th className="p-4 text-neutral-600 font-medium text-sm">Amount</th>
                  <th className="p-4 text-neutral-600 font-medium text-sm">Category</th>
                  <th className="p-4 text-neutral-600 font-medium text-sm">Date</th>
                  <th className="p-4 text-neutral-600 font-medium text-sm">Description</th>
                  <th className="p-4 text-neutral-600 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t._id} className="border-b border-neutral-200 hover:bg-neutral-50 transition">
                    <td className="p-4 capitalize text-neutral-900">{t.type}</td>
                    <td className="p-4 text-success-800 font-semibold">£{t.amount}</td>
                    <td className="p-4 text-neutral-700">{t.category}</td>
                    <td className="p-4 text-neutral-600 text-sm">
                      {new Date(t.date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-neutral-600">{t.description || "-"}</td>
                    <td className="p-4">
                      <button
                        onClick={() => onDelete(t._id)}
                        className="px-3 py-1 bg-danger-500 rounded text-sm hover:bg-danger-500/90 transition text-white"
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
  );
}
