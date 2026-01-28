import { useEffect, useState } from "react";
import client from "../api/client";
import MediaList from "./MediaList";

export default function JobCardMedia({ jobCardId }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [file, setFile] = useState(null);
  const [mediaType, setMediaType] = useState("IMAGE");
  const [mediaContext, setMediaContext] = useState("GENERAL");
  const [description, setDescription] = useState("");

  /* =========================
     LOAD MEDIA
  ========================= */
  const loadMedia = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await client.get(`/job-cards/${jobCardId}/media`);
      setMedia(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Load media failed:", err);
      setError("Failed to load media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobCardId) loadMedia();
  }, [jobCardId]);

  /* =========================
     FILE HANDLING
  ========================= */
  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", mediaType);
    formData.append("context", mediaContext);
    formData.append("description", description);

    try {
      setUploading(true);
      setError("");

      await client.post(
        `/job-cards/${jobCardId}/media`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // reset
      setFile(null);
      setMediaType("IMAGE");
      setMediaContext("GENERAL");
      setDescription("");

      loadMedia();
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Failed to upload media");
    } finally {
      setUploading(false);
    }
  };

  if (!jobCardId) return null;

  /* =========================
     UI
  ========================= */
  return (
    <div style={{ marginTop: "24px" }}>
      <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>
      
      </h3>

      {error && (
        <div style={{ marginBottom: "12px", color: "red" }}>
          {error}
        </div>
      )}

      {/* Upload Section */}
      <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "16px", marginBottom: "24px" }}>
        <h4 style={{ fontWeight: 600, marginBottom: "12px" }}>
          Upload Media
        </h4>

        {/* HORIZONTAL ROW */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            disabled={uploading}
          />

          <select
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value)}
            disabled={uploading}
          >
            <option value="IMAGE">Image</option>
            <option value="VIDEO">Video</option>
          </select>

          <select
            value={mediaContext}
            onChange={(e) => setMediaContext(e.target.value)}
            disabled={uploading}
          >
            <option value="GENERAL">General</option>
            <option value="INSPECTION">Inspection</option>
            <option value="COMPLAINT">Complaint</option>
            <option value="PART_REPLACEMENT">Part Replacement</option>
          </select>

          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={uploading}
          />

          <button
            onClick={handleUpload}
            disabled={uploading || !file}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>

        {file && (
          <div style={{ fontSize: "12px", marginTop: "8px" }}>
            Selected: {file.name}
          </div>
        )}
      </div>

      {/* Media List */}
      {loading ? (
        <div>Loading media…</div>
      ) : (
        <MediaList jobCardId={jobCardId} media={media} />
      )}
    </div>
  );
}
