import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../api.js";
import StatCard from "../components/StatCard.jsx";
import MoneyFlow from "../components/MoneyFlow.jsx";
import BudgetWidget from "../components/BudgetWidget.jsx";
import RecentTransactions from "../components/RecentTransactions.jsx";
import SavingGoals from "../components/SavingGoals.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { getCategoryIcon, formatTransactionDate } from "../utils/helpers.js";
import {
  Home,
  CreditCard,
  Wallet,
  Target,
  PieChart,
  Settings,
} from "lucide-react";
import { FiHome, FiDollarSign, FiTarget } from "react-icons/fi"; // Feather icons
import { HiOutlineHome, HiOutlineCreditCard } from "react-icons/hi2"; // Heroicons
import {
  HomeIcon,
  CreditCardIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [moneyFlowData, setMoneyFlowData] = useState([]);
  const [budgetData, setBudgetData] = useState({
    spent: 0,
    total: 0,
    categories: [],
  });
  const [goalsData, setGoalsData] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchSummary() {
    try {
      const res = await API.get("/transactions/summary");
      setSummary(res.data);
    } catch (err) {
      console.error("Summary error:", err);
    }
  }

  async function fetchRecentTransactions() {
    try {
      const res = await API.get("/transactions");
      // Get the 5 most recent transactions
      const recent = res.data.slice(0, 5).map((t) => ({
        date: formatTransactionDate(t.date),
        amount: `${
          t.type === "expense" ? "- " : "+ "
        }$${t.amount.toLocaleString()}`,
        name: t.description || t.category,
        method: t.method || "Cash",
        category: t.category,
        icon: getCategoryIcon(t.category),
        type: t.type,
      }));
      setRecentTransactions(recent);
    } catch (err) {
      console.error("Transactions error:", err);
    }
  }

  async function fetchMoneyFlow() {
    try {
      const res = await API.get("/transactions/monthly-flow?months=7");
      setMoneyFlowData(res.data);
    } catch (err) {
      console.error("Money flow error:", err);
    }
  }

  async function fetchBudgetBreakdown() {
    try {
      const res = await API.get(
        "/transactions/category-breakdown?type=expense"
      );
      setBudgetData({
        spent: res.data.total,
        total: res.data.total * 1.1, // Set budget 10% higher than spent (you can adjust this)
        categories: res.data.categories,
      });
    } catch (err) {
      console.error("Budget breakdown error:", err);
    }
  }

  async function fetchGoals() {
    try {
      const res = await API.get("/goals");
      setGoalsData(res.data.slice(0, 3)); // Get top 3 goals for dashboard
    } catch (err) {
      console.error("Goals error:", err);
    }
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([
        fetchSummary(),
        fetchRecentTransactions(),
        fetchMoneyFlow(),
        fetchBudgetBreakdown(),
        fetchGoals(),
      ]);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  // Calculate total savings from goals
  const totalSavings = goalsData.reduce(
    (sum, goal) => sum + (goal.currentAmount || 0),
    0
  );

  return (
    <div className="min-h-screen bg-neutral-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              Welcome back, {user?.name || "User"}!
            </h1>
            <p className="text-neutral-500 text-sm mt-1">
              It is the best time to manage your finances
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-neutral-200 rounded-lg">
              <span className="text-neutral-600">🔍</span>
            </button>
            <button className="p-2 hover:bg-neutral-200 rounded-lg relative">
              <span className="text-neutral-600">🔔</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
              <div>
                <p className="text-sm font-semibold text-neutral-900">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-neutral-500">
                  {user?.email || "No email"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-neutral-200">
            <span>📅</span>
            <span className="text-sm text-neutral-700">This month</span>
          </button>
          <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-neutral-200">
            <span>⚙️</span>
            <span className="text-sm text-neutral-700">Manage widgets</span>
          </button>
          <Link
            to="/transactions"
            className="ml-auto flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
          >
            <span>+</span>
            <span className="text-sm font-semibold">Add new</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total balance"
          amount={`$${summary.balance.toLocaleString()}`}
          percentage="12.1%"
          trend="up"
        />
        <StatCard
          title="Income"
          amount={`$${summary.income.toLocaleString()}`}
          percentage="6.3%"
          trend="up"
        />
        <StatCard
          title="Expense"
          amount={`$${summary.expense.toLocaleString()}`}
          percentage="2.4%"
          trend="down"
        />
        <StatCard
          title="Total savings"
          amount={`$${totalSavings.toLocaleString()}`}
          percentage="12.1%"
          trend="up"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="col-span-2">
          <MoneyFlow data={moneyFlowData} />
        </div>
        <BudgetWidget
          spent={budgetData.spent}
          total={budgetData.total}
          categories={budgetData.categories}
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <RecentTransactions transactions={recentTransactions} />
        </div>
        <SavingGoals goals={goalsData} />
      </div>
    </div>
  );
}
