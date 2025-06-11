import AdminLayout from "../components/AdminLayout";
import { useEffect, useState } from "react";
import api from "../services/api";

interface Product {
  _id: string;
  name: string;
  quantity: number;
  price: number;
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: "", quantity: 0, price: 0 });
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to load products", error);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/auth/products/${editId}`, {
          ...form,
          quantity: Number(form.quantity),
          price: Number(form.price),
        });
        setEditId(null);
      } else {
        await api.post("/products", {
          ...form,
          quantity: Number(form.quantity),
          price: Number(form.price),
        });
      }
      setForm({ name: "", quantity: 0, price: 0 });
      fetchProducts();
    } catch (error) {
      console.error("Failed to save product", error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  }

  function startEdit(product: Product) {
    setEditId(product._id);
    setForm({
      name: product.name,
      quantity: product.quantity,
      price: product.price,
    });
  }

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Product Management</h1>

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8 space-y-4 max-w-md">
          <div>
            <label className="block text-gray-600 mb-1">Product Name</label>
            <input
              name="name"
              type="text"
              placeholder="Product Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Quantity</label>
            <input
              name="quantity"
              type="number"
              placeholder="Quantity"
              value={form.quantity}
              onChange={handleChange}
              min={0}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Price (₦)</label>
            <input
              name="price"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              min={0}
              step="1"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
            >
              {editId ? "Update Product" : "Add Product"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setForm({ name: "", quantity: 0, price: 0 });
                }}
                className="bg-gray-400 text-white px-5 py-2 rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Quantity</th>
                <th className="px-4 py-2 border">Price</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center p-4">
                    No products found.
                  </td>
                </tr>
              )}
              {products.map((product) => (
                <tr
                  key={product._id}
                  className={product.quantity < 5 ? "bg-red-100" : "hover:bg-gray-50"}
                >
                  <td className="px-4 py-2 border">{product.name}</td>
                  <td className="px-4 py-2 border">{product.quantity}</td>
                  <td className="px-4 py-2 border">₦{product.price.toFixed(2)}</td>
                  <td className="px-4 py-2 border space-x-2">
                    <button
                      onClick={() => startEdit(product)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
