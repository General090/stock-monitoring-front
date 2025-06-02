import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../services/api";
import AdminLayout from "../components/AdminLayout";

type Product = {
  _id?: string;
  name: string;
  quantity: number;
  unitPrice: number;
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const { register, handleSubmit, reset, setValue } = useForm<Product>();

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onSubmit = async (data: Product) => {
    if (data._id) {
      await api.put(`/products/${data._id}`, data);
    } else {
      await api.post("/products", data);
    }
    fetchProducts();
    reset();
  };

  const handleEdit = (product: Product) => {
    setValue("_id", product._id || "");
    setValue("name", product.name);
    setValue("quantity", product.quantity);
    setValue("unitPrice", product.unitPrice);
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  return (
    <AdminLayout>
      <h2 className="text-xl font-bold mb-4">Product Inventory</h2>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 mb-6">
        <input {...register("_id")} type="hidden" />
        <input {...register("name")} placeholder="Name" className="border p-2 block" />
        <input {...register("quantity")} type="number" placeholder="Quantity" className="border p-2 block" />
        <input {...register("unitPrice")} type="number" placeholder="Unit Price" className="border p-2 block" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">Save Product</button>
      </form>

      {/* Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>Name</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod._id} className="border-t">
              <td>{prod.name}</td>
              <td>{prod.quantity}</td>
              <td>${prod.unitPrice}</td>
              <td>
                <button onClick={() => handleEdit(prod)} className="text-blue-500 mr-2">Edit</button>
                <button onClick={() => handleDelete(prod._id!)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}
