import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ setAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", {
        email,
        password,
      });

      const { token } = res.data;
      localStorage.setItem("adminToken", token);
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      setAuth(true);
      navigate("/");
    } catch (err) {
      const message = err.response?.data?.message || "Login failed.";
      setError(message);
    }
  };

  return (
    <div className="login-page" style={{ padding: "40px", maxWidth: "420px", margin: "0 auto" }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            required
          />
        </div>

        <div className="form-group" style={{ position: "relative" }}>
          <label>Password</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            style={{
              position: "absolute",
              right: "12px",
              top: "38px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: 0,
              fontSize: "18px",
            }}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {error && <div className="form-error">{error}</div>}

        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
