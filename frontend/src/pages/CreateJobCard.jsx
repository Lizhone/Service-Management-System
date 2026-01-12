import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";

export default function CreateJobCard() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    jobCardNumber: "",
    serviceType: "GENERAL",
    serviceAdvisorId: 1,
    customerName: "",
    customerMobile: "",
    vehicleVin: "",
    vehicleModel: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      jobCardNumber: String(form.jobCardNumber),
      serviceType: form.serviceType,
      serviceAdvisorId: Number(form.serviceAdvisorId),
      status: "OPEN",
      serviceInDatetime: new Date().toISOString(),
      customerData: {
        name: form.customerName,
        mobileNumber: form.customerMobile,
      },
      vehicleData: {
        vinNumber: form.vehicleVin,
        model: form.vehicleModel,
      },
    };

    console.log("Submitting payload:", payload);

    try {
      await client.post("/job-cards", payload);
      navigate("/dashboard");
    } catch (err) {
      console.error("Create failed:", err.response?.data || err);
      alert("Create failed — see console");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Create Job Card</h1>

      <form onSubmit={handleSubmit} className="space-y-3">

        <input type="number" name="jobCardNumber" placeholder="Job Card Number" value={form.jobCardNumber} onChange={handleChange} required />

        <select name="serviceType" value={form.serviceType} onChange={handleChange}>
          <option value="GENERAL">GENERAL</option>
          <option value="COMPLAINT">COMPLAINT</option>
          <option value="BATTERY">BATTERY</option>
          <option value="CHARGER">CHARGER</option>
        </select>

        <input name="customerName" placeholder="Customer Name" value={form.customerName} onChange={handleChange} required />
        <input name="customerMobile" placeholder="Customer Mobile" value={form.customerMobile} onChange={handleChange} required />
        <input name="vehicleVin" placeholder="Vehicle VIN" value={form.vehicleVin} onChange={handleChange} required />
        <input name="vehicleModel" placeholder="Vehicle Model" value={form.vehicleModel} onChange={handleChange} required />

        <button type="submit">Create</button>
      </form>
    </div>
  );
}
