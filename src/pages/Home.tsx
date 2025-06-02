import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h1>Welcome to My App</h1>
      <div style={{ marginTop: 20 }}>
        <Link to="/login">
          <button style={{ marginRight: 10 }}>Login</button>
        </Link>
        <Link to="/register">
          <button>Register</button>
        </Link>
      </div>
    </div>
  );
}
