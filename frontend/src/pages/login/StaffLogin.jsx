import { useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

      login(user, token);

      const dashboardRoutes = {
        ADMIN: "/dashboard/admin",
        SERVICE_ADVISOR: "/dashboard/service-advisor",
        TECHNICIAN: "/dashboard/technician",
        SUPPLY_CHAIN: "/dashboard/supply-chain",
        SALES: "/dashboard/sales",
      };

      navigate(dashboardRoutes[user.role] || "/dashboard/admin");
    } catch (err) {
      console.log(err);
      setError("Staff login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#01263B]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-7 w-120"
      >
        {/* Avatar Circle */}
        <div className="w-32 h-32 rounded-full border-4 border-[#01263B] bg-white flex items-center justify-center">
          <User size={52} strokeWidth={3} className="text-[#01263B]" />
        </div>

        <h2 className="text-white text-2xl font-semibold">
          Staff Login
        </h2>

        {/* Show Error */}
        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        {/* Email Field */}
        <div
          className="w-120 flex items-center gap-3 px-4 py-3 
                     border-2 border-white 
                     rounded-xl bg-transparent"
        >
          <User size={30} className="text-white" />

          <input
  type="email"
  placeholder="Username"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="flex-1 bg-transparent 
             outline-none 
             text-[#01263B] 
             placeholder-gray-400"
/>


        </div>

        {/* Password Field */}
        <div
          className="w-120 flex items-center gap-3 px-4 py-3 
                     border-2 border-white 
                     rounded-xl bg-transparent"
        >
          <Lock size={30} className="text-white" />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 bg-transparent 
           outline-none 
           text-[#01263B] 
           placeholder-gray-400"

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
            <a href="/login/customer" className="underline font-medium">
              Login here
            </a>
          </span>

          <a href="#" className="underline">
            Forgot password?
          </a>
        </div>

        {/* Button */}
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
