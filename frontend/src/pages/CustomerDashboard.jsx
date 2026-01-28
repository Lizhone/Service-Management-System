import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "../api/client";
import { Link } from "react-router-dom";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [jobCards, setJobCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/customers/me/job-cards");
        setJobCards(res.data.data || []);
      } catch (err) {
        setError("Failed to load job cards");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Welcome, {user?.name}</h1>
      <h2 className="text-lg mb-2">Your Job Cards</h2>
      {jobCards.length === 0 ? (
        <div className="text-gray-500">No job cards yet.</div>
      ) : (
        <ul className="space-y-2">
          {jobCards.map((j) => (
            <li key={j.id} className="border p-3 rounded flex justify-between items-center gap-4">
              <div>
                <div className="font-semibold">{j.jobCardNumber}</div>
                <div className="text-sm text-gray-600">Vehicle: {j.vehicle?.model || "-"}</div>
                <div className="text-sm text-gray-600">Status: {j.status}</div>
              </div>
              <Link to={`/job-cards/${j.id}`} className="text-blue-600 underline">View</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
