import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJobCards } from "../hooks/useJobCards";

export default function CreateJobCard() {
  const navigate = useNavigate();
  const { create } = useJobCards();

  const [serviceType, setServiceType] = useState("GENERAL");
  const [serviceInDatetime, setServiceInDatetime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [vinNumber, setVinNumber] = useState("");
  const [model, setModel] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!customerName.trim() || !customerMobile.trim() || !vinNumber.trim() || !model.trim() || !serviceInDatetime) {
      setError("All fields are required");
      return;
    }

    const payload = {
      serviceType,
      status: "OPEN",
      serviceInDatetime: new Date(serviceInDatetime).toISOString(),
      customerData: { name: customerName, mobileNumber: customerMobile },
      vehicleData: { vinNumber, model },
      remarks: remarks || undefined,
    };

    try {
      setLoading(true);
      const res = await create(payload);
      alert("Job card created successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error("Create failed:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to create job card");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Job Card</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Service Type</label>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="border w-full px-3 py-2 rounded"
          >
            <option value="GENERAL">General</option>
            <option value="COMPLAINT">Complaint</option>
            <option value="BATTERY">Battery</option>
            <option value="CHARGER">Charger</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Service Date & Time</label>
          <input
            type="datetime-local"
            required
            value={serviceInDatetime}
            onChange={(e) => setServiceInDatetime(e.target.value)}
            className="border w-full px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Customer Name</label>
          <input
            required
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="border w-full px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Customer Mobile</label>
          <input
            required
            placeholder="Customer Mobile"
            value={customerMobile}
            onChange={(e) => setCustomerMobile(e.target.value)}
            className="border w-full px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">VIN Number</label>
          <input
            required
            placeholder="VIN"
            value={vinNumber}
            onChange={(e) => setVinNumber(e.target.value)}
            className="border w-full px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Model</label>
          <input
            required
            placeholder="Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="border w-full px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Remarks (Optional)</label>
          <textarea
            placeholder="Additional remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="border w-full px-3 py-2 rounded"
            rows={3}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 flex-1"
          >
            {loading ? "Creating..." : "Create Job Card"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
