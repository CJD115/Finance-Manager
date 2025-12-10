import express from "express";
import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET all budgets for logged-in user
router.get("/", requireAuth, async (req, res) => {
  try {
    const { month, year } = req.query;
    const query = { user: req.userId };

    if (month && year) {
      query.month = parseInt(month);
      query.year = parseInt(year);
    }

    const budgets = await Budget.find(query).sort({ category: 1 });
    res.json(budgets);
  } catch (err) {
    console.error("Error fetching budgets:", err);
    res.status(500).json({ message: "Error fetching budgets" });
  }
});

// GET budget summary
router.get("/summary", requireAuth, async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const budgets = await Budget.find({
      user: req.userId,
      month: currentMonth,
      year: currentYear,
    });

    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

    res.json({
      totalBudget,
      totalSpent,
      remaining: totalBudget - totalSpent,
      budgetCount: budgets.length,
    });
  } catch (err) {
    console.error("Summary error:", err);
    res.status(500).json({ message: "Error fetching summary" });
  }
});

// GET top expenses
router.get("/top-expenses", requireAuth, async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    const transactions = await Transaction.find({
      user: req.userId,
      type: "expense",
      date: { $gte: startDate, $lte: endDate },
    });

    // Group by category and calculate totals
    const categoryTotals = {};
    transactions.forEach((t) => {
      if (!categoryTotals[t.category]) {
        categoryTotals[t.category] = 0;
      }
      categoryTotals[t.category] += t.amount;
    });

    // Convert to array and calculate percentages
    const total = Object.values(categoryTotals).reduce(
      (sum, val) => sum + val,
      0
    );
    const expenses = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: total > 0 ? ((amount / total) * 100).toFixed(1) : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8);

    res.json(expenses);
  } catch (err) {
    console.error("Top expenses error:", err);
    res.status(500).json({ message: "Error fetching top expenses" });
  }
});

// CREATE a new budget
router.post("/", requireAuth, async (req, res) => {
  try {
    const { category, amount, period, month, year } = req.body;

    const budget = await Budget.create({
      user: req.userId,
      category,
      amount,
      spent: 0,
      period,
      month: month || new Date().getMonth() + 1,
      year: year || new Date().getFullYear(),
    });

    res.status(201).json(budget);
  } catch (err) {
    console.error("Error creating budget:", err);
    res.status(400).json({ message: "Error creating budget" });
  }
});

// UPDATE a budget
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { category, amount, spent, period, month, year, status } = req.body;

    const updated = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { category, amount, spent, period, month, year, status },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating budget:", err);
    res.status(400).json({ message: "Error updating budget" });
  }
});

// DELETE a budget
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const deleted = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting budget:", err);
    res.status(400).json({ message: "Error deleting budget" });
  }
});

// Update budget spent amounts based on transactions
router.post("/sync", requireAuth, async (req, res) => {
  try {
    const { month, year } = req.body;
    const currentMonth = month || new Date().getMonth() + 1;
    const currentYear = year || new Date().getFullYear();

    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    const budgets = await Budget.find({
      user: req.userId,
      month: currentMonth,
      year: currentYear,
    });

    for (const budget of budgets) {
      const transactions = await Transaction.find({
        user: req.userId,
        type: "expense",
        category: budget.category,
        date: { $gte: startDate, $lte: endDate },
      });

      const spent = transactions.reduce((sum, t) => sum + t.amount, 0);
      const percentage = (spent / budget.amount) * 100;

      let status = "on track";
      if (percentage >= 100) status = "over budget";
      else if (percentage >= 80) status = "near limit";

      budget.spent = spent;
      budget.status = status;
      await budget.save();
    }

    res.json({ message: "Budgets synced successfully" });
  } catch (err) {
    console.error("Sync error:", err);
    res.status(500).json({ message: "Error syncing budgets" });
  }
});

export default router;
