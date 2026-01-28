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
