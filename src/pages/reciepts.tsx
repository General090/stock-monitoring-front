import { useForm } from "react-hook-form";
import api from "../services/api";
import { toast } from "react-toastify";
import AdminLayout from "../components/AdminLayout";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const handleGeneratePDF = async () => {
  const element = document.getElementById("receipt-preview");
  if (!element) return;
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF();
  pdf.addImage(imgData, "PNG", 10, 10);
  pdf.save("receipt.pdf");
};


type ReceiptForm = {
  productId: string;
  quantity: number;
};

export default function Receipts() {
  const { register, handleSubmit } = useForm<ReceiptForm>();

  const onSubmit = async (data: ReceiptForm) => {
    try {
      await api.post("/api/receipts", { ...data, type: "sale" });
      toast.success("Receipt saved!");
    } catch {
      toast.error("Failed to save receipt.");
    }
  };

  return (
    <AdminLayout>
        <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Create Receipt</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input {...register("productId")} placeholder="Product ID" className="border p-2 block" />
            <input {...register("quantity")} type="number" placeholder="Quantity" className="border p-2 block" />
            <button type="submit" className="bg-green-500 text-white px-4 py-2">Submit</button>
        </form>
        </div>

        <div id="receipt-preview" className="border p-4 mt-4 w-[300px]">
            <h3>Receipt Preview</h3>
            <p>Product ID: {receipt?.productId}</p>
            <p>Quantity: {receipt?.quantity}</p>
            <p>Total: {receipt?.quantity * price}</p>
        </div>
<button onClick={handleGeneratePDF} className="bg-blue-500 text-white px-4 py-2 mt-2">Download PDF</button>

    </AdminLayout>
  );
}
