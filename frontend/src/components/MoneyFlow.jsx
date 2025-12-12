import PropTypes from "prop-types";

export default function MoneyFlow({ data }) {
  const maxValue =
    data.length > 0
      ? Math.max(...data.map((m) => Math.max(m.income, m.expense)))
      : 20000;

  // Generate Y-axis labels
  const yAxisSteps = 4;
  const stepValue = Math.ceil(maxValue / yAxisSteps / 5000) * 5000; // Round to nearest 5000
  const yAxisLabels = Array.from(
    { length: yAxisSteps + 1 },
    (_, i) => stepValue * i
  ).reverse();

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 h-full flex items-center justify-center">
        <p className="text-neutral-400">
          No data available for money flow chart
        </p>
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

      <div className="flex gap-4 flex-1">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-end">
          <div
            className="flex flex-col justify-between h-full"
            style={{ height: "250px" }}
          >
            {yAxisLabels.map((label, i) => (
              <div key={i} className="text-xs text-neutral-400 leading-none">
                ${(label / 1000).toFixed(1)}k
              </div>
            ))}
          </div>
          {/* Spacer to match month labels height */}
          <div style={{ height: "1.75rem" }}></div>
        </div>

        {/* Chart */}
        <div className="flex items-end justify-between flex-1 gap-2">
          {data.map((month, i) => {
            const incomeHeight =
              (month.income / (stepValue * yAxisSteps)) * 100;
            const expenseHeight =
              (month.expense / (stepValue * yAxisSteps)) * 100;

            return (
              <div
                key={i}
                className="flex flex-col justify-end items-center gap-2 flex-1 min-w-0"
              >
                <div
                  className="flex items-end justify-center gap-1 w-full"
                  style={{ height: "200px" }}
                >
                  <div
                    className="bg-primary-600 rounded-t-lg transition-all hover:opacity-80"
                    style={{
                      height: `${Math.min(incomeHeight, 100)}%`,
                      width: "45%",
                      minHeight: month.income > 0 ? "4px" : "0",
                    }}
                  ></div>
                  <div
                    className="bg-primary-300 rounded-t-lg transition-all hover:opacity-80"
                    style={{
                      height: `${Math.min(expenseHeight, 100)}%`,
                      width: "45%",
                      minHeight: month.expense > 0 ? "4px" : "0",
                    }}
                  ></div>
                </div>
                <span className="text-xs text-neutral-500 whitespace-nowrap">
                  {month.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

MoneyFlow.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      income: PropTypes.number.isRequired,
      expense: PropTypes.number.isRequired,
    })
  ).isRequired,
};
