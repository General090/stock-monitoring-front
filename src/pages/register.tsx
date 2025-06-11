import { useForm } from "react-hook-form";
import api from "../services/api";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

type RegisterData = {
  name: string;
  email: string;
  password: string;
};

export default function Register() {
  const { register, handleSubmit } = useForm<RegisterData>();
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterData) => {
    try {
      const res = await api.post("/auth/register", data);
      localStorage.setItem("token", res.data.token);
      toast.success("Registered!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Registration failed!");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-700">StockEase</h1>
        <div className="space-x-4">
          <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
          <Link to="/login" className="text-blue-600 font-medium hover:underline">Login</Link>
          <Link to="/register" className="text-green-600 font-medium hover:underline">Register</Link>
        </div>
      </nav>

      {/* Registration Form */}
      <div className="flex items-center justify-center h-[80vh]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-md p-8 rounded-lg w-full max-w-md space-y-6"
        >
          <h2 className="text-2xl font-semibold text-center text-gray-800">Create an Account</h2>

          <div>
            <label className="block text-gray-600 mb-1">Username</label>
            <input
              {...register("name")}
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              {...register("email")}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              {...register("password")}
              type="password"
              placeholder="Enter a password"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
