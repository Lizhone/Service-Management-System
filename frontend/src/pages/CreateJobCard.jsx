import { useState } from "react";
import { useJobCards } from "../hooks/useJobCards";

export default function CreateJobCard() {
  const { create } = useJobCards();

  const [jobCardNumber, setJobCardNumber] = useState("");
  const [serviceType, setServiceType] = useState("GENERAL");
  const [serviceAdvisorId, setServiceAdvisorId] = useState("");
  const [serviceInDatetime, setServiceInDatetime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [vinNumber, setVinNumber] = useState("");
  const [model, setModel] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
  jobCardNumber,
  serviceType,
  serviceAdvisorId: Number(serviceAdvisorId),
  status: "OPEN",
  serviceInDatetime: new Date(serviceInDatetime).toISOString(),
  customerData: { name: customerName, mobileNumber: customerMobile },
  vehicleData: { vinNumber, model },
};

console.log("UI layer payload:", payload);
await create(payload);


    console.log("Submitting payload:", payload);

    try {
      const res = await create(payload);
      console.log("Created:", res);
      alert("Job card created");
    } catch (err) {
      console.error("Create failed:", err.response?.data || err.message);
      alert("Failed to create job card");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input placeholder="Job Card Number" value={jobCardNumber} onChange={(e) => setJobCardNumber(e.target.value)} />
      <input placeholder="Advisor ID" value={serviceAdvisorId} onChange={(e) => setServiceAdvisorId(e.target.value)} />
      <input type="datetime-local" value={serviceInDatetime} onChange={(e) => setServiceInDatetime(e.target.value)} />
      <input placeholder="Customer Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
      <input placeholder="Customer Mobile" value={customerMobile} onChange={(e) => setCustomerMobile(e.target.value)} />
      <input placeholder="VIN" value={vinNumber} onChange={(e) => setVinNumber(e.target.value)} />
      <input placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} />
      <button type="submit">Create</button>
    </form>
  );
}
