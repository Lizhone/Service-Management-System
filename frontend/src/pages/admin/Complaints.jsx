import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../../api/client";

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      // 🔥 ADMIN: fetch ALL complaints
      const res = await client.get("/complaints");
      setComplaints(res.data);
    } catch (err) {
      console.error("Failed to fetch complaints", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading complaints...</p>;
  }

  return (
    <div>
      <h2>Complaints</h2>

      {complaints.length === 0 ? (
        <p>No complaints found</p>
      ) : (
        <table width="100%" cellPadding="10" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
              <th>Complaint Ref</th>
              <th>Customer</th>
              <th>Job Card</th>
              <th>Category</th>
              <th>Description</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {complaints.map(c => (
              <tr key={c.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td>{c.complaintRef}</td>
                <td>{c.jobCard?.customer?.name || "N/A"}</td>
                <td>{c.jobCard?.jobCardNumber}</td>
                <td>{c.category}</td>
                <td>{c.description}</td>
                <td>{c.status}</td>
                <td>
                  <Link to={`/job-cards/${c.jobCardId}`}>
                    View Job Card
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
