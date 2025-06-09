import { useForm } from "react-hook-form";
import api from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type LoginData = {
  username: string;
  password: string;
};

export default function Login() {
  const { register, handleSubmit } = useForm<LoginData>();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginData) => {
    try {
      const res = await api.post("/login", data);
      localStorage.setItem("token", res.data.token);
      toast.success("Logged in");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register("username")} placeholder="Username" className="border p-2 block" />
        <input {...register("password")} type="password" placeholder="Password" className="border p-2 block" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 cursor-pointer">Login</button>
      </form>
    </div>
  );
}
