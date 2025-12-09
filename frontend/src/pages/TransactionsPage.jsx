import { useEffect, useState } from "react";
import API from "../api.js";
import TransactionForm from "../components/TransactionForm.jsx";
import TransactionTable from "../components/TransactionTable.jsx";

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
      if (editingTransaction) {
        await API.put(`/transactions/${editingTransaction._id}`, formData);
      } else {
        await API.post("/transactions", formData);
      }
      await fetchTransactions();
      handleCloseModal();
    } catch (err) {
      console.error(editingTransaction ? "Update error:" : "Add transaction error:", err);
      alert(`Error: ${err.response?.data?.message || err.message}`);
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
