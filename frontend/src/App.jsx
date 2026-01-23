import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import StaffLogin from "./pages/login/StaffLogin";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import ServiceAdvisorDashboard from "./pages/dashboard/ServiceAdvisorDashboard";
import TechnicianDashboard from "./pages/dashboard/TechnicianDashboard";
import SupplyChainDashboard from "./pages/dashboard/SupplyChainDashboard";
import SalesDashboard from "./pages/dashboard/SalesDashboard";
import CreateJobCard from "./pages/CreateJobCard";
import JobCardDetail from "./pages/JobCardDetail";
import AddInspection from "./pages/AddInspection";
import AddComplaint from "./pages/AddComplaint";
import PartsReplacement from "./pages/PartsReplacement";
import WorkLog from "./pages/WorkLog";
import MediaViewerPage from "./pages/MediaViewerPage";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";

export default function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login/customer" element={<Login />} />
      <Route path="/login/staff" element={<StaffLogin />} />

      {/* CUSTOMER DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <RoleBasedRoute allowedRoles={["CUSTOMER"]}>
            <Dashboard />
          </RoleBasedRoute>
        }
      />

      {/* STAFF/ADMIN DASHBOARDS */}
      <Route
  path="/dashboard/admin"
  element={
    <ProtectedRoute roles={["ADMIN"]}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>


      <Route
        path="/dashboard/service-advisor"
        element={
          <RoleBasedRoute allowedRoles={["SERVICE_ADVISOR"]}>
            <ServiceAdvisorDashboard />
          </RoleBasedRoute>
        }
      />

      <Route
        path="/dashboard/technician"
        element={
          <RoleBasedRoute allowedRoles={["TECHNICIAN"]}>
            <TechnicianDashboard />
          </RoleBasedRoute>
        }
      />

      <Route
        path="/dashboard/supply-chain"
        element={
          <RoleBasedRoute allowedRoles={["SUPPLY_CHAIN"]}>
            <SupplyChainDashboard />
          </RoleBasedRoute>
        }
      />

      <Route
        path="/dashboard/sales"
        element={
          <RoleBasedRoute allowedRoles={["SALES"]}>
            <SalesDashboard />
          </RoleBasedRoute>
        }
      />

      {/* JOB CARD - CUSTOMER ONLY */}
      <Route
        path="/job-cards/new"
        element={
          <RoleBasedRoute allowedRoles={["CUSTOMER"]}>
            <CreateJobCard />
          </RoleBasedRoute>
        }
      />

      <Route
        path="/job-cards/:id"
        element={
          <RoleBasedRoute allowedRoles={["CUSTOMER", "ADMIN"]}>
            <JobCardDetail />
          </RoleBasedRoute>
        }
      />

      <Route
        path="/job-cards/:id/inspection"
        element={
          <RoleBasedRoute allowedRoles={["ADMIN", "TECHNICIAN"]}>
            <AddInspection />
          </RoleBasedRoute>
        }
      />

      <Route
        path="/job-cards/:id/complaints"
        element={
          <RoleBasedRoute allowedRoles={["ADMIN", "TECHNICIAN"]}>
            <AddComplaint />
          </RoleBasedRoute>
        }
      />

      <Route
        path="/job-cards/:id/parts"
        element={
          <RoleBasedRoute allowedRoles={["ADMIN", "TECHNICIAN"]}>
            <PartsReplacement />
          </RoleBasedRoute>
        }
      />

      <Route
        path="/job-cards/:id/work-log"
        element={
          <RoleBasedRoute allowedRoles={["ADMIN", "TECHNICIAN"]}>
            <WorkLog />
          </RoleBasedRoute>
        }
      />

      <Route
        path="/job-cards/:jobCardId/media/:mediaId"
        element={
          <RoleBasedRoute allowedRoles={["ADMIN", "TECHNICIAN"]}>
            <MediaViewerPage />
          </RoleBasedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
