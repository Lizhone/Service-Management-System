export default function AdminTopbar({ onToggleSidebar }) {
  return (
    <header
      style={{
        height: "56px",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
      }}
    >
      <button
        onClick={onToggleSidebar}
        style={{
          fontSize: "20px",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        ☰
      </button>

      <h2 style={{ marginLeft: "16px" }}>Admin Dashboard</h2>
    </header>
  );
}
