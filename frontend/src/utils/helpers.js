// Helper function to assign icons based on category
export function getCategoryIcon(category) {
  const iconMap = {
    Subscription: "▶️",
    Shopping: "🏪",
    "Cafe & Restaurants": "🍜",
    "Food & Groceries": "🛒",
    Food: "🛒",
    Entertainment: "🎬",
    Transportation: "🚗",
    Transport: "🚗",
    "Health & Beauty": "💄",
    Traveling: "✈️",
    Investments: "📈",
    Investment: "📈",
    Salary: "💰",
    Freelance: "💼",
    Business: "🏢",
    Rent: "🏠",
    "Money transfer": "💸",
  };
  return iconMap[category] || "💳";
}

// Format date for display
export function formatTransactionDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Format currency amount
export function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}
