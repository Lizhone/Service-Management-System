import { useState } from "react";
import { AdminTabsProvider } from "../context/AdminTabsContext";
import "../styles/admin-theme.css";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminTopbar from "../components/admin/AdminTopbar";
import AdminTabsBar from "../components/admin/AdminTabsBar";
import AdminTabContent from "../components/admin/AdminTabContent";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <AdminTabsProvider>
      <div
        className="admin-theme"
        style={{
          display: "flex",
          height: "100vh",
        }}
      >
        {/* Sidebar */}
        <AdminSidebar open={sidebarOpen} />

        {/* Main Content Area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <AdminTopbar
            onToggleSidebar={() =>
              setSidebarOpen((prev) => !prev)
            }
          />

          <AdminTabsBar />

          <AdminTabContent />
        </div>
      </div>
    </AdminTabsProvider>
  );
}