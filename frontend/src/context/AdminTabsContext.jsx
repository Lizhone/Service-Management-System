import { createContext, useContext, useState } from "react";

const AdminTabsContext = createContext();

export function AdminTabsProvider({ children }) {
  const [tabs, setTabs] = useState([
    { id: "overview", title: "Overview", component: "overview" }
  ]);
  const [activeTab, setActiveTab] = useState("overview");

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
      value={{ tabs, activeTab, openTab, closeTab, setActiveTab }}
    >
      {children}
    </AdminTabsContext.Provider>
  );
}

export const useAdminTabs = () => useContext(AdminTabsContext);
