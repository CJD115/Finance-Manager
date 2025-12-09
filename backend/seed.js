import mongoose from "mongoose";
import dotenv from "dotenv";
import Transaction from "./models/Transaction.js";
import User from "./models/User.js";

dotenv.config();

const dummyTransactions = [
  {
    type: "income",
    amount: 3000,
    category: "Salary",
    date: "2025-01-12",
    description: "Monthly salary payment",
    currency: "USD",
    method: "Bank Transfer",
    status: "Completed"
  },
  {
    type: "expense",
    amount: 1250,
    category: "Rent",
    date: "2025-01-05",
    description: "Monthly rent payment",
    currency: "USD",
    method: "Bank Transfer",
    status: "Completed"
  },
  {
    type: "expense",
    amount: 450,
    category: "Food",
    date: "2025-01-15",
    description: "Grocery shopping",
    currency: "USD",
    method: "Mastercard",
    status: "Completed"
  },
  {
    type: "income",
    amount: 5500,
    category: "Salary",
    date: "2024-12-28",
    description: "Freelance project payment",
    currency: "USD",
    method: "PayPal",
    status: "Completed"
  },
  {
    type: "expense",
    amount: 120,
    category: "Entertainment",
    date: "2025-01-18",
    description: "Movie tickets and dinner",
    currency: "USD",
    method: "Visa",
    status: "Completed"
  },
  {
    type: "expense",
    amount: 85,
    category: "Transport",
    date: "2025-01-20",
    description: "Gas and parking",
    currency: "USD",
    method: "Cash",
    status: "Completed"
  },
  {
    type: "income",
    amount: 850,
    category: "Investment",
    date: "2025-01-22",
    description: "Investment dividends",
    currency: "USD",
    method: "Bank Transfer",
    status: "Completed"
  },
  {
    type: "expense",
    amount: 200,
    category: "Shopping",
    date: "2025-01-25",
    description: "Clothing and accessories",
    currency: "USD",
    method: "Mastercard",
    status: "Completed"
  },
  {
    type: "expense",
    amount: 65,
    category: "Food",
    date: "2025-02-01",
    description: "Restaurant dinner",
    currency: "USD",
    method: "Visa",
    status: "Completed"
  },
  {
    type: "income",
    amount: 420,
    category: "Rent",
    date: "2025-02-03",
    description: "Rental income from property",
    currency: "USD",
    method: "Bank Transfer",
    status: "Completed"
  },
  {
    type: "expense",
    amount: 150,
    category: "Entertainment",
    date: "2025-02-05",
    description: "Concert tickets",
    currency: "USD",
    method: "Mastercard",
    status: "Pending"
  },
  {
    type: "expense",
    amount: 95,
    category: "Transport",
    date: "2025-02-08",
    description: "Taxi and metro fares",
    currency: "USD",
    method: "Cash",
    status: "Completed"
  },
  {
    type: "income",
    amount: 1250,
    category: "Money transfer",
    date: "2025-02-10",
    description: "Transfer from Chris Goodwin",
    currency: "USD",
    method: "Mastercard",
    status: "Completed"
  },
  {
    type: "expense",
    amount: 340,
    category: "Shopping",
    date: "2025-02-12",
    description: "Electronics purchase",
    currency: "USD",
    method: "Visa",
    status: "Completed"
  },
  {
    type: "income",
    amount: 3000,
    category: "Salary",
    date: "2025-02-12",
    description: "Monthly salary payment",
    currency: "USD",
    method: "Bank Transfer",
    status: "Completed"
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Get the first user (or you can specify an email)
    const user = await User.findOne();
    
    if (!user) {
      console.error("No user found! Please register a user first.");
      process.exit(1);
    }

    console.log(`Seeding transactions for user: ${user.email}`);

    // Add user ID to each transaction
    const transactionsWithUser = dummyTransactions.map(t => ({
      ...t,
      user: user._id
    }));

    // Insert transactions
    await Transaction.insertMany(transactionsWithUser);
    
    console.log(`✅ Successfully added ${dummyTransactions.length} transactions!`);
    process.exit(0);

  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
