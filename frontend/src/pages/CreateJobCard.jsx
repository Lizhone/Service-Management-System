import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import "./jobcard/JobCardForm.css";

export default function CreateJobCard() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("new"); // "new" or "existing"
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [customerJobCards, setCustomerJobCards] = useState([]);

  const [vehicleServiceInCondition, setVehicleServiceInCondition] = useState({
    battery: "",
    brakes: "",
    display: "",
    body: "",
    carrier: "",
    chassis: "",
    rust: "",
    wheels: "",
    footBoard: "",
    allSwitchesFunction: "",
    lightsAndIndicators: "",
    solenoid: "",
    mudguards: "",
    charger: "",
  });

  const [form, setForm] = useState({
    serviceType: "GENERAL",
    serviceInDatetime: "",
    customerId: "",
    customerName: "",
    customerPhone: "",
    Address: "",
    vehicleId: "",
    vin: "",
    vehicleModel: "",
    remarks: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleConditionChange = (condition, value) => {
    setVehicleServiceInCondition({
      ...vehicleServiceInCondition,
      [condition]: value,
    });
  };

  // Load existing customers and vehicles
  useEffect(() => {
    const loadData = async () => {
      try {
        const [customersRes, vehiclesRes] = await Promise.all([
          api.get("/customers"),
          api.get("/vehicles"),
        ]);

        // DEFENSIVE parsing for customers
        const customersData = Array.isArray(customersRes.data)
          ? customersRes.data
          : Array.isArray(customersRes.data?.data)
          ? customersRes.data.data
          : Array.isArray(customersRes.data?.customers)
          ? customersRes.data.customers
          : [];

        // DEFENSIVE parsing for vehicles
        const vehiclesData = Array.isArray(vehiclesRes.data)
          ? vehiclesRes.data
          : Array.isArray(vehiclesRes.data?.data)
          ? vehiclesRes.data.data
          : Array.isArray(vehiclesRes.data?.vehicles)
          ? vehiclesRes.data.vehicles
          : [];

        setCustomers(customersData);
        setVehicles(vehiclesData);
      } catch (error) {
        console.error("Failed to load customers/vehicles:", error);
        setCustomers([]);
        setVehicles([]);
      }
    };

    loadData();
  }, []);

  // Load customer job cards when customer is selected in existing mode
  useEffect(() => {
    if (mode === "existing" && form.customerId) {
      const loadCustomerJobCards = async () => {
        try {
          const res = await api.get(`/customers/${form.customerId}/job-cards`);
          const jobCardsData = Array.isArray(res.data?.data)
            ? res.data.data
            : Array.isArray(res.data)
            ? res.data
            : [];
          setCustomerJobCards(jobCardsData);
        } catch (error) {
          console.error("Failed to load customer job cards:", error);
          setCustomerJobCards([]);
        }
      };
      loadCustomerJobCards();
    } else {
      setCustomerJobCards([]);
    }
  }, [mode, form.customerId]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setForm({
      serviceType: "GENERAL",
      serviceInDatetime: "",
      customerId: "",
      customerName: "",
      customerPhone: "",
      Address: "",
      vehicleId: "",
      vin: "",
      vehicleModel: "",
      remarks: "",
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    let payload;
    let endpoint;

    if (mode === "existing") {
      if (!form.customerId || !form.vehicleId) {
        alert("Please select both customer and vehicle");
        return;
      }

      payload = {
        customerId: Number(form.customerId),
        vehicleId: Number(form.vehicleId),
        serviceType: form.serviceType,
        serviceInDatetime: form.serviceInDatetime,
        remarks: form.remarks,
      };

      endpoint = "/job-cards";
    } else {
      // 🔴 THIS WAS THE BUG — missing validation
      if (
        !form.customerName ||
        !form.customerPhone ||
        !form.vin ||
        !form.vehicleModel
      ) {
        alert("Please fill Customer Name, Phone, VIN, and Vehicle Model");
        return;
      }

      payload = {
        serviceType: form.serviceType,
        serviceInDatetime: form.serviceInDatetime,
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        vin: form.vin,
        vehicleModel: form.vehicleModel,
        remarks: form.remarks,
      };

      endpoint = "/job-cards/create-with-details";
    }

    await api.post(endpoint, payload);

    alert("Job Card created successfully");
    navigate("/dashboard/admin");
  } catch (error) {
    console.error("Job card creation failed", error);
    alert(
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Failed to create job card"
    );
  }
};


  return (
    <div className="jobcard-page">
      <div className="jobcard-container">
        <h1>Create Job Card</h1>
        <p>Fill in service, customer, and vehicle details</p>

        {/* Mode Selection */}
        <div className="mode-selection">
          <button
            type="button"
            className={mode === "new" ? "mode-btn active" : "mode-btn"}
            onClick={() => handleModeChange("new")}
          >
            Create New Customer & Vehicle
          </button>
          <button
            type="button"
            className={mode === "existing" ? "mode-btn active" : "mode-btn"}
            onClick={() => handleModeChange("existing")}
          >
            Use Existing Customer & Vehicle
          </button>
        </div>

        <form onSubmit={handleSubmit} className="jobcard-form">
          {/* Service */}
          <div className="form-section">
            <h3>Service Information</h3>

            <label>Service Type</label>
            <select
              name="serviceType"
              value={form.serviceType}
              onChange={handleChange}
              required
            >
              <option value="GENERAL">General Service</option>
              <option value="COMPLAINT">General Complaint</option>
              <option value="BATTERY">Battery Complaint</option>
              <option value="CHARGER">Charger Complaint</option>
              <option value="PAID_SERVICE_REPAIRABLE">Paid Service with Repairable Complaints</option>
              <option value="PAID_SERVICE_WARRANTY">Paid Service with Warranty Replacement</option>
              <option value="SPARES_DISPATCH">Spares Parts Dispatch</option>
            </select>

            <label>Service Date & Time</label>
            <input
              type="datetime-local"
              name="serviceInDatetime"
              value={form.serviceInDatetime}
              onChange={handleChange}
              required
            />
          </div>

          {/* Customer */}
            
            <h3>Customer Information</h3>

            {mode === "existing" ? (
              <>
                <label>Select Customer</label>
                <select
                  name="customerId"
                  value={form.customerId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose a customer...</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} - {customer.mobileNumber}
                    </option>
                  ))}
                </select>

                {/* Job Card History Section - Only for existing customers */}
                {customerJobCards.length > 0 && (
                  <div className="job-history-section">
                    <h4>Job Card History</h4>
                    <div className="job-cards-list">
                      {customerJobCards.map((jc) => (
                        <div key={jc.id} className="job-card-item">
                          <span className="job-card-number">{jc.jobCardNumber}</span>
                          <span className="job-card-date">
                            {jc.serviceInDatetime ? new Date(jc.serviceInDatetime).toLocaleDateString() : '-'}
                          </span>
                          <span className="job-card-status">{jc.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vehicle Service-In Condition Checklist - Only for existing customers */}
                {/* Vehicle Service-In Condition Checklist - Only for existing customers */}
<div className="condition-checklist-section">
  <h4>Vehicle Service-In Condition Checklist</h4>

  <table className="condition-table">
    <thead>
      <tr>
        <th>Component</th>
        <th>OK</th>
        <th>NOT OK</th>
        <th>DAMAGED</th>
      </tr>
    </thead>

    <tbody>
      {[
        { key: "battery", label: "Battery" },
        { key: "brakes", label: "Brakes" },
        { key: "display", label: "Display" },
        { key: "body", label: "Body" },
        { key: "carrier", label: "Carrier" },
        { key: "chassis", label: "Chassis" },
        { key: "rust", label: "Rust" },
        { key: "wheels", label: "Wheels" },
        { key: "footBoard", label: "Foot Board" },
        { key: "allSwitchesFunction", label: "All Switches Function" },
        { key: "lightsAndIndicators", label: "Lights and Indicators" },
        { key: "solenoid", label: "Solenoid" },
        { key: "mudguards", label: "Mudguards" },
        { key: "charger", label: "Charger" },
      ].map((item) => (
        <tr key={item.key}>
          <td>{item.label}</td>

          {["OK", "NOT OK", "DAMAGED"].map((status) => (
            <td key={status}>
              <input
                type="radio"
                name={item.key}
                value={status}
                checked={vehicleServiceInCondition[item.key] === status}
                onChange={() =>
                  handleConditionChange(item.key, status)
                }
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
</div>
              </>
            
            ) : (
              <>
                <label>Customer Name</label>
                <input
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  required
                />

                <label>Customer Phone</label>
                <input
                  name="customerPhone"
                  value={form.customerPhone}
                  onChange={handleChange}
                  required
                />
              </>
            )}

          {/* Vehicle */}
          <div className="form-section">
            <h3>Vehicle Information</h3>

            {mode === "existing" ? (
              <>
                <label>Select Vehicle</label>
                <select
                  name="vehicleId"
                  value={form.vehicleId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose a vehicle...</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.model} - {vehicle.vinNumber}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <>
                <label>VIN Number</label>
                <input
                  name="vin"
                  value={form.vin}
                  onChange={handleChange}
                  required
                />

                <label>Vehicle Model</label>
                <select
                  name="vehicleModel"
                  value={form.vehicleModel}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select vehicle model</option>
                  <option value="C2">C2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="B3">B3</option>
                  <option value="Shera">Shera</option>
                  <option value="White Carbon">White Carbon</option>
                </select>
              </>
            )}

            <label>Remarks</label>
            <textarea
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Job Card
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
