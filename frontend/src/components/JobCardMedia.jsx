import { useEffect, useState } from "react";
import client from "../api/client";
import MediaList from "./MediaList";

const API_BASE_URL = "http://localhost:4000";

export default function JobCardMedia({ jobCardId }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [mediaType, setMediaType] = useState("IMAGE");
  const [mediaContext, setMediaContext] = useState("GENERAL");

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
    if (jobCardId) {
      loadMedia();
    }
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
    formData.append("fileType", mediaType); // must match backend
    formData.append("context", mediaContext);

    try {
      setUploading(true);
      setError("");

      await client.post(
        `/job-cards/${jobCardId}/media`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setFile(null);
      setMediaType("IMAGE");
      setMediaContext("GENERAL");
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
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Job Card Media</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Upload Section */}
      <div className="border rounded p-4 bg-gray-50 mb-6">
        <h4 className="font-medium mb-3">Upload Media</h4>

        <div className="flex gap-3 flex-wrap">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="flex-1 min-w-[200px] border rounded px-3 py-2"
          />

          <select
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value)}
            disabled={uploading}
            className="border rounded px-3 py-2"
          >
            <option value="IMAGE">Image</option>
            <option value="VIDEO">Video</option>
          </select>

          <select
            value={mediaContext}
            onChange={(e) => setMediaContext(e.target.value)}
            disabled={uploading}
            className="border rounded px-3 py-2"
          >
            <option value="GENERAL">General</option>
            <option value="INSPECTION">Inspection</option>
            <option value="COMPLAINT">Complaint</option>
            <option value="PART_REPLACEMENT">Part Replacement</option>
          </select>

          <button
            onClick={handleUpload}
            disabled={uploading || !file}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>

        {file && (
          <div className="text-sm text-gray-600 mt-2">
            Selected: {file.name}
          </div>
        )}
      </div>

      {/* Media Gallery */}
      {loading ? (
        <div className="text-gray-500">Loading media...</div>
      ) : (
        <MediaList jobCardId={jobCardId} media={media} />
      )}
    </div>
  );
}
