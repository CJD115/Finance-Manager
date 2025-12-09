export default function RecentTransactions({ transactions }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Recent transactions</h2>
        <div className="flex items-center gap-3">
          <select className="text-sm text-neutral-600 bg-neutral-100 rounded-lg px-3 py-2 border-none">
            <option>All accounts</option>
          </select>
          <button className="text-sm text-neutral-600 hover:text-neutral-900 flex items-center gap-1">
            See all <span>→</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-neutral-500 uppercase">
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Amount</th>
              <th className="pb-3 font-medium">Payment Name</th>
              <th className="pb-3 font-medium">Method</th>
              <th className="pb-3 font-medium">Category</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {transactions.slice(0, 3).map((t, i) => (
              <tr key={i} className="border-t border-neutral-100">
                <td className="py-4 text-neutral-600">{t.date}</td>
                <td className="py-4 text-neutral-900 font-semibold">{t.amount}</td>
                <td className="py-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center">
                    {t.icon}
                  </div>
                  <span className="text-neutral-900">{t.name}</span>
                </td>
                <td className="py-4 text-neutral-600">{t.method}</td>
                <td className="py-4 text-neutral-600">{t.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
