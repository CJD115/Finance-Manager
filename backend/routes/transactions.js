import express from "express";
import Transaction from "../models/Transaction.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET summary of transactions
router.get("/summary", requireAuth, async (req, res) => {
  try {
    const { month, year } = req.query;
    const query = { user: req.userId };

    const transactions = await Transaction.find(query);

    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);

    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);

    res.json({
      income,
      expense,
      balance: income - expense,
    });
  } catch (err) {
    console.error("Summary error:", err);
    res.status(500).json({ message: "Error fetching summary" });
  }
});

// CREATE a new transaction
router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      type,
      amount,
      category,
      date,
      description,
      currency,
      method,
      status,
    } = req.body;

    const transaction = await Transaction.create({
      user: req.userId,
      type,
      amount,
      category,
      date,
      description,
      currency,
      method,
      status,
    });

    res.status(201).json(transaction);
  } catch (err) {
    console.error("Error creating transaction:", err);
    res.status(400).json({ message: "Error creating transaction" });
  }
});

// UPDATE a transaction
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const {
      type,
      amount,
      category,
      date,
      description,
      currency,
      method,
      status,
    } = req.body;

    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { type, amount, category, date, description, currency, method, status },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating transaction:", err);
    res.status(400).json({ message: "Error updating transaction" });
  }
});

// GET all transactions for logged-in user
router.get("/", requireAuth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.userId }).sort({
      date: -1,
    });

    res.json(transactions);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ message: "Error fetching transactions" });
  }
});

// DELETE a transaction
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting transaction:", err);
    res.status(400).json({ message: "Error deleting transaction" });
  }
});

// GET monthly flow (income/expense per month for charts)
router.get("/monthly-flow", requireAuth, async (req, res) => {
  try {
    const { months = 6 } = req.query;

    const transactions = await Transaction.find({ user: req.userId }).sort({
      date: 1,
    });

    // Group transactions by month
    const monthlyData = {};

    transactions.forEach((t) => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthName = date.toLocaleDateString("en-US", { month: "short" });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthName, income: 0, expense: 0 };
      }

      if (t.type === "income") {
        monthlyData[monthKey].income += t.amount;
      } else {
        monthlyData[monthKey].expense += t.amount;
      }
    });

    // Convert to array and get last N months
    const result = Object.values(monthlyData).slice(-months);

    res.json(result);
  } catch (err) {
    console.error("Monthly flow error:", err);
    res.status(500).json({ message: "Error fetching monthly flow" });
  }
});

// GET category breakdown
router.get("/category-breakdown", requireAuth, async (req, res) => {
  try {
    const { type = "expense" } = req.query;

    const transactions = await Transaction.find({
      user: req.userId,
      type,
    });

    // Group by category
    const categoryData = {};
    let total = 0;

    transactions.forEach((t) => {
      if (!categoryData[t.category]) {
        categoryData[t.category] = 0;
      }
      categoryData[t.category] += t.amount;
      total += t.amount;
    });

    // Convert to array with percentages
    const result = Object.entries(categoryData).map(([name, amount]) => ({
      name,
      amount,
      percentage: total > 0 ? ((amount / total) * 100).toFixed(1) : 0,
      color: getRandomColor(name),
    }));

    res.json({ categories: result, total });
  } catch (err) {
    console.error("Category breakdown error:", err);
    res.status(500).json({ message: "Error fetching category breakdown" });
  }
});

// Helper function to generate consistent colors for categories
function getRandomColor(str) {
  const colors = [
    "#8470FF",
    "#A498FF",
    "#BFB7FF",
    "#D6D2FF",
    "#ECEAFF",
    "#F5F4FF",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default router;
