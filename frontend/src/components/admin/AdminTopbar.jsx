export default function AdminTopbar({ onToggleSidebar }) {
  return (
    <header
      style={{
        height: "56px",
        background: "#01263B",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        color: "#ffffff",
      }}
    >
      <button
        onClick={onToggleSidebar}
        style={{
          fontSize: "40px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#ffffff",
        }}
      >
        ☰
      </button>

      <h1
        style={{
          fontSize: "40px",
          marginLeft: "16px",
          color: "#ffffff",
          fontWeight: "600",
        }}
      >
        Admin Dashboard
      </h1>
    </header>
  );
}