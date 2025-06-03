import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import api from "../services/api";

interface Product {
  _id: string;
  name: string;
  quantity: number;
  price: number;
}

export default function LowStockPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchLowStock();
  }, []);

  async function fetchLowStock() {
    try {
      const res = await api.get("/products/low-stock");
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch low stock items", error);
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Low Stock Products</h1>

        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center p-4">
                  All stock levels are sufficient.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id}>
                  <td className="border p-2">{product.name}</td>
                  <td className="border p-2">{product.quantity}</td>
                  <td className="border p-2">₦{product.price.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
