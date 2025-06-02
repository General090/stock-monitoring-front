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

  // Load products
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

  // Handle form change
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Add or update product
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (editId) {
        // Update
        await api.put(`/auth/products/${editId}`, {
          ...form,
          quantity: Number(form.quantity),
          price: Number(form.price),
        });
        setEditId(null);
      } else {
        // Add
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

  // Delete product
  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  }

  // Start editing a product
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
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Product Management</h1>

        <form onSubmit={handleSubmit} className="mb-6 space-y-4 max-w-md">
          <input
            name="name"
            type="text"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
          />
          <input
            name="quantity"
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
            min={0}
            required
            className="input input-bordered w-full"
          />
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            min={0}
            step="0.01"
            required
            className="input input-bordered w-full"
          />
          <button
            type="submit"
            className="btn btn-primary bg-blue-500 py-3 px-5 cursor-pointer"
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
              className="btn btn-secondary ml-2"
            >
              Cancel
            </button>
          )}
        </form>

        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Quantity</th>
              <th className="border border-gray-300 p-2">Price</th>
              <th className="border border-gray-300 p-2">Actions</th>
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
              <tr key={product._id}>
                <td className="border border-gray-300 p-2">{product.name}</td>
                <td className="border border-gray-300 p-2">{product.quantity}</td>
                <td className="border border-gray-300 p-2">${product.price.toFixed(2)}</td>
                <td className="border border-gray-300 p-2 space-x-2">
                  <button
                    onClick={() => startEdit(product)}
                    className="btn btn-sm btn-warning"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="btn btn-sm btn-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
