import { useEffect, useState } from "react";
import API from "../api.js";
import TransactionForm from "../components/TransactionForm.jsx";
import TransactionTable from "../components/TransactionTable.jsx";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  async function handleAddTransaction(formData) {
    try {
      await API.post("/transactions", formData);
      fetchTransactions();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Add transaction error:", err);
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
  return (
    <div className="bg-white min-h-full">
      <TransactionForm 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTransaction} 
      />
      <TransactionTable 
        transactions={transactions} 
        loading={loading} 
        onDelete={handleDelete}
        onAddNew={() => setIsModalOpen(true)}
      />
    </div>
  );
}
