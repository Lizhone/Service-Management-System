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

    // Optional: mark as viewed when opened
    client.put("/test-rides/mark-viewed").catch(() => {});
  }, []);

  if (loading) return <p>Loading test rides...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "16px" }}>Test Ride History</h2>

      {rides.length === 0 ? (
        <p>No test rides found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#ffffff",
            color: "#fff",
          }}
        >
          <thead>
            <tr style={{ background: "#ffffff" }}>
              <th style={thStyle}>Bike</th>
              <th style={thStyle}>Location</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Time</th>
              <th style={thStyle}>Customer</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {rides.map((ride) => (
              <tr key={ride.id} style={{ borderBottom: "1px solid #374151" }}>
                <td style={tdStyle}>{ride.bikeName}</td>
                <td style={tdStyle}>{ride.location}</td>
                <td style={tdStyle}>
                  {new Date(ride.date).toLocaleDateString()}
                </td>
                <td style={tdStyle}>{ride.timeSlot}</td>
                <td style={tdStyle}>{ride.fullName}</td>
                <td style={tdStyle}>{ride.phone}</td>
                <td style={tdStyle}>{ride.email}</td>
                <td
                  style={{
                    ...tdStyle,
                    color:
                      ride.status === "CONFIRMED"
                        ? "#22c55e"
                        : "#ef4444",
                    fontWeight: "bold",
                  }}
                >
                  {ride.status}
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
  padding: "10px",
  textAlign: "left",
  fontSize: "14px",
};

const tdStyle = {
  padding: "10px",
  fontSize: "13px",
};
