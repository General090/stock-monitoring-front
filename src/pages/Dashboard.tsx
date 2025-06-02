import AdminLayout from "../components/AdminLayout";
import { useEffect, useState } from "react";
import api from "../services/api";

interface DashboardStats {
  totalProducts: number;
  totalQuantity: number;
  lowStock: number;
}

interface Transaction {
  _id: string;
  product: { name: string };
  type: string;
  quantity: number;
  createdAt: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalQuantity: 0,
    lowStock: 0,
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get("/dashboard/stats");
        setStats(statsRes.data);

        const transactionsRes = await api.get("/api/transactions/recent");
        setTransactions(transactionsRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-100 p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Total Products</h2>
            <p className="text-xl">{stats.totalProducts}</p>
          </div>
          <div className="bg-green-100 p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Total Quantity</h2>
            <p className="text-xl">{stats.totalQuantity}</p>
          </div>
          <div className="bg-red-100 p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Low Stock Items</h2>
            <p className="text-xl">{stats.lowStock}</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-2">Recent Transactions</h2>
        <div className="bg-white p-4 shadow rounded">
          {transactions.length === 0 ? (
            <p>No recent transactions.</p>
          ) : (
            <ul className="divide-y">
              {transactions.map((tx) => (
                <li key={tx._id} className="py-2 flex justify-between">
                  <span>{tx.type} - {tx.product?.name}</span>
                  <span>{tx.quantity} pcs</span>
                  <span>{new Date(tx.createdAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
