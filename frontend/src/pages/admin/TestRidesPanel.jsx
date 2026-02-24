import { useEffect, useState } from "react";
import client from "../../api/client";

export default function TestRidesPanel() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRides = async () => {
    try {
      const res = await client.get("/test-rides");
      setRides(res.data);
    } catch (err) {
      console.error("Failed to fetch test rides", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
    client.put("/test-rides/mark-viewed").catch(() => {});
  }, []);

  if (loading)
    return (
      <div style={{ background: "#1263B", color: "#fff", padding: "20px" }}>
        Loading test rides...
      </div>
    );

  return (
    <div
      style={{
        padding: "20px",
        background: "#1263B",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      <h2 style={{ marginBottom: "16px" }}>Test Ride History</h2>

      {rides.length === 0 ? (
        <p>No test rides found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#0A3A55",
          }}
        >
          <thead>
            <tr style={{ background: "#0F4C75" }}>
              <th style={thStyle}>Bike</th>
              <th style={thStyle}>Location</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Time</th>
              <th style={thStyle}>Customer</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Address</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Feedback</th>
            </tr>
          </thead>

          <tbody>
            {rides.map((ride) => (
              <tr
                key={ride.id}
                style={{
                  borderBottom: "1px solid #1f2937",
                  background: "transparent",
                }}
              >
                <td style={tdStyle}>{ride.bikeName}</td>
                <td style={tdStyle}>{ride.location}</td>
                <td style={tdStyle}>
                  {new Date(ride.date).toLocaleDateString()}
                </td>
                <td style={tdStyle}>{ride.timeSlot}</td>
                <td style={tdStyle}>{ride.fullName}</td>
                <td style={tdStyle}>{ride.phone}</td>
                <td style={tdStyle}>{ride.email}</td>
                <td style={tdStyle}>{ride.address || "—"}</td>

                <td
                  style={{
                    ...tdStyle,
                    color:
                      ride.status === "CONFIRMED"
                        ? "#22c55e"
                        : ride.status === "PENDING"
                        ? "#facc15"
                        : "#ef4444",
                    fontWeight: "bold",
                  }}
                >
                  {ride.status}
                </td>

                <td
                  style={{
                    ...tdStyle,
                    fontStyle: ride.feedback ? "normal" : "italic",
                    opacity: ride.feedback ? 1 : 0.6,
                  }}
                >
                  {ride.feedback || "No feedback"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = {
  padding: "12px",
  textAlign: "left",
  fontSize: "14px",
  color: "#ffffff",
};

const tdStyle = {
  padding: "12px",
  fontSize: "13px",
  color: "#ffffff",
};