import { useEffect, useState } from "react";
import API from "../api.js";
import TransactionForm from "../components/TransactionForm.jsx";
import TransactionTable from "../components/TransactionTable.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import TransactionFilters from "../components/TransactionFilters.jsx"; // New component

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    type: "all", // 'all', 'income', 'expense'
    category: "all", // 'all' or specific category
    method: "all", // 'all', 'Cash', 'Card', etc.
    status: "all", // 'all', 'completed', 'pending'
    dateFrom: "", // Start date
    dateTo: "", // End date
    minAmount: "", // Minimum amount
    maxAmount: "", // Maximum amount
    searchTerm: "", // Search in description/category
  });

  // Get filtered transactions
  const filteredTransactions = transactions.filter((transaction) => {
    // Type filter
    if (filters.type !== "all" && transaction.type !== filters.type) {
      return false;
    }

    // Category filter
    if (
      filters.category !== "all" &&
      transaction.category !== filters.category
    ) {
      return false;
    }

    // Method filter
    if (filters.method !== "all" && transaction.method !== filters.method) {
      return false;
    }

    // Status filter
    if (filters.status !== "all" && transaction.status !== filters.status) {
      return false;
    }

    // Date range filter
    if (filters.dateFrom) {
      const transactionDate = new Date(transaction.date);
      const fromDate = new Date(filters.dateFrom);
      if (transactionDate < fromDate) return false;
    }

    if (filters.dateTo) {
      const transactionDate = new Date(transaction.date);
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      if (transactionDate > toDate) return false;
    }

    // Amount range filter
    if (
      filters.minAmount &&
      transaction.amount < parseFloat(filters.minAmount)
    ) {
      return false;
    }

    if (
      filters.maxAmount &&
      transaction.amount > parseFloat(filters.maxAmount)
    ) {
      return false;
    }

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesDescription = transaction.description
        ?.toLowerCase()
        .includes(searchLower);
      const matchesCategory = transaction.category
        ?.toLowerCase()
        .includes(searchLower);
      if (!matchesDescription && !matchesCategory) return false;
    }

    return true;
  });

  // Get unique values for filter dropdowns
  const categories = [
    ...new Set(transactions.map((t) => t.category).filter(Boolean)),
  ];
  const methods = [
    ...new Set(transactions.map((t) => t.method).filter(Boolean)),
  ];

  function handleFilterChange(newFilters) {
    setFilters(newFilters);
  }

  function handleResetFilters() {
    setFilters({
      type: "all",
      category: "all",
      method: "all",
      status: "all",
      dateFrom: "",
      dateTo: "",
      minAmount: "",
      maxAmount: "",
      searchTerm: "",
    });
  }

  // Fetch all transactions on mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    try {
      setLoading(true);
      const res = await API.get("/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitTransaction(formData) {
    try {
      console.log("Submitting transaction:", formData);
      console.log("Editing transaction:", editingTransaction);

      if (editingTransaction) {
        const url = `/transactions/${editingTransaction._id}`;
        console.log("PUT URL:", url);
        const response = await API.put(url, formData);
        console.log("Update response:", response);
      } else {
        console.log("POST URL:", "/transactions");
        const response = await API.post("/transactions", formData);
        console.log("Create response:", response);
      }
      await fetchTransactions();
      handleCloseModal();
    } catch (err) {
      console.error("Full error object:", err);
      console.error("Error response:", err.response);
      console.error("Error config:", err.config);
      alert(
        `Error: ${
          err.response?.data?.message || err.message
        }\n\nCheck console for details.`
      );
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this transaction?")) return;
    try {
      await API.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  function handleOpenCreate() {
    setEditingTransaction(null);
    setIsModalOpen(true);
  }

  function handleEdit(transaction) {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setEditingTransaction(null);
  }

  if (loading && transactions.length === 0) {
    return <LoadingSpinner message="Loading transactions..." />;
  }

  return (
    <div className="bg-white min-h-full">
      <TransactionForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTransaction}
        initialData={editingTransaction}
      />
      <TransactionFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        categories={categories}
        methods={methods}
        resultCount={filteredTransactions.length}
        totalCount={transactions.length}
      />
      <TransactionTable
        transactions={filteredTransactions}
        loading={loading}
        onDelete={handleDelete}
        onAddNew={handleOpenCreate}
        onEdit={handleEdit}
      />
    </div>
  );
}
