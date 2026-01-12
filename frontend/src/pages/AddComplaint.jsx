import { useParams } from "react-router-dom";
import { useState } from "react";
import { useServiceComplaints } from "../hooks/useServiceComplaints";

export default function AddComplaint() {
  const { id } = useParams();
  const { submitComplaint } = useServiceComplaints();
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!description.trim()) {
      alert("Description is required");
      return;
    }

    try {
      await submitComplaint(id, { description });
      alert("Complaint saved");
      setDescription("");
    } catch (err) {
      console.error("Complaint error:", err.response?.data || err.message);
      alert("Failed to save complaint");
    }
  };

  return (
    <div className="p-6 max-w-md space-y-4">
      <h2 className="text-xl font-bold">Add Service Complaint</h2>

      <textarea
        className="border p-2 w-full"
        placeholder="Describe the issue..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Save Complaint
      </button>
    </div>
  );
}
