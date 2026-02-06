import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../hooks/useAuth";

export default function CustomerDashboard() {
  const { user, loading } = useAuth(); // ✅ include loading
  const navigate = useNavigate();

  const [jobCards, setJobCards] = useState([]);
  const [serviceBookings, setServiceBookings] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [error, setError] = useState("");

  /* 🚫 WAIT FOR AUTH */
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login/customer", { replace: true });
    }
  }, [loading, user, navigate]);

  /* ================= JOB CARDS ================= */
  useEffect(() => {
    if (loading || !user) return; // ✅ GUARD

    const loadJobCards = async () => {
      try {
        const res = await client.get("/customers/me/job-cards");
        setJobCards(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load job cards");
      } finally {
        setLoadingJobs(false);
      }
    };

    loadJobCards();
  }, [loading, user]);

  /* ================= SERVICE BOOKINGS ================= */
  useEffect(() => {
    if (loading || !user) return; // ✅ GUARD

    const loadServiceBookings = async () => {
      try {
        const res = await client.get("/customers/me/service-bookings");
        setServiceBookings(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingBookings(false);
      }
    };

    loadServiceBookings();
  }, [loading, user]);

  /* ⏳ WAIT SCREEN */
  if (loading || !user) {
    return null;
  }

  const statusColors = {
    OPEN: "bg-yellow-100 text-yellow-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    CLOSED: "bg-green-100 text-green-800",
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">
        Welcome, {user?.name}
      </h1>

      <p className="mb-6 text-gray-700">
        Manage and track your service requests
      </p>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-8"
        onClick={() => navigate("/customer/book-service")}
      >
        + Book Service
      </button>

      {/* ================= SERVICE BOOKINGS ================= */}
      <h2 className="text-lg font-semibold mb-3">
        Service Bookings
      </h2>

      {loadingBookings ? (
        <p className="text-gray-500 mb-10">Loading...</p>
      ) : serviceBookings.length === 0 ? (
        <p className="text-gray-500 mb-10">
          No service bookings found.
        </p>
      ) : (
        <table className="min-w-full border bg-white mb-12">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3 text-left">Booking Ref</th>
              <th className="py-2 px-3 text-left">Part</th>
              <th className="py-2 px-3 text-left">Date</th>
              <th className="py-2 px-3 text-left">Time</th>
              <th className="py-2 px-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {serviceBookings.map((b) => (
              <tr key={b.id} className="border-t">
                <td className="py-2 px-3 font-mono">SB-{b.id}</td>
                <td className="py-2 px-3">{b.vehiclePart}</td>
                <td className="py-2 px-3">
                  {new Date(b.preferredDate).toLocaleDateString()}
                </td>
                <td className="py-2 px-3">{b.timeSlot}</td>
                <td className="py-2 px-3 font-semibold">{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ================= JOB CARDS ================= */}
      <h2 className="text-lg font-semibold mb-3">
        Job Cards
      </h2>

      {loadingJobs ? (
        <p className="text-gray-500">Loading...</p>
      ) : jobCards.length === 0 ? (
        <p className="text-gray-500">
          No job cards found.
        </p>
      ) : (
        <table className="min-w-full border bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3 text-left">Job Card #</th>
              <th className="py-2 px-3 text-left">Vehicle</th>
              <th className="py-2 px-3 text-left">Service Type</th>
              <th className="py-2 px-3 text-left">Status</th>
              <th className="py-2 px-3 text-left">Created</th>
              <th className="py-2 px-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {jobCards.map((job) => (
              <tr key={job.id} className="border-t">
                <td className="px-3 py-2 font-mono">
                  {job.jobCardNumber}
                </td>
                <td className="px-3 py-2">
                  {job.vehicle?.model || "-"}
                </td>
                <td className="px-3 py-2">
                  {job.serviceType}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      statusColors[job.status] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {job.status}
                  </span>
                </td>
                <td className="px-3 py-2">
                  {new Date(job.createdAt).toLocaleDateString()}
                </td>
                <td className="px-3 py-2 space-x-3">
                  <Link
                    to={`/job-cards/${job.id}`}
                    className="text-blue-600 underline"
                  >
                    View
                  </Link>

                  <span style={{ margin: "0 12px" }}>|</span>

                  <Link
                    to={`/customer/raise-complaint?jobCardId=${job.id}`}
                    className="text-red-600 underline"
                  >
                    Raise Complaint
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {error && (
        <p className="text-red-600 mt-6">{error}</p>
      )}
    </div>
  );
}
