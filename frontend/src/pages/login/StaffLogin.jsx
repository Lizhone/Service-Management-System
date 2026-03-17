import { useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import authClient from "../../api/authClient";

export default function StaffLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authClient.post("/auth/staff/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      // Save user + token
      login(user, token);

      const dashboardRoutes = {
        ADMIN: "/dashboard/admin",
        SERVICE_ADVISOR: "/dashboard/service-advisor",
        TECHNICIAN: "/dashboard/technician",
        SUPPLY_CHAIN: "/dashboard/supply-chain",
        SALES: "/dashboard/sales",
      };

      // 🔹 replace:true prevents forward navigation
      navigate(
        dashboardRoutes[user.role] || "/dashboard/admin",
        { replace: true }
      );

    } catch (err) {
      console.error(err);
      setError("Staff login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#01263B]">

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-7 w-[480px]"
      >

        {/* Avatar */}
        <div className="w-32 h-32 rounded-full border-4 border-[#01263B] bg-white flex items-center justify-center">
          <User size={52} strokeWidth={3} className="text-[#01263B]" />
        </div>

        <h2 className="text-white text-2xl font-semibold">
          Staff Login
        </h2>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        {/* Email */}
        <div className="w-full flex items-center gap-3 px-4 py-3 border-2 border-white rounded-xl">
          <User size={26} className="text-white" />

          <input
            type="email"
            placeholder="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
          />
        </div>

        {/* Password */}
        <div className="w-full flex items-center gap-3 px-4 py-3 border-2 border-white rounded-xl">
          <Lock size={26} className="text-white" />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-white"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Links */}
        <div className="flex justify-between w-full text-white text-sm">

          <span>
            Customer?{" "}
            <Link
              to="/login/customer"
              className="underline font-medium"
            >
              Login here
            </Link>
          </span>

          <Link
            to="/forgot-password"
            className="underline"
          >
            Forgot password?
          </Link>

        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-16 rounded-2xl bg-white text-[#01263B] text-xl tracking-wide shadow-lg hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Logging in..." : "LOGIN"}
        </button>

      </form>

    </div>
  );
}