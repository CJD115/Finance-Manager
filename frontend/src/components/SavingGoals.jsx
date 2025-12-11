import PropTypes from "prop-types";

export default function SavingGoals({ goals }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Saving goals</h2>
        <button className="text-neutral-400 hover:text-neutral-600">
          <span>↗</span>
        </button>
      </div>

      <div className="space-y-4">
        {goals.map((goal, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-900 font-medium">
                {goal.name}
              </span>
              <span className="text-sm text-neutral-900 font-semibold">
                ${goal.currentAmount.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-neutral-100 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all"
                style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-neutral-400">
                {Math.round((goal.currentAmount / goal.targetAmount) * 100)}%
              </span>
              <span className="text-xs text-neutral-400">
                Target: ${goal.targetAmount.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
