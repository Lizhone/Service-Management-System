import { useState, useEffect } from "react";
import client from "../api/client";
import { useNavigate } from "react-router-dom";

export default function RaiseComplaint() {
  const [vehicles, setVehicles] = useState([]);
  const [vehicleId, setVehicleId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch customer's vehicles
    client.get("/customers/me/vehicles").then(res => {
      setVehicles(res.data || []);
    });
  }, []);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // 1. Create Job Card
      const jobCardRes = await client.post("/job-cards", {
        vehicleId,
        serviceType: "COMPLAINT",
        status: "OPEN",
        title,
        description,
      });
      const jobCard = jobCardRes.data;
      // 2. Upload attachments (if any)
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach(f => formData.append("files", f));
        formData.append("context", "COMPLAINT");
        await client.post(`/job-cards/${jobCard.id}/media`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      navigate(`/job-cards/${jobCard.id}`);
    } catch (err) {
      setError("Failed to raise complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Raise Complaint</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Vehicle</label>
          <select
            className="border p-2 w-full"
            value={vehicleId}
            onChange={e => setVehicleId(e.target.value)}
            required
          >
            <option value="">Select vehicle</option>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>
                {v.model} ({v.registrationNumber})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Complaint Title</label>
          <input
            className="border p-2 w-full"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Complaint Description</label>
          <textarea
            className="border p-2 w-full"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Attachments</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="block"
          />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
}
