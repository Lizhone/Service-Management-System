import { useEffect, useState } from "react";
import client from "../../api/client";

export default function ServiceBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await client.get("/service-bookings");
      setBookings(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.error("Failed to load service bookings", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const approveBooking = async (id) => {
    const ok = window.confirm("Approve this service booking?");
    if (!ok) return;

    try {
      await client.put(`/service-bookings/${id}/approve`);
      loadBookings();
    } catch (err) {
      console.error("Approve failed", err);
      alert("Failed to approve booking");
    }
  };

  if (loading) return <p>Loading service bookings…</p>;

  return (
    <div>
      <h2>Service Bookings</h2>

      <table style={{ width: "100%", marginTop: "16px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Vehicle Part</th>
            <th>Date</th>
            <th>Time Slot</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No service bookings
              </td>
            </tr>
          ) : (
            bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.customer?.name || "-"}</td>
                <td>{b.vehiclePart}</td>
                <td>{new Date(b.preferredDate).toLocaleDateString()}</td>
                <td>{b.timeSlot}</td>
                <td>{b.status}</td>
                <td>
                  {b.status === "PENDING" ? (
                    <button onClick={() => approveBooking(b.id)}>
                      Approve
                    </button>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
