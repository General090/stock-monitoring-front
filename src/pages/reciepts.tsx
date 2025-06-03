import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../services/api";
import { toast } from "react-toastify";
import AdminLayout from "../components/AdminLayout";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type ReceiptForm = {
  productId: string;
  quantity: number;
};

type Product = {
  _id: string;
  name: string;
  price: number;
};

type SavedReceipt = {
  product: Product;
  quantity: number;
};

export default function Receipts() {
  const { register, handleSubmit, reset, watch } = useForm<ReceiptForm>();
  const [products, setProducts] = useState<Product[]>([]);
  const [savedReceipt, setSavedReceipt] = useState<SavedReceipt | null>(null);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (err) {
        toast.error("Failed to load products");
      }
    };
    fetchProducts();
  }, []);

  const onSubmit = async (data: ReceiptForm) => {
    try {
      const product = products.find((p) => p._id === data.productId);
      if (!product) throw new Error("Product not found");

      await api.post("/receipts", { ...data, type: "sale" });
      toast.success("Receipt saved!");

      // Save receipt locally to show preview
      setSavedReceipt({ product, quantity: data.quantity });

      // Reset form fields
      reset();
    } catch (err) {
      toast.error("Failed to save receipt.");
    }
  };

  const handleGeneratePDF = async () => {
    const element = document.getElementById("receipt-preview");
    if (!element) return;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10);
    pdf.save("receipt.pdf");
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Create Receipt</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
          <select
            {...register("productId")}
            className="input input-bordered w-full"
            required
            defaultValue=""
          >
            <option value="" disabled>
              Select product
            </option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name} - ₦{product.price}
              </option>
            ))}
          </select>

          <input
            {...register("quantity")}
            type="number"
            placeholder="Quantity"
            min={1}
            className="input input-bordered w-full"
            required
          />

          <button type="submit" className="btn cursor-pointer bg-green-600 text-white w-full">
            Save Receipt
          </button>
        </form>

        {/* Show preview only AFTER saving */}
        {savedReceipt && (
          <>
            <div
              id="receipt-preview"
              className="border p-4 mt-6 w-[300px] bg-white rounded shadow"
            >
              <h3 className="text-lg font-semibold mb-2">Receipt Preview</h3>
              <p>
                <strong>Product:</strong> {savedReceipt.product.name}
              </p>
              <p>
                <strong>Price:</strong> ₦{savedReceipt.product.price}
              </p>
              <p>
                <strong>Quantity:</strong> {savedReceipt.quantity}
              </p>
              <p>
                <strong>Total:</strong> ₦
                {savedReceipt.product.price * Number(savedReceipt.quantity)}
              </p>
            </div>

            <button
              onClick={handleGeneratePDF}
              className="btn bg-blue-600 text-white mt-4"
            >
              Download PDF
            </button>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
