// routes/transactions.js
import express from "express";
import Transaction from "../models/Transaction.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// All routes below require auth
router.use(requireAuth);

// GET /transactions
router.get("/", async (req, res) => {
  const { month, year, category } = req.query;

  const query = { user: req.userId };
  if (month && year) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);
    query.date = { $gte: start, $lte: end };
  }
  if (category) {
    query.category = category;
  }

  const transactions = await Transaction.find(query).sort({ date: -1 });
  res.json(transactions);
});

// POST /transactions
router.post("/", async (req, res) => {
  try {
    const { type, amount, category, date, description } = req.body;
    const transaction = new Transaction({
      user: req.userId,
      type,
      amount,
      category,
      date,
      description
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /transactions/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updated = await Transaction.findOneAndUpdate(
    { _id: id, user: req.userId },
    req.body,
    { new: true }
  );
  res.json(updated);
});

// DELETE /transactions/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await Transaction.findOneAndDelete({ _id: id, user: req.userId });
  res.json({ message: "Deleted" });
});

export default router;
