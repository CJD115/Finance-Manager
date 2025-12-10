import { useEffect, useState } from "react";
import API from "../api.js";
import TransactionForm from "../components/TransactionForm.jsx";
import TransactionTable from "../components/TransactionTable.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

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
      alert(`Error: ${err.response?.data?.message || err.message}\n\nCheck console for details.`);
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
      <TransactionTable 
        transactions={transactions} 
        loading={loading} 
        onDelete={handleDelete}
        onAddNew={handleOpenCreate}
        onEdit={handleEdit}
      />
    </div>
  );
}
