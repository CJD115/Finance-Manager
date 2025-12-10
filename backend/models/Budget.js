import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    spent: { type: Number, default: 0 },
    period: { type: String, enum: ["monthly", "yearly"], default: "monthly" },
    month: { type: Number }, // 1-12
    year: { type: Number },
    status: {
      type: String,
      enum: ["on track", "near limit", "over budget"],
      default: "on track",
    },
  },
  { timestamps: true }
);

const Budget = mongoose.model("Budget", budgetSchema);
export default Budget;
