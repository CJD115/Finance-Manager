import PropTypes from 'prop-types';

export default function EmptyState({ 
  icon = "📭", 
  title = "No data found", 
  message = "Get started by adding your first item",
  actionLabel,
  onAction 
}) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-neutral-900 mb-2">{title}</h3>
        <p className="text-neutral-500 mb-6">{message}</p>
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
