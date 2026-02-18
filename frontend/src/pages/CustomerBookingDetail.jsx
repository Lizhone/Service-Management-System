import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import client from "../api/client";

export default function CustomerBookingDetail() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
  }, []);

  const fetchDetail = async () => {
    try {
      const res = await client.get(
        `/service-bookings/customer/detail/${bookingId}`
      );
      setBooking(res.data);
    } catch (err) {
      console.error("Failed to load booking detail:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-white bg-[#01263B] min-h-screen">
        Loading...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-6 text-white bg-[#01263B] min-h-screen">
        Booking not found
      </div>
    );
  }

  return (
    <div className="p-6 text-white bg-[#01263B] min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-600 px-3 py-1 rounded"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-4">
        Service Work Details
      </h2>

      {/* ================= BASIC INFO ================= */}
      <div className="bg-[#0A3A55] p-4 rounded mb-4">
        <p><strong>Status:</strong> {booking.status}</p>
        <p><strong>Service Type:</strong> {booking.serviceType}</p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(booking.preferredDate).toLocaleDateString()}
        </p>
      </div>

      {/* ================= WORK HISTORY ================= */}
      <h3 className="text-lg font-semibold mb-3">
        Work Timeline
      </h3>

      {booking.jobCard?.workLogs?.length === 0 && (
        <p className="text-gray-400">
          Work has not started yet.
        </p>
      )}

      {booking.jobCard?.workLogs?.map((log) => (
        <div
          key={log.id}
          className="bg-[#0A3A55] p-4 rounded mb-3"
        >
          <p><strong>Task:</strong> {log.taskName}</p>
          <p>Status: {log.status}</p>

          <p>
            Started:{" "}
            {log.startedAt
              ? new Date(log.startedAt).toLocaleString()
              : "-"}
          </p>

          {log.completedAt && (
            <p>
              Completed:{" "}
              {new Date(log.completedAt).toLocaleString()}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
