import { useState, useEffect } from "react";
import client from "../api/client";

export default function JobCardMedia({ jobCardId }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [mediaType, setMediaType] = useState("IMAGE");

  const loadMedia = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await client.get(`/job-cards/${jobCardId}/media`);
      setMedia(res.data || []);
    } catch (err) {
      setError("Failed to load media");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobCardId) {
      loadMedia();
    }
  }, [jobCardId]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", mediaType);

    try {
      setUploading(true);
      setError("");
      await client.post(`/job-cards/${jobCardId}/media`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFile(null);
      setMediaType("IMAGE");
      loadMedia();
    } catch (err) {
      setError("Failed to upload media");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (!jobCardId) {
    return null;
  }

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
            onChange={handleFileChange}
            accept="image/*,video/*"
            className="flex-1 min-w-[200px] border rounded px-3 py-2"
            disabled={uploading}
          />
          <select
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value)}
            className="border rounded px-3 py-2"
            disabled={uploading}
          >
            <option value="IMAGE">Image</option>
            <option value="VIDEO">Video</option>
          </select>
          <button
            onClick={handleUpload}
            disabled={uploading || !file}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 whitespace-nowrap"
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

      {/* Gallery Section */}
      {loading ? (
        <div className="text-gray-500">Loading media...</div>
      ) : media.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((m) => (
            <div key={m.id} className="border rounded overflow-hidden bg-gray-100">
              <div className="aspect-square flex items-center justify-center bg-gray-200 relative group">
                {m.type === "IMAGE" && (
                  <img
                    src={`http://localhost:4000/${m.url}`}
                    alt="Media"
                    className="w-full h-full object-cover"
                  />
                )}
                {m.type === "VIDEO" && (
                  <video
                    controls
                    className="w-full h-full object-cover"
                  >
                    <source src={`http://localhost:4000/${m.url}`} />
                    Your browser does not support the video tag.
                  </video>
                )}
                {m.type === "DOCUMENT" && (
                  <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                    <span className="text-3xl">📄</span>
                    <span className="text-xs text-center px-2 break-words">
                      {m.url.split("/").pop()}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-2 text-xs text-gray-600 bg-white">
                <div className="truncate font-medium">
                  {m.url.split("/").pop()}
                </div>
                <div>
                  {new Date(m.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-sm">No media uploaded yet.</div>
      )}
    </div>
  );
}
