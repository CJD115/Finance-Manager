export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Add sidebar & summary cards later */}
      <h1 className="text-3xl font-bold p-6">Dashboard</h1>

      <button className="m-6 px-4 py-2 bg-emerald-500 rounded-lg font-semibold" onClick={() => 
        window.location.href = '/transactionspage'}>{
        "View Transactions"
      }</button>
    </div>
  );
}
