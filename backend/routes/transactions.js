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
      balance: income - expense
    });
  } catch (err) {
    console.error("Summary error:", err);
    res.status(500).json({ message: "Error fetching summary" });
  }
});

// CREATE a new transaction
router.post("/", requireAuth, async (req, res) => {
  try {
    const { type, amount, category, date, description } = req.body;

    const transaction = await Transaction.create({
      user: req.userId,
      type,
      amount,
      category,
      date,
      description
    });

    res.status(201).json(transaction);

  } catch (err) {
    console.error("Error creating transaction:", err);
    res.status(400).json({ message: "Error creating transaction" });
  }
});

// GET all transactions for logged-in user
router.get("/", requireAuth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.userId })
      .sort({ date: -1 });

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
      user: req.userId
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

export default router;
