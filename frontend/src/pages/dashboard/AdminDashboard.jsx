import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../../api/client";
import { searchJobCards } from "../../api/jobCards";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [jobCards, setJobCards] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [serviceType, setServiceType] = useState("");

  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [editingJobCard, setEditingJobCard] = useState(null);

  useEffect(() => {
    loadCustomers();
    loadVehicles();
  }, []);

  useEffect(() => {
    loadJobCards();
  }, [search, status, serviceType]);

  const loadJobCards = async () => {
    try {
      const res = await searchJobCards(search);
      const safeJobCards = Array.isArray(res.data.data)
        ? res.data.data
        : [];

      let data = safeJobCards;

      if (status) data = data.filter(j => j.status === status);
      if (serviceType) data = data.filter(j => j.serviceType === serviceType);

      setJobCards(data);
    } catch (error) {
      console.error("Failed to load job cards:", error);
      setJobCards([]);
    }
  };

  const loadCustomers = async () => {
    try {
      const res = await client.get("/customers");
      const safeCustomers = Array.isArray(res.data.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
      setCustomers(safeCustomers);
    } catch (error) {
      console.error("Failed to load customers:", error);
      setCustomers([]);
    }
  };

  const loadVehicles = async () => {
    try {
      const res = await client.get("/vehicles");
      const safeVehicles = Array.isArray(res.data.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
      setVehicles(safeVehicles);
    } catch (error) {
      console.error("Failed to load vehicles:", error);
      setVehicles([]);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  /* ======================
     UPDATE
  ====================== */
  const openEditModal = (jobCard) => {
    setEditingJobCard({ ...jobCard });
  };

  const closeEditModal = () => {
    setEditingJobCard(null);
  };

  const handleUpdate = async () => {
    try {
      await client.put(`/job-cards/${editingJobCard.id}`, {
        customerId: editingJobCard.customerId,
        vehicleId: editingJobCard.vehicleId,
        serviceType: editingJobCard.serviceType,
        status: editingJobCard.status,
        remarks: editingJobCard.remarks,
      });

      closeEditModal();
      loadJobCards();
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update job card");
    }
  };

  /* ======================
     DELETE
  ====================== */
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job card?"
    );
    if (!confirmDelete) return;

    try {
      await client.delete(`/job-cards/${id}`);
      loadJobCards();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete job card");
    }
  };

  return (
    <div className="page-bg">
      <div className="container">
        <h1 className="page-title">Job Cards</h1>
        <p className="page-subtitle">Manage and track all service job cards</p>

        <Link to="/job-cards/new" className="create-link">
          + Create Job Card
        </Link>

        {/* FILTERS */}
        <div className="filters">
          <div>
            <label>Search</label>
            <input
              placeholder="Job card #, customer, vehicle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div>
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div>
            <label>Service Type</label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="GENERAL">General</option>
              <option value="COMPLAINT">Complaint</option>
              <option value="BATTERY">Battery</option>
              <option value="CHARGER">Charger</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <table>
          <thead>
            <tr>
              <th>Job Card #</th>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Service</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {jobCards.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  No job cards found
                </td>
              </tr>
            ) : (
              jobCards.map((jc) => (
                <tr key={jc.id}>
                  <td>
                    <Link className="action-link" to={`/job-cards/${jc.id}`}>
                      {jc.jobCardNumber}
                    </Link>
                  </td>
                  <td>{jc.customer?.name || "-"}</td>
                  <td>{jc.vehicle?.model || "-"}</td>
                  <td>{jc.serviceType}</td>
                  <td>
                    <span className="status">{jc.status}</span>
                  </td>
                  <td>{formatDate(jc.createdAt)}</td>
                  <td>
                    <div className="actions">
                      <button
                        className="action-link"
                        onClick={() => openEditModal(jc)}
                      >
                        Edit
                      </button>
                      <button
                        className="action-link danger"
                        onClick={() => handleDelete(jc.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="results">
          {jobCards.length} job card{jobCards.length !== 1 && "s"} found
        </div>

        {/* EDIT MODAL */}
        {editingJobCard && (
          <div className="modal-backdrop">
            <div className="modal">
              <h3>Edit Job Card #{editingJobCard.jobCardNumber}</h3>

              <label>Customer</label>
              <select
                value={editingJobCard.customerId || ""}
                onChange={(e) =>
                  setEditingJobCard({
                    ...editingJobCard,
                    customerId: parseInt(e.target.value),
                  })
                }
              >
                <option value="">-- Select Customer --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <label>Vehicle</label>
              <select
                value={editingJobCard.vehicleId || ""}
                onChange={(e) =>
                  setEditingJobCard({
                    ...editingJobCard,
                    vehicleId: parseInt(e.target.value),
                  })
                }
              >
                <option value="">-- Select Vehicle --</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.model}
                  </option>
                ))}
              </select>

              <label>Service Type</label>
              <select
                value={editingJobCard.serviceType || ""}
                onChange={(e) =>
                  setEditingJobCard({
                    ...editingJobCard,
                    serviceType: e.target.value,
                  })
                }
              >
                <option value="">-- Select Service Type --</option>
                <option value="GENERAL">GENERAL</option>
                <option value="COMPLAINT">COMPLAINT</option>
                <option value="BATTERY">BATTERY</option>
                <option value="CHARGER">CHARGER</option>
              </select>

              <label>Status</label>
              <select
                value={editingJobCard.status || ""}
                onChange={(e) =>
                  setEditingJobCard({
                    ...editingJobCard,
                    status: e.target.value,
                  })
                }
              >
                <option value="">-- Select Status --</option>
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>

              <label>Remarks</label>
              <textarea
                value={editingJobCard.remarks || ""}
                onChange={(e) =>
                  setEditingJobCard({
                    ...editingJobCard,
                    remarks: e.target.value,
                  })
                }
              />

              <div className="modal-actions">
                <button onClick={closeEditModal}>Cancel</button>
                <button className="primary" onClick={handleUpdate}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
