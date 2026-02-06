import { useAdminTabs } from "../../context/AdminTabsContext";

export default function AdminTabsBar() {
  const { tabs, activeTab, setActiveTab, closeTab } = useAdminTabs();

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        padding: "8px",
        borderBottom: "1px solid #e5e7eb",
        background: "#f8fafc",
      }}
    >
      {tabs.map(tab => (
        <div
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          style={{
            padding: "6px 10px",
            background: tab.id === activeTab ? "#fff" : "#e5e7eb",
            borderRadius: "6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          {tab.title}
          {tab.id !== "overview" && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              style={{ cursor: "pointer" }}
            >
              ✕
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
