import { useEffect, useState } from "react";
import client from "../../api/client";

export default function ServiceAdvisorDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =============================
     FETCH ADVISOR BOOKINGS
  ============================== */
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await client.get("/service-advisor/bookings");
        setBookings(res.data);
      } catch (err) {
        console.error("Failed to load advisor bookings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  /* =============================
     VALIDATE BOOKING
  ============================== */
  const handleValidate = async (id, advisorNotes) => {
    try {
      await client.patch(`/service-advisor/bookings/${id}/validate`, {
        advisorNotes,
      });

      // Remove validated booking from advisor list
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to validate booking");
    }
  };

  return (
    <div style={{ padding: "32px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: 600, marginBottom: "8px" }}>
        Service Advisor Dashboard
      </h1>

      <p style={{ color: "#555", marginBottom: "32px" }}>
        Review and validate customer service bookings before admin approval.
      </p>

      {/* =============================
          ADVISOR WORKFLOW
      ============================== */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>
          Advisor Workflow
        </h2>

        <div
          style={{
            display: "flex",
            gap: "24px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <ActionCard
            title="Review Booking"
            description="Check customer request, date and service type"
          />
          <Arrow />
          <ActionCard
            title="Validate Booking"
            description="Add advisor notes and validate booking"
          />
          <Arrow />
          <ActionCard
            title="Forward to Admin"
            description="Validated booking moves to admin approval"
          />
        </div>
      </div>

      {/* =============================
          PENDING BOOKINGS
      ============================== */}
      <div>
        <h2 style={{ fontSize: "20px", marginBottom: "16px" }}>
          Pending Service Bookings
        </h2>

        {loading && <p>Loading bookings…</p>}

        {!loading && bookings.length === 0 && (
          <p style={{ color: "#666" }}>
            No pending bookings for validation.
          </p>
        )}

        {bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onValidate={handleValidate}
          />
        ))}
      </div>
    </div>
  );
}

/* =============================
   BOOKING CARD
============================= */

function BookingCard({ booking, onValidate }) {
  const [notes, setNotes] = useState("");

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        padding: "20px",
        marginBottom: "16px",
        background: "#fff",
      }}
    >
      <h3 style={{ fontSize: "16px", marginBottom: "6px" }}>
        {booking.customer?.name}
      </h3>

      <p style={{ fontSize: "13px", color: "#555" }}>
        <strong>Vehicle Part:</strong> {booking.vehiclePart}
      </p>

      <p style={{ fontSize: "13px", color: "#555" }}>
        <strong>Service Type:</strong> {booking.serviceType}
      </p>

      <p style={{ fontSize: "13px", color: "#555" }}>
        <strong>Date:</strong>{" "}
        {new Date(booking.preferredDate).toLocaleDateString()}
      </p>

      <p style={{ fontSize: "13px", color: "#555" }}>
        <strong>Time Slot:</strong> {booking.timeSlot}
      </p>

      {booking.notes && (
        <p style={{ fontSize: "13px", color: "#555", marginTop: "6px" }}>
          <strong>Customer Notes:</strong> {booking.notes}
        </p>
      )}

      <textarea
        placeholder="Advisor notes (required)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
        style={{
          width: "100%",
          marginTop: "12px",
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #d1d5db",
          fontSize: "13px",
        }}
      />

      <div style={{ marginTop: "12px", textAlign: "right" }}>
        <button
          onClick={() => onValidate(booking.id, notes)}
          disabled={!notes.trim()}
          style={{
            background: "#2563eb",
            color: "#fff",
            padding: "8px 14px",
            borderRadius: "6px",
            border: "none",
            cursor: notes.trim() ? "pointer" : "not-allowed",
            opacity: notes.trim() ? 1 : 0.6,
          }}
        >
          Validate Booking
        </button>
      </div>
    </div>
  );
}

/* =============================
   UI HELPERS
============================= */

function ActionCard({ title, description }) {
  return (
    <div
      style={{
        minWidth: "220px",
        padding: "20px",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        background: "#f9fafb",
      }}
    >
      <h3 style={{ fontSize: "16px", marginBottom: "6px" }}>{title}</h3>
      <p style={{ fontSize: "13px", color: "#555" }}>{description}</p>
    </div>
  );
}

function Arrow() {
  return <div style={{ fontSize: "24px", color: "#999" }}>→</div>;
}
