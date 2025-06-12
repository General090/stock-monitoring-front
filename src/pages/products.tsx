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
  const [search, setSearch] = useState("");

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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded p-4 mb-6 max-w-md space-y-4"
        >
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
            step="1"
            required
            className="input input-bordered w-full"
          />
          <div className="flex gap-3">
            <button type="submit" className="btn btn-primary w-full">
              {editId ? "Update Product" : "Add Product"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setForm({ name: "", quantity: 0, price: 0 });
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="overflow-x-auto">
          <table className="table w-full border border-gray-300">
            <thead>
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center p-4">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className={product.quantity < 5 ? "bg-red-100" : ""}
                  >
                    <td className="border p-2">{product.name}</td>
                    <td className="border p-2">{product.quantity}</td>
                    <td className="border p-2">₦{product.price.toFixed(2)}</td>
                    <td className="border p-2 space-x-2">
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
