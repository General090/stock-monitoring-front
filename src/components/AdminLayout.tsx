import { Link, useNavigate } from "react-router-dom";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
        <h2 className="text-xl font-bold">Admin</h2>
        <nav className="space-y-2">
          <Link to="/dashboard" className="block hover:underline">Dashboard</Link>
          <Link to="/products" className="block hover:underline">Products</Link>
          <Link to="/low-stock" className="block py-2 hover:underline">Low Stock</Link>
          <Link to="/receipts" className="block hover:underline">Receipts</Link>
          <button onClick={handleLogout} className="block text-red-400 hover:underline mt-4 cursor-pointer">Logout</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
}
