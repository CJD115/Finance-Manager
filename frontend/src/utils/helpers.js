import {
  Play,
  ShoppingBag,
  Coffee,
  ShoppingCart,
  Film,
  Car,
  Sparkles,
  Plane,
  TrendingUp,
  Wallet,
  Briefcase,
  Building2,
  Home,
  ArrowLeftRight,
  CreditCard,
} from "lucide-react";

// Helper function to assign icons based on category
export function getCategoryIcon(category) {
  const iconMap = {
    Subscription: Play,
    Shopping: ShoppingBag,
    "Cafe & Restaurants": Coffee,
    "Food & Groceries": ShoppingCart,
    Food: ShoppingCart,
    Entertainment: Film,
    Transportation: Car,
    Transport: Car,
    "Health & Beauty": Sparkles,
    Traveling: Plane,
    Investments: TrendingUp,
    Investment: TrendingUp,
    Salary: Wallet,
    Freelance: Briefcase,
    Business: Building2,
    Rent: Home,
    "Money transfer": ArrowLeftRight,
  };
  return iconMap[category] || CreditCard;
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
