import { useEffect, useState } from "react";
import client from "../api/client";
import MediaList from "./MediaList";

export default function JobCardMedia({ jobCardId }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [file, setFile] = useState(null);
  const [mediaContext, setMediaContext] = useState("GENERAL");

  const loadMedia = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await client.get(`/job-cards/${jobCardId}/media`);
      setMedia(res.data);
    } catch (err) {
      console.error("Load media failed:", err?.response?.data || err);
      setError("Failed to load media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobCardId) loadMedia();
  }, [jobCardId]);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file); // ⚠️ MUST BE "file"
    formData.append("context", mediaContext);

    try {
      setUploading(true);
      setError("");

      await client.post(
        `/job-cards/${jobCardId}/media`,
        formData
      );

      setFile(null);
      loadMedia();
    } catch (err) {
      console.error("Upload failed:", err?.response?.data || err);
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginTop: 24 }}>
      {error && <div style={{ color: "red" }}>{error}</div>}

      <div style={{ marginBottom: 16 }}>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <select
          value={mediaContext}
          onChange={(e) => setMediaContext(e.target.value)}
        >
          <option value="GENERAL">General</option>
          <option value="INSPECTION">Inspection</option>
          <option value="COMPLAINT">Complaint</option>
          <option value="PART_REPLACEMENT">Part Replacement</option>
        </select>

        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {loading ? (
        <div>Loading media…</div>
      ) : (
        <MediaList jobCardId={jobCardId} media={media} />
      )}
    </div>
  );
}
