import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../api/client";

const API_BASE_URL = "http://localhost:4000";

export default function MediaViewerPage() {
  const { jobCardId, mediaId } = useParams();
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        const res = await client.get(`/job-cards/${jobCardId}/media/${mediaId}`);
        setMedia(res.data);
      } catch (err) {
        console.error("Failed to fetch media:", err);
        setError("Failed to load media");
      } finally {
        setLoading(false);
      }
    };

    if (jobCardId && mediaId) {
      fetchMedia();
    }
  }, [jobCardId, mediaId]);

  if (loading) return <div className="p-4">Loading media...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!media) return <div className="p-4">Media not found</div>;

  const isImage = media.fileType === "IMAGE";
  const isVideo = media.fileType === "VIDEO";

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Media Viewer</h1>
      <div className="mb-4">
        <p><strong>Type:</strong> {media.fileType}</p>
        <p><strong>Context:</strong> {media.context}</p>
        <p><strong>Uploaded At:</strong> {new Date(media.uploadedAt).toLocaleString()}</p>
      </div>
      {isImage && (
        <img
          src={`${API_BASE_URL}${media.fileUrl}`}
          alt="Media"
          className="max-w-full h-auto"
        />
      )}
      {isVideo && (
        <video controls className="max-w-full h-auto">
          <source src={`${API_BASE_URL}${media.fileUrl}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}
