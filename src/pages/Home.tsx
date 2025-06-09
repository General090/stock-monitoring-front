import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h1>Welcome to My App</h1>
      <div style={{ marginTop: 20 }} className="flex items-center justify-center gap-5">
        <Link to="/login">
          <button style={{ marginRight: 10 }} className="bg-blue-500">Login</button>
        </Link>
        <Link to="/register">
          <button className="bg-green-500">Register</button>
        </Link>
      </div>
    </div>
  );
}
