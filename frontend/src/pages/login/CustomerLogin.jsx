import { useState } from "react";
import { Phone, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import client from "../../api/client";
import { Link } from "react-router-dom";

export default function CustomerLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await client.post("/auth/customer/login", {
        mobileNumber,
        password,
      });

      const { token, customer } = res.data;

      login(customer, token);
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      setError("Invalid mobile number or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#01263B]">

      <div className="bg-white w-105 rounded-3xl shadow-2xl p-10">

        <h1 className="text-3xl font-bold text-[#01263B] text-center">
          Welcome Back!
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Please login to your account.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Mobile Field */}
          <div className="flex items-center bg-gray-100 rounded-xl px-4 py-3 border border-gray-200">
            <Phone className="text-[#01263B] mr-3" size={20} />

            <input
              type="text"
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Password Field */}
          <div className="flex items-center bg-gray-100 rounded-xl px-4 py-3 border border-gray-200">
            <Lock className="text-[#01263B] mr-3" size={20} />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[#01263B]"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link
                to="/customer-forgot-password"
                className="text-[#01263B] text-sm hover:underline"
          >
                Forgot password?
            </Link>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#01263B] text-white py-3 rounded-xl text-lg font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
}
