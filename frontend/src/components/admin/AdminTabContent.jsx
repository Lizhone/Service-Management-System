import { useAdminTabs } from "../../context/AdminTabsContext";

/* ✅ REAL JOB CARDS DASHBOARD */
import AdminDashboard from "../../pages/dashboard/AdminDashboard.jsx";

/* OTHER ADMIN PAGES */
import Overview from "../../pages/admin/Overview.jsx";
import ServiceBookings from "../../pages/admin/ServiceBookings.jsx";
import Complaints from "../../pages/admin/Complaints.jsx";
import Customers from "../../pages/admin/Customers.jsx";
import Vehicles from "../../pages/admin/Vehicles.jsx";
import WorkLogs from "../../pages/admin/WorkLogs.jsx";


const COMPONENT_MAP = {
  overview: Overview,
  "service-bookings": ServiceBookings, // ✅ ADD THIS
  "job-cards": AdminDashboard,
  complaints: Complaints,
  customers: Customers,
  vehicles: Vehicles,
  "work-logs": WorkLogs,
};


export default function AdminTabContent() {
  const { tabs, activeTab } = useAdminTabs();

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "16px" }}>
      {tabs.map(tab => {
        const Component = COMPONENT_MAP[tab.component];
        if (!Component) return null;

        return (
          <div
            key={tab.id}
            style={{ display: tab.id === activeTab ? "block" : "none" }}
          >
            <Component />
          </div>
        );
      })}
    </div>
  );
}
