import express from "express";
import Goal from "../models/Goal.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET all goals for logged-in user
router.get("/", requireAuth, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    console.error("Error fetching goals:", err);
    res.status(500).json({ message: "Error fetching goals" });
  }
});

// GET summary of goals
router.get("/summary", requireAuth, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.userId });

    const total = goals.length;
    const thisYear = goals.filter((g) => {
      const year = new Date(g.createdAt).getFullYear();
      return year === new Date().getFullYear();
    }).length;

    const statusCounts = {
      notStarted: goals.filter((g) => g.status === "not started").length,
      inProgress: goals.filter((g) => g.status === "in progress").length,
      canceled: goals.filter((g) => g.status === "canceled").length,
      finished: goals.filter((g) => g.status === "finished").length,
    };

    res.json({ total, thisYear, statusCounts });
  } catch (err) {
    console.error("Summary error:", err);
    res.status(500).json({ message: "Error fetching summary" });
  }
});

// CREATE a new goal
router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      name,
      targetAmount,
      currentAmount,
      deadline,
      category,
      status,
      color,
    } = req.body;

    const goal = await Goal.create({
      user: req.userId,
      name,
      targetAmount,
      currentAmount: currentAmount || 0,
      deadline,
      category,
      status,
      color,
    });

    res.status(201).json(goal);
  } catch (err) {
    console.error("Error creating goal:", err);
    res.status(400).json({ message: "Error creating goal" });
  }
});

// UPDATE a goal
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const {
      name,
      targetAmount,
      currentAmount,
      deadline,
      category,
      status,
      color,
    } = req.body;

    const updated = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { name, targetAmount, currentAmount, deadline, category, status, color },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating goal:", err);
    res.status(400).json({ message: "Error updating goal" });
  }
});

// DELETE a goal
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const deleted = await Goal.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting goal:", err);
    res.status(400).json({ message: "Error deleting goal" });
  }
});

export default router;
