import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getJobCard } from "../api/jobCards";
import JobCardMedia from "../components/JobCardMedia";

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

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Job Card {jobCard?.jobCardNumber}</h2>
      
      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => navigate(`/job-cards/${id}`)}
          className="px-4 py-2 text-blue-600 border-b-2 border-blue-600"
        >
          Media
        </button>
        <button
          onClick={() => navigate(`/job-cards/${id}/inspection`)}
          className="px-4 py-2 text-gray-600 hover:text-blue-600"
        >
          Inspection
        </button>
        <button
          onClick={() => navigate(`/job-cards/${id}/complaints`)}
          className="px-4 py-2 text-gray-600 hover:text-blue-600"
        >
          Complaints
        </button>
        <button
          onClick={() => navigate(`/job-cards/${id}/parts`)}
          className="px-4 py-2 text-gray-600 hover:text-blue-600"
        >
          Parts
        </button>
        <button
          onClick={() => navigate(`/job-cards/${id}/work-log`)}
          className="px-4 py-2 text-gray-600 hover:text-blue-600"
        >
          Work Log
        </button>
      </div>

      <JobCardMedia jobCardId={id} />
    </div>
  );
}
