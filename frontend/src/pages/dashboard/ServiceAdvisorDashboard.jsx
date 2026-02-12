import { useEffect, useState } from "react";
import client from "../../api/client";

export default function ServiceAdvisorDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===============================
     LOAD BOOKINGS (READ ONLY)
  =============================== */
  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      // Advisor now sees bookings in read-only mode
      const res = await client.get("/service-bookings");
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load bookings", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div style={{ padding: 50 }}>
      <h1 className="text-3xl font-bold">
  Service Advisor Dashboard
</h1>

      

      <Table
        headers={[
          "ID",
          "Customer",
          "Part",
          "Service Type",
          "Date",
          "Time",
          "Customer Notes",
        ]}
      >
        {bookings.length === 0 ? (
          <EmptyRow colSpan={7} text="No service bookings" />
        ) : (
          bookings.map((b) => (
            <tr key={b.id}>
              <Td>{b.id}</Td>
              <Td>{b.customer?.name || "-"}</Td>
              <Td>{b.vehiclePart}</Td>
              <Td>{b.serviceType.replaceAll("_", " ")}</Td>
              <Td>{new Date(b.preferredDate).toLocaleDateString()}</Td>
              <Td>{b.timeSlot}</Td>
              <Td style={{ maxWidth: 260 }}>{b.notes || "—"}</Td>
            </tr>
          ))
        )}
      </Table>
    </div>
  );
}

/* ===============================
   REUSABLE UI COMPONENTS
=============================== */

function Table({ headers, children }) {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginTop: 12,
        background: "#fff",
      }}
    >
      <thead style={{ background: "#f1f5f9" }}>
        <tr>
          {headers.map((h) => (
            <th
              key={h}
              style={{
                padding: 10,
                textAlign: "left",
                fontSize: 13,
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

function Td({ children, style }) {
  return (
    <td
      style={{
        padding: 10,
        fontSize: 13,
        borderBottom: "1px solid #e5e7eb",
        ...style,
      }}
    >
      {children}
    </td>
  );
}

function EmptyRow({ colSpan, text }) {
  return (
    <tr>
      <td colSpan={colSpan} style={{ padding: 16, textAlign: "center" }}>
        {text}
      </td>
    </tr>
  );
}
