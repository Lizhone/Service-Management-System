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
      const res = await client.get("/service-bookings");
      const data = Array.isArray(res.data) ? res.data : [];

// 🔥 Custom priority for Service Advisor Dashboard
const priority = {
  IN_PROGRESS: 1,
  CLAIMED: 2,
  NEW: 3,
  COMPLETED: 4,
};

data.sort((a, b) => {
  return (priority[a.status] || 5) - (priority[b.status] || 5);
});

setBookings(data);
    } catch (err) {
      console.error("Failed to load bookings", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-white p-10">Loading…</p>;

  return (
    <div
      style={{
        padding: 50,
        backgroundColor: "#01263B",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <h1 className="text-3xl font-bold">
        Service Advisor Dashboard
      </h1>

      <p className="mt-5 text-2xl font-bold text-gray-300">
        Service Bookings History
      </p>

      {/* ================= BOOKINGS TABLE ================= */}
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

      {/* ================= WORK TRACKING ================= */}

      <p className="mt-12 text-2xl font-bold text-gray-300">
        Worklog Tracking
      </p>

      <Table
        headers={[
          "Booking REF",
          "Booking Status",
          "Technician",
          "Task",
          "Task Status",
          "Started",
          "Completed",
          "Duration",
        ]}
      >
        {bookings.length === 0 ? (
          <EmptyRow colSpan={8} text="No work activity yet" />
        ) : (
          bookings.flatMap((b) => {
            const workLogs = b.jobCard?.workLogs || [];

            if (workLogs.length === 0) {
              return (
                <tr key={`tracking-${b.id}`}>
                  <Td>SB-{b.id}</Td>
                  <Td>{b.status}</Td>
                  <Td>{b.claimedByProfileId ? b.claimedByProfile?.name : "Not Claimed"}</Td>

                  <Td>-</Td>
                  <Td>-</Td>
                  <Td>-</Td>
                  <Td>-</Td>
                  <Td>-</Td>
                </tr>
              );
            }

            return workLogs.map((log) => {
              let duration = "-";

              if (log.startedAt && log.completedAt) {
                const start = new Date(log.startedAt);
                const end = new Date(log.completedAt);
                const diffMs = end - start;
                const diffMins = Math.floor(diffMs / 60000);

                const hours = Math.floor(diffMins / 60);
                const minutes = diffMins % 60;

                if (hours > 0) {
                  duration = `${hours} hr ${minutes} mins`;
                } else {
                  duration = `${minutes} mins`;
                }
              }

              return (
                <tr key={`tracking-${b.id}-${log.id}`}>
                  <Td>SB-{b.id}</Td>
                  <Td>{b.status}</Td>
                  <Td>
                    {b.claimedByProfile?.name ||
                      log.technicianName ||
                      "Not Claimed"}
                  </Td>
                  <Td>{log.taskName}</Td>
                  <Td>{log.status}</Td>
                  <Td>
                    {log.startedAt
                      ? new Date(log.startedAt).toLocaleString()
                      : "-"}
                  </Td>
                  <Td>
                    {log.completedAt
                      ? new Date(log.completedAt).toLocaleString()
                      : "-"}
                  </Td>
                  <Td>{duration}</Td>
                </tr>
              );
            });
          })
        )}
      </Table>
    </div>
  );
}

/* ===============================
   REUSABLE TABLE COMPONENT
=============================== */

function Table({ headers, children }) {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginTop: 12,
        background: "#ffffff",
        borderRadius: 8,
        overflow: "hidden",
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
                color: "#111827",
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
        color: "#111827",
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
      <td
        colSpan={colSpan}
        style={{
          padding: 16,
          textAlign: "center",
          color: "#111827",
        }}
      >
        {text}
      </td>
    </tr>
  );
}
