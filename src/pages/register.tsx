import { useForm } from "react-hook-form";
import api from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register("name")} placeholder="Username" className="border p-2 block" />
        <input {...register("email")} placeholder="Email" className="border p-2 block" />
        <input {...register("password")} type="password" placeholder="Password" className="border p-2 block" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 cursor-pointer">Register</button>
      </form>
    </div>
  );
}
