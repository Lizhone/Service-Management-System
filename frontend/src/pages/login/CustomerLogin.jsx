import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";
import { useAuth } from "../../hooks/useAuth";

export default function CustomerLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    localStorage.removeItem("token");
    localStorage.removeItem("user");


    try {
      // ✅ CORRECT ROUTE
      const res = await client.post("/auth/customer/login", {
        mobileNumber,
        password,
      });

      const { token, customer } = res.data;

      if (!token || !customer) {
        throw new Error("Invalid response");
      }

      // ✅ ONLY place auth state is set
      login(customer, token);

      navigate("/dashboard");
    } catch (err) {
      console.error("LOGIN ERROR ❌", err);
      setError("Invalid mobile number or password");
    }
  };

  return (
    <div>
      <h1>Customer Login</h1>

      <form onSubmit={handleLogin}>
        <div>
          <label>Mobile Number</label>
          <input
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
