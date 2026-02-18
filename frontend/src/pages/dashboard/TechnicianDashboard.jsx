import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";

export default function TechnicianDashboard() {
  const navigate = useNavigate();

  const [technicians, setTechnicians] = useState([]);
  const [selectedTech, setSelectedTech] = useState(null);
  const [availableBookings, setAvailableBookings] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =========================================================
     LOAD TECHNICIANS (ON FIRST RENDER)
  ========================================================= */
  useEffect(() => {
    loadTechnicians();
  }, []);

  const loadTechnicians = async () => {
    try {
      const { data } = await client.get("/technicians");
      setTechnicians(data);
    } catch (error) {
      console.error("Failed to load technicians:", error);
    }
  };

  /* =========================================================
     LOAD AVAILABLE BOOKINGS
  ========================================================= */
  const loadAvailableBookings = async () => {
    try {
      const { data } = await client.get("/technicians/available");
      setAvailableBookings(data);
    } catch (error) {
      console.error("Failed to load available bookings:", error);
    }
  };

  /* =========================================================
     LOAD CLAIMED BOOKINGS
  ========================================================= */
  const loadClaimedBookings = async (techId) => {
    try {
      const { data } = await client.get(
        `/technicians/${techId}/claimed`
      );
      setMyJobs(data);
    } catch (error) {
      console.error("Failed to load claimed bookings:", error);
    }
  };

  /* =========================================================
     SELECT TECHNICIAN
  ========================================================= */
  const handleSelectTechnician = async (tech) => {
    setSelectedTech(tech);
    setLoading(true);

    await Promise.all([
      loadAvailableBookings(),
      loadClaimedBookings(tech.id),
    ]);

    setLoading(false);
  };

  /* =========================================================
     CLAIM BOOKING
  ========================================================= */
  const handleClaimBooking = async (bookingId) => {
    try {
      await client.put(
        `/technicians/claim/${bookingId}/${selectedTech.id}`
      );

      // After claiming → go to work page
      navigate(`/dashboard/technician/job/${bookingId}`);
    } catch (error) {
      console.error("Failed to claim booking:", error);
    }
  };

  /* =========================================================
     GO BACK TO TECH LIST
  ========================================================= */
  const handleBack = () => {
    setSelectedTech(null);
    setAvailableBookings([]);
    setMyJobs([]);
  };

  /* =========================================================
     RENDER
  ========================================================= */
  return (
    <div className="p-6 min-h-screen text-white bg-[#01263B]">
      <h1 className="text-2xl font-bold mb-6">
        Technician Dashboard
      </h1>

      {/* ================= SELECT TECHNICIAN ================= */}
      {!selectedTech && (
        <>
          <h2 className="text-lg font-semibold mb-4">
            Select Technician
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {technicians.map((tech) => (
              <div
                key={tech.id}
                onClick={() => handleSelectTechnician(tech)}
                className="cursor-pointer p-4 rounded-lg bg-[#0A3A55] hover:bg-cyan-600 transition"
              >
                {tech.name}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ================= TECHNICIAN DETAIL ================= */}
      {selectedTech && (
        <>
          <button
            onClick={handleBack}
            className="mb-4 bg-gray-600 px-3 py-1 rounded hover:bg-gray-500"
          >
            ← Back
          </button>

          <h2 className="text-xl font-bold mb-4">
            {selectedTech.name}
          </h2>

          {loading && (
            <p className="text-cyan-400 mb-4">
              Loading bookings...
            </p>
          )}

          {/* ================= AVAILABLE BOOKINGS ================= */}
          <h3 className="text-lg font-semibold mb-3">
            Available Bookings
          </h3>

          {availableBookings.length === 0 && (
            <p className="text-gray-400 mb-4">
              No available bookings
            </p>
          )}

          {availableBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-[#0A3A55] p-4 mb-3 rounded"
            >
              <p>
                <strong>{booking.customer?.name}</strong>
              </p>

              <p className="text-sm text-gray-300">
                {booking.vehiclePart} | {booking.serviceType}
              </p>

              <p className="text-sm text-gray-400">
                {new Date(
                  booking.preferredDate
                ).toLocaleDateString()}{" "}
                | {booking.timeSlot}
              </p>

              <button
                onClick={() =>
                  handleClaimBooking(booking.id)
                }
                className="mt-3 bg-cyan-600 px-3 py-1 rounded hover:bg-cyan-500"
              >
                Take Job
              </button>
            </div>
          ))}

          {/* ================= MY CLAIMED BOOKINGS ================= */}
          <h3 className="text-lg font-semibold mt-6 mb-3">
            My Claimed Bookings
          </h3>

          {myJobs.length === 0 && (
            <p className="text-gray-400">
              No claimed bookings
            </p>
          )}

          {myJobs.map((booking) => (
            <div
              key={booking.id}
              className="bg-[#0A3A55] p-4 mb-3 rounded"
            >
              <p>
                <strong>{booking.customer?.name}</strong>
              </p>

              <p className="text-sm text-gray-300">
                {booking.vehiclePart} | {booking.serviceType}
              </p>

              <p className="text-sm text-cyan-400 mb-3">
                Status: {booking.status}
              </p>

              {/* Only allow navigation if NOT completed */}
              {booking.status !== "COMPLETED" && (
                <button
                  onClick={() =>
                    navigate(
                      `/dashboard/technician/job/${booking.id}`
                    )
                  }
                  className={`px-3 py-1 rounded ${
                    booking.status === "IN_PROGRESS"
                      ? "bg-yellow-600 hover:bg-yellow-500"
                      : "bg-cyan-600 hover:bg-cyan-500"
                  }`}
                >
                  {booking.status === "IN_PROGRESS"
                    ? "Resume Work"
                    : "Start Work"}
                </button>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
