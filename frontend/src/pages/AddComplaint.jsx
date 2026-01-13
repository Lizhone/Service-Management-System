import { useParams } from "react-router-dom";
import { useState } from "react";
import { useServiceComplaints } from "../hooks/useServiceComplaints";

export default function AddComplaint() {
  const { id } = useParams();
  const { submitComplaint } = useServiceComplaints();

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Battery");
  const [workType, setWorkType] = useState("PAID");

  const handleSubmit = async () => {
    try {
      await submitComplaint(id, { description, category, workType });
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

      <select
        className="border p-2 w-full"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="Battery">Battery</option>
        <option value="Brakes">Brakes</option>
        <option value="Suspension">Suspension</option>
        <option value="Charger">Charger</option>
        <option value="Electronics">Electronics</option>
        <option value="Display">Display</option>
        <option value="Power">Power</option>
        <option value="Others">Others</option>
      </select>

      <select
        className="border p-2 w-full"
        value={workType}
        onChange={(e) => setWorkType(e.target.value)}
      >
        <option value="PAID">Paid</option>
        <option value="COMPLAINT">Complaint</option>
        <option value="WARRANTY">Warranty</option>
      </select>

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
