import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import client from "../../api/client";

export default function CustomerLogin() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await client.post("/auth/customer/login", {
        mobileNumber,
        password,
      });

      login(res.data.user, res.data.token);

      navigate("/dashboard");
    } catch (err) {
      setError("Invalid mobile number or password");
    }
  };

  return (
    <div className="login-page">
      <h1>Customer Login</h1>

      <form onSubmit={handleLogin}>
        <label>Mobile Number</label>
        <input
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
