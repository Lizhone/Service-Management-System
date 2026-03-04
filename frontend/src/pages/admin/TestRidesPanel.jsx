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

  if (loading) {
    return (
      <div className="admin-card">
        <p className="admin-text">Loading test rides...</p>
      </div>
    );
  }

  return (
    <div className="admin-card">
      <div className="admin-header">
        <h2 className="admin-heading">Test Ride History</h2>
      </div>

      {rides.length === 0 ? (
        <p className="admin-text">No test rides found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Bike</th>
              <th>Location</th>
              <th>Date</th>
              <th>Time</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>Status</th>
              <th>Rating</th>
              <th>Feedback</th>
            </tr>
          </thead>

          <tbody>
            {rides.map((ride) => (
              <tr key={ride.id}>
                <td>{ride.bikeName}</td>
                <td>{ride.location}</td>
                <td>{new Date(ride.date).toLocaleDateString()}</td>
                <td>{ride.timeSlot}</td>
                <td>{ride.fullName}</td>
                <td>{ride.phone}</td>
                <td>{ride.email}</td>
                <td>{ride.address || "—"}</td>

                <td>
                  <span
                    className={
                      ride.status === "CONFIRMED"
                        ? "admin-badge admin-badge-open"
                        : ride.status === "PENDING"
                        ? "admin-badge"
                        : "admin-badge admin-badge-closed"
                    }
                  >
                    {ride.status}
                  </span>
                </td>

                <td>
  {ride.rating ? (
    <div className="admin-rating">
      <div className="admin-rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={
              star <= ride.rating
                ? "admin-rating-filled"
                : "admin-rating-empty"
            }
          >
            ★
          </span>
        ))}
      </div>

      <span className="admin-rating-value">
        {ride.rating.toFixed(1)} / 5
      </span>
    </div>
  ) : (
    <span className="admin-rating-none">
      No Rating
    </span>
  )}
</td>
                <td style={{ opacity: ride.feedback ? 1 : 0.6 }}>
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