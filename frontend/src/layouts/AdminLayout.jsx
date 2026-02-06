import { useState } from "react";
import { AdminTabsProvider } from "../context/AdminTabsContext";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminTopbar from "../components/admin/AdminTopbar";
import AdminTabsBar from "../components/admin/AdminTabsBar";
import AdminTabContent from "../components/admin/AdminTabContent";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <AdminTabsProvider>
      <div style={{ display: "flex", height: "100vh" }}>
        <AdminSidebar open={sidebarOpen} />

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <AdminTopbar onToggleSidebar={() => setSidebarOpen(o => !o)} />
          <AdminTabsBar />
          <AdminTabContent />
        </div>
      </div>
    </AdminTabsProvider>
  );
}
