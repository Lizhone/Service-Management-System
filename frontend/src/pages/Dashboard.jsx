import { useEffect, useState } from "react";
import client from "../api/client";
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [jobCards, setJobCards] = useState([]);

  const loadJobCards = async () => {
    try {
      const res = await client.get("/job-cards/search");
      setJobCards(res.data || []);
    } catch (err) {
      console.error("Dashboard load failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobCards();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>

      <Link
        to="/job-cards/new"
        className="inline-block mb-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        + Create Job Card
      </Link>

      {jobCards.length === 0 ? (
        <div>No job cards yet.</div>
      ) : (
        <ul className="space-y-2">
          {jobCards.map((j) => (
            <li key={j.id} className="border p-2 rounded">
              {j.jobCardNumber} — {j.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
