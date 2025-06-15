import { useForm } from "react-hook-form";
import api from "../services/api";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

type LoginData = {
  email: string;
  password: string;
};

export default function Login() {
  const { register, handleSubmit } = useForm<LoginData>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginData) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", data);
      localStorage.setItem("token", res.data.token);
      toast.success("Logged in");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-700">StockEase</h1>
        <div className="space-x-4">
          <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
          <Link to="/login" className="text-blue-600 font-medium hover:underline">Login</Link>
          <Link to="/register" className="text-green-600 font-medium hover:underline">Register</Link>
        </div>
      </nav>

      <div className="flex items-center justify-center h-[80vh]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-md p-8 rounded-lg w-full max-w-md space-y-6"
        >
          <h2 className="text-2xl font-semibold text-center text-gray-800">Login to Your Account</h2>

          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              {...register("email")}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded px-3 py-2"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              {...register("password")}
              type="password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded px-3 py-2"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded transition text-white cursor-pointer ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
