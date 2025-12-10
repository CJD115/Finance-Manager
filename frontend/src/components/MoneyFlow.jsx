import PropTypes from 'prop-types';

export default function MoneyFlow({ data }) {
  const maxValue = data.length > 0 ? Math.max(...data.map(m => m.income + m.expense)) : 1;
  
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 h-full flex items-center justify-center">
        <p className="text-neutral-400">No data available for money flow chart</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Money flow</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
            <span className="text-sm text-neutral-600">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary-300 rounded-full"></div>
            <span className="text-sm text-neutral-600">Expense</span>
          </div>
          <select className="text-sm text-neutral-600 bg-neutral-100 rounded-lg px-3 py-2 border-none">
            <option>This year</option>
          </select>
        </div>
      </div>

      <div className="flex items-end justify-between flex-1 gap-3">
        {data.map((month, i) => {
          const incomeHeight = (month.income / maxValue) * 100;
          const expenseHeight = (month.expense / maxValue) * 100;
          
          return (
            <div key={i} className="flex flex-col justify-end items-center gap-2 flex-1">
              <div className="flex flex-col-reverse items-center gap-1 w-full" style={{ height: '180px' }}>
                <div className="w-full bg-primary-300 rounded-lg" style={{ height: `${expenseHeight}%` }}></div>
                <div className="w-full bg-primary-600 rounded-lg" style={{ height: `${incomeHeight}%` }}></div>
              </div>
              <span className="text-xs text-neutral-500">{month.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
