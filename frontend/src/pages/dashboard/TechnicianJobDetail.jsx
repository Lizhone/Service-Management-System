import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import client from "../../api/client";

export default function TechnicianJobDetail() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH BOOKING ================= */
  useEffect(() => {
    fetchDetail();
  }, [bookingId]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await client.get(`/technicians/booking/${bookingId}`);
      setBooking(res.data);

      // If already in progress → calculate timer from startedAt
      const activeLog = res.data?.jobCard?.workLogs?.find(
        (log) => log.status === "IN_PROGRESS"
      );

      if (activeLog?.startedAt) {
        const seconds =
          Math.floor(
            (new Date() - new Date(activeLog.startedAt)) / 1000
          );
        setTimer(seconds);
      }

    } catch (err) {
      console.error("Failed to fetch booking:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= TIMER ================= */
  useEffect(() => {
    let interval;

    if (booking?.status === "IN_PROGRESS") {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [booking]);

  /* ================= START WORK ================= */
  const handleStart = async () => {
    if (!taskName) {
      alert("Task name is required");
      return;
    }

    try {
      await client.put(`/technicians/start/${bookingId}`, {
        taskName,
        description
      });

      fetchDetail();
    } catch (err) {
      console.error("Start failed:", err);
    }
  };

  /* ================= COMPLETE WORK ================= */
  const handleComplete = async () => {
    try {
      await client.put(`/technicians/complete/${bookingId}`);
      fetchDetail();
    } catch (err) {
      console.error("Complete failed:", err);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="p-6 text-white bg-[#01263B] min-h-screen">
        Loading...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-6 text-red-400 bg-[#01263B] min-h-screen">
        Booking not found
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="p-6 text-white bg-[#01263B] min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-600 px-3 py-1 rounded"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-4">
        Service Details
      </h2>

      <div className="bg-[#0A3A55] p-4 rounded mb-4">
        <p><strong>Customer:</strong> {booking.customer?.name}</p>
        <p><strong>Service Type:</strong> {booking.serviceType}</p>
        <p><strong>Status:</strong> {booking.status}</p>
      </div>

      {/* ================= ACTION SECTION ================= */}
      {booking.status !== "COMPLETED" && (
        <div className="bg-[#0A3A55] p-4 rounded mb-4">

          {/* Show form only before starting */}
          {booking.status === "CLAIMED" && (
            <>
              <input
                type="text"
                placeholder="Task Name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full p-2 mb-3 text-black rounded"
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 mb-3 text-black rounded"
              />

              <button
                onClick={handleStart}
                className="bg-cyan-600 px-4 py-2 rounded hover:bg-cyan-500"
              >
                Start Work
              </button>
            </>
          )}

          {/* In Progress */}
          {booking.status === "IN_PROGRESS" && (
            <>
              <p className="mb-3 text-cyan-400">
                Elapsed Time: {timer}s
              </p>

              <button
                onClick={handleComplete}
                className="bg-green-600 px-4 py-2 rounded hover:bg-green-500"
              >
                Complete Work
              </button>
            </>
          )}

        </div>
      )}

      {/* ================= COMPLETED ================= */}
      {booking.status === "COMPLETED" && (
        <div className="bg-green-800 p-4 rounded">
          Work Completed ✔ (Locked)
        </div>
      )}

      {/* ================= WORK HISTORY ================= */}
      <h3 className="text-lg font-semibold mt-6">
        Work History
      </h3>

      {booking.jobCard?.workLogs?.length === 0 && (
        <p className="text-gray-400 mt-2">
          No work history yet
        </p>
      )}

      {booking.jobCard?.workLogs?.map((log) => (
        <div key={log.id} className="bg-[#0A3A55] p-3 rounded mt-2">
          <p><strong>{log.taskName}</strong></p>
          <p>Status: {log.status}</p>
          <p>Started: {new Date(log.startedAt).toLocaleString()}</p>
          {log.completedAt && (
            <p>Completed: {new Date(log.completedAt).toLocaleString()}</p>
          )}
        </div>
      ))}
    </div>
  );
}
