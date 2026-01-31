import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../hooks/useAuth";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [jobCards, setJobCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadJobCards = async () => {
      try {
        const res = await client.get("/customers/me/job-cards");
        setJobCards(Array.isArray(res.data) ? res.data : res.data.data || []);
      } catch (err) {
        setError("Failed to load job cards");
      } finally {
        setLoading(false);
      }
    };
    loadJobCards();
  }, []);

  const filtered = jobCards.filter(j => {
    return (
      (!search || j.jobCardNumber?.toLowerCase().includes(search.toLowerCase())) &&
      (!statusFilter || j.status === statusFilter) &&
      (!typeFilter || j.serviceType === typeFilter)
    );
  });

  const statusColors = {
    OPEN: "bg-yellow-100 text-yellow-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-1">Welcome, {user?.name}</h1>
      <div className="mb-6 text-gray-700">
        Manage and track your service requests
      </div>

      {/* Top Action */}
      <div className="flex gap-3 mb-6">
        <button
  className="bg-blue-600 text-white px-4 py-2 rounded"
  onClick={() => navigate("/customer/book-service")}
>
  + Book Service
</button>

      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Search Job Card #</label>
          <input
            className="border p-2 rounded w-40"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="e.g. 000123"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            className="border p-2 rounded w-32"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Service Type</label>
          <select
            className="border p-2 rounded w-36"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="GENERAL">General</option>
            <option value="BATTERY">Battery</option>
            <option value="COMPLAINT">Complaint</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border bg-white">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-3 border-b">Job Card #</th>
              <th className="py-2 px-3 border-b">Vehicle</th>
              <th className="py-2 px-3 border-b">Service Type</th>
              <th className="py-2 px-3 border-b">Status</th>
              <th className="py-2 px-3 border-b">Created Date</th>
              <th className="py-2 px-3 border-b">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-4 text-center">Loading...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No job cards found.
                </td>
              </tr>
            ) : (
              filtered.map(job => (
                <tr key={job.id} className="border-b">
                  <td className="py-2 px-3 font-mono">{job.jobCardNumber}</td>
                  <td className="py-2 px-3">{job.vehicle?.model || "-"}</td>
                  <td className="py-2 px-3">{job.serviceType}</td>
                  <td className="py-2 px-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusColors[job.status] || ""}`}>
                      {job.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-3">
                    <Link
                      to={`/job-cards/${job.id}`}
                      className="text-blue-600 underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {error && <div className="text-red-600 mt-4">{error}</div>}
    </div>
  );
}
