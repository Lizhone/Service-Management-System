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

      {/* Complaint Details */}
      {Array.isArray(jobCard.complaints) && jobCard.complaints.length > 0 && (
        <div className="jobcard-section">
          <h3>Complaint Details</h3>
          {jobCard.complaints.map((c) => (
            <div key={c.id} className="complaint-block">
              <div><b>Category:</b> {c.category || '-'}</div>
              <div><b>Description:</b> {c.description || '-'}</div>
              <div><b>Created:</b> {c.createdAt ? new Date(c.createdAt).toLocaleString() : '-'}</div>
              {c.media && c.media.length > 0 && (
                <div className="mt-2">
                  <b>Attachments:</b>
                  <ul>
                    {c.media.map((m) => (
                      <li key={m.id}>
                        <a href={m.url} target="_blank" rel="noopener noreferrer">{m.fileName || m.url}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Inspection Details */}
      {Array.isArray(jobCard.inspections) && jobCard.inspections.length > 0 && (
        <div className="jobcard-section">
          <h3>Inspection Details</h3>
          {jobCard.inspections.map((i) => (
            <div key={i.id} className="inspection-block">
              <div><b>Type:</b> {i.type || '-'}</div>
              <div><b>Result:</b> {i.result || '-'}</div>
              <div><b>Notes:</b> {i.notes || '-'}</div>
              <div><b>Created:</b> {i.createdAt ? new Date(i.createdAt).toLocaleString() : '-'}</div>
            </div>
          ))}
        </div>
      )}

      {/* Parts Replacement Details */}
      {Array.isArray(jobCard.parts) && jobCard.parts.length > 0 && (
        <div className="jobcard-section">
          <h3>Parts Replacement Details</h3>
          {jobCard.parts.map((p) => (
            <div key={p.id} className="parts-block">
              <div><b>Part:</b> {p.partName || '-'}</div>
              <div><b>Quantity:</b> {p.quantity || '-'}</div>
              <div><b>Notes:</b> {p.notes || '-'}</div>
              <div><b>Created:</b> {p.createdAt ? new Date(p.createdAt).toLocaleString() : '-'}</div>
            </div>
          ))}
        </div>
      )}

      {/* Work Logs */}
      {Array.isArray(jobCard.workLogs) && jobCard.workLogs.length > 0 && (
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
                  <td>{w.startedAt ? new Date(w.startedAt).toLocaleString() : '-'}</td>
                  <td>{w.completedAt ? new Date(w.completedAt).toLocaleString() : '-'}</td>
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
