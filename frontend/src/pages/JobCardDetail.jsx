import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import client from "../api/client";
import JobCardMedia from "../components/JobCardMedia";

export default function JobCardDetail() {
  const { id } = useParams();

  const [jobCard, setJobCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Fetching job card", id);

    const load = async () => {
      try {
        const res = await client.get(`/job-cards/${id}`);
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
      <JobCardMedia jobCardId={id} />
    </div>
  );
}
