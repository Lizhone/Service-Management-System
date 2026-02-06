import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getJobCard } from "../api/jobCards";
import JobCardMedia from "../components/JobCardMedia";
import "./JobCardDetail.css";

export default function JobCardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [jobCard, setJobCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getJobCard(id);
        setJobCard(res.data);
      } catch (err) {
        console.error("Job card fetch failed", err);
        setError("Failed to load job card");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return <div className="jobcard-page">Loading…</div>;
  if (error) return <div className="jobcard-page">{error}</div>;
  if (!jobCard) return <div className="jobcard-page">Not found</div>;

  return (
    <div className="jobcard-page">
      {/* Header */}
      <div className="jobcard-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h1>Job Card {jobCard.jobCardNumber}</h1>

        <span className={`status ${jobCard.status.toLowerCase()}`}>
          {jobCard.status}
        </span>
      </div>

      {/* Service Info */}
      <div className="jobcard-info">
        <div>
          <label>Service Type</label>
          <p>{jobCard.serviceType}</p>
        </div>

        <div>
          <label>Service In</label>
          <p>
            {new Date(jobCard.serviceInDatetime).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Customer */}
      <div className="jobcard-section">
        <h3>Customer</h3>
        <Link
          to={`/customers/${jobCard.customer?.id}`}
          className="customer-link"
        >
          {jobCard.customer?.name}
        </Link>

        <p className="muted">
          {jobCard.customer?.mobileNumber}
        </p>
      </div>

      {/* Vehicle */}
      <div className="jobcard-section">
        <h3>Vehicle</h3>
        <p>
          {jobCard.vehicle?.model} — VIN{" "}
          {jobCard.vehicle?.vinNumber}
        </p>
      </div>

      {/* ================= COMPLAINT DETAILS ================= */}
{Array.isArray(jobCard.serviceComplaints) &&
  jobCard.serviceComplaints.length > 0 && (
    <div className="jobcard-section">
      <h3>Complaint Details</h3>

      <table className="min-w-full border bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-3 text-left">Complaint Ref</th>
            <th className="py-2 px-3 text-left">Category</th>
            <th className="py-2 px-3 text-left">Description</th>
            <th className="py-2 px-3 text-left">Raised At</th>
            <th className="py-2 px-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {jobCard.serviceComplaints.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="py-2 px-3 font-mono">
                CMP-{c.id}
              </td>

              <td className="py-2 px-3">
                {c.category}
              </td>

              <td className="py-2 px-3">
                {c.description}
              </td>

              <td className="py-2 px-3">
                {new Date(c.createdAt).toLocaleDateString()}
              </td>

              <td className="py-2 px-3 font-semibold">
                {c.status || "OPEN"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
)}

      {/* Inspection Details */}
      {Array.isArray(jobCard.inspections) &&
        jobCard.inspections.length > 0 && (
          <div className="jobcard-section">
            <h3>Inspection Details</h3>
            {jobCard.inspections.map((i) => (
              <div key={i.id} className="inspection-block">
                <div><b>Type:</b> {i.type || "-"}</div>
                <div><b>Result:</b> {i.result || "-"}</div>
                <div><b>Notes:</b> {i.notes || "-"}</div>
                <div>
                  <b>Created:</b>{" "}
                  {i.createdAt
                    ? new Date(i.createdAt).toLocaleString()
                    : "-"}
                </div>
              </div>
            ))}
          </div>
        )}

      {/* Parts Replacement Details */}
      {Array.isArray(jobCard.parts) &&
        jobCard.parts.length > 0 && (
          <div className="jobcard-section">
            <h3>Parts Replacement Details</h3>
            {jobCard.parts.map((p) => (
              <div key={p.id} className="parts-block">
                <div><b>Part:</b> {p.partName || "-"}</div>
                <div><b>Quantity:</b> {p.quantity || "-"}</div>
                <div><b>Notes:</b> {p.notes || "-"}</div>
                <div>
                  <b>Created:</b>{" "}
                  {p.createdAt
                    ? new Date(p.createdAt).toLocaleString()
                    : "-"}
                </div>
              </div>
            ))}
          </div>
        )}

      {/* Work Logs */}
      {Array.isArray(jobCard.workLogs) &&
        jobCard.workLogs.length > 0 && (
          <div className="jobcard-section">
            <h3>Work Logs</h3>
            <table className="worklog-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Technician</th>
                  <th>Status</th>
                  <th>Started</th>
                  <th>Completed</th>
                </tr>
              </thead>
              <tbody>
                {jobCard.workLogs.map((w) => (
                  <tr key={w.id}>
                    <td>{w.taskName}</td>
                    <td>{w.technicianName}</td>
                    <td>{w.status}</td>
                    <td>
                      {w.startedAt
                        ? new Date(w.startedAt).toLocaleString()
                        : "-"}
                    </td>
                    <td>
                      {w.completedAt
                        ? new Date(w.completedAt).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      {/* Media */}
      <div className="jobcard-section">
        <JobCardMedia
          jobCardId={jobCard.id}
          media={jobCard.media}
        />
      </div>
    </div>
  );
}
