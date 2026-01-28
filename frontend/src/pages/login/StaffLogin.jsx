import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import authClient from '../../api/authClient';

export default function StaffLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authClient.post('/auth/staff/login', {
        email,
        password,
      });

      const { token, user } = res.data;

      // Store token and user using auth hook
      login(user, token);

      // Redirect based on role
      const dashboardRoutes = {
        ADMIN: '/dashboard/admin',
        SERVICE_ADVISOR: '/dashboard/service-advisor',
        TECHNICIAN: '/dashboard/technician',
        SUPPLY_CHAIN: '/dashboard/supply-chain',
        SALES: '/dashboard/sales',
      };

      const redirectPath = dashboardRoutes[user.role] || '/dashboard/admin';
      navigate(redirectPath);
    } catch (err) {
      setError(err.response?.data?.error || 'Staff login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
        <h1 className="text-xl font-bold mb-4">Staff Login</h1>
        <p className="text-sm text-gray-600 mb-4">Enter your staff credentials</p>

        {error && <p className="text-red-600 mb-3 text-sm">{error}</p>}

        <input
          className="border w-full mb-3 p-2 rounded"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <input
          className="border w-full mb-4 p-2 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <button
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50 hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Logging in…' : 'Staff Login'}
        </button>

        <div className="mt-4 text-center text-sm">
          <p className="text-gray-600">
            Customer?{' '}
            <a href="/login/customer" className="text-blue-600 underline">
              Customer Login
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
