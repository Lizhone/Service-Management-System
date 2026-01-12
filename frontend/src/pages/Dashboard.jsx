import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";

export default function Dashboard() {
  const [jobCards, setJobCards] = useState([]);

  useEffect(() => {
    client.get("/job-cards/search").then((res) => setJobCards(res.data || []));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>

      <Link
        to="/job-cards/new"
        className="inline-block mb-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        + Create Job Card
      </Link>

      <ul className="space-y-2">
        {jobCards.map((j) => (
          <li
            key={j.id}
            className="border p-3 rounded flex justify-between items-center"
          >
            <span>
              {j.jobCardNumber} — {j.status}
            </span>

            <Link
              to={`/job-cards/${j.id}/inspection`}
              className="text-blue-600 underline"
            >
              Inspect
            </Link>
            <Link
              to={`/job-cards/${j.id}/complaints`}
              className="text-sm text-indigo-600 underline"
            >
              Complaints
            </Link>

          </li>
        ))}
      </ul>
    </div>
  );
}
