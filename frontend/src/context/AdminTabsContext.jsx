import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client";

const AdminTabsContext = createContext();

export function AdminTabsProvider({ children }) {
  const [tabs, setTabs] = useState([
    { id: "overview", title: "Overview", component: "overview" }
  ]);
  const [activeTab, setActiveTab] = useState("overview");

  // ✅ ADD: admin notification state
  const [adminNotifications, setAdminNotifications] = useState({
    bookings: false,
    complaints: false
  });

  // ✅ ADD: fetch notification status ONCE
  useEffect(() => {
    const fetchNotificationStatus = async () => {
      try {
        const res = await client.get("/admin/notifications/status");
        setAdminNotifications(res.data);
      } catch (err) {
        console.error("Failed to fetch admin notifications", err);
      }
    };

    fetchNotificationStatus();
  }, []);

  const openTab = (id, title, component) => {
    setTabs(prev => {
      const exists = prev.find(t => t.id === id);
      if (exists) return prev;
      return [...prev, { id, title, component }];
    });
    setActiveTab(id);
  };

  const closeTab = (id) => {
    setTabs(prev => {
      const filtered = prev.filter(t => t.id !== id);
      if (activeTab === id && filtered.length) {
        setActiveTab(filtered[filtered.length - 1].id);
      }
      return filtered;
    });
  };

  return (
    <AdminTabsContext.Provider
      value={{
        tabs,
        activeTab,
        openTab,
        closeTab,
        setActiveTab,

        // ✅ EXPOSE notification state
        adminNotifications,
        setAdminNotifications
      }}
    >
      {children}
    </AdminTabsContext.Provider>
  );
}

export const useAdminTabs = () => useContext(AdminTabsContext);
