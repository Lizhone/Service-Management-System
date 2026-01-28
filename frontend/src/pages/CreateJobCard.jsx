import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import "./jobcard/JobCardForm.css";

export default function CreateJobCard() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("new"); // "new" or "existing"
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [form, setForm] = useState({
    serviceType: "GENERAL",
    serviceInDatetime: "",
    customerId: "",
    customerName: "",
    customerPhone: "",
    vehicleId: "",
    vin: "",
    vehicleModel: "",
    remarks: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setForm({
      serviceType: "GENERAL",
      serviceInDatetime: "",
      customerId: "",
      customerName: "",
      customerPhone: "",
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
      alert(error.response?.data?.message || "Failed to create job card");
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
              <option value="GENERAL">General</option>
              <option value="COMPLAINT">Complaint</option>
              <option value="BATTERY">Battery</option>
              <option value="CHARGER">Charger</option>
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
          <div className="form-section">
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
          </div>

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
                <input
                  name="vehicleModel"
                  value={form.vehicleModel}
                  onChange={handleChange}
                  required
                />
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
