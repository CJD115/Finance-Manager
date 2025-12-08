// in routes/transactions.js
router.get("/summary", async (req, res) => {
  const { month, year } = req.query;
  const query = { user: req.userId };

  // similar date filtering logic as before...

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
});
