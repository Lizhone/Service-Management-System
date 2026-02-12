import { useEffect, useState } from "react";
import client from "../../api/client";

export default function ServiceBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =============================
     LOAD BOOKINGS
  ============================== */
  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      // Admin sees ALL bookings (read-only)
      const res = await client.get("/service-bookings");
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load service bookings", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading service bookings…</p>;

  return (
    <div style={{ padding: "24px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: 600 }}>
        Service Bookings
      </h2>

      <table
        style={{
          width: "100%",
          marginTop: "16px",
          borderCollapse: "collapse",
          background: "#fff",
        }}
      >
        <thead>
          <tr style={{ background: "#f1f5f9" }}>
            <Th>ID</Th>
            <Th>Customer</Th>
            <Th>Vehicle Part</Th>
            <Th>Service Type</Th>
            <Th>Date</Th>
            <Th>Time</Th>
          </tr>
        </thead>

        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <Td colSpan={6} center>
                No service bookings
              </Td>
            </tr>
          ) : (
            bookings.map((b) => (
              <tr key={b.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <Td>{b.id}</Td>
                <Td>{b.customer?.name || "-"}</Td>
                <Td>{b.vehiclePart}</Td>
                <Td>{b.serviceType}</Td>
                <Td>
                  {new Date(b.preferredDate).toLocaleDateString()}
                </Td>
                <Td>{b.timeSlot}</Td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/* =============================
   UI HELPERS
============================= */

function Th({ children }) {
  return (
    <th
      style={{
        padding: "10px",
        fontSize: "13px",
        textAlign: "left",
        color: "#334155",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      {children}
    </th>
  );
}

function Td({ children, colSpan, center }) {
  return (
    <td
      colSpan={colSpan}
      style={{
        padding: "10px",
        fontSize: "13px",
        color: "#111827",
        textAlign: center ? "center" : "left",
      }}
    >
      {children}
    </td>
  );
}
