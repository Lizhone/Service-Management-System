import { Routes, Route, Navigate } from "react-router-dom";

/* ================= PUBLIC PAGES ================= */
import HomePage from "./pages/HomePage";
import StaffLogin from "./pages/login/StaffLogin";
import CustomerLogin from "./pages/login/CustomerLogin";

/* ================= CUSTOMER ================= */
import CustomerDashboard from "./pages/CustomerDashboard";
import BookService from "./pages/BookService";
import RaiseComplaint from "./pages/RaiseComplaint";
import CustomerDetail from "./pages/CustomerDetail";

/* ================= JOB CARDS ================= */
import CreateJobCard from "./pages/CreateJobCard";
import JobCardDetail from "./pages/JobCardDetail";

/* ================= MEDIA ================= */
import MediaViewerPage from "./pages/MediaViewerPage";
import CustomerMediaViewer from "./pages/CustomerMediaViewer";

/* ================= ADMIN LAYOUT ================= */
import AdminLayout from "./layouts/AdminLayout";

/* ================= ADMIN PAGES ================= */
import AdminOverview from "./pages/admin/Overview";
import AdminServiceBookings from "./pages/admin/ServiceBookings";
import AdminJobCards from "./pages/admin/JobCards";
import AdminComplaints from "./pages/admin/Complaints";
import AdminCustomers from "./pages/admin/Customers";
import AdminTechnicians from "./pages/admin/Technicians";
import AdminAdvisors from "./pages/admin/Advisors";
import AdminSales from "./pages/admin/Sales";
import AdminSupplyChain from "./pages/admin/SupplyChain";
import AdminVehicles from "./pages/admin/Vehicles";
import AdminParts from "./pages/admin/Parts";
import AdminMedia from "./pages/admin/Media";
import AdminWorkLogs from "./pages/admin/WorkLogs";

/* ================= OTHER STAFF ================= */
import ServiceAdvisorDashboard from "./pages/dashboard/ServiceAdvisorDashboard";
import TechnicianDashboard from "./pages/dashboard/TechnicianDashboard";
import SupplyChainDashboard from "./pages/dashboard/SupplyChainDashboard";
import SalesDashboard from "./pages/dashboard/SalesDashboard";
import TestRide from "./pages/TestRide";
import BikeDetails from "./pages/BikeDetails";
import TechnicianJobDetail from "./pages/dashboard/TechnicianJobDetail";
import CustomerBookingDetail from "./pages/CustomerBookingDetail";



/* ================= ROUTE GUARDS ================= */
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import { AdminTabsProvider } from "./context/AdminTabsContext";

export default function App() {
  return (
    <Routes>
      {/* ======================================================
         PUBLIC
      ====================================================== */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login/customer" element={<CustomerLogin />} />
      <Route path="/login/staff" element={<StaffLogin />} />

      {/* ======================================================
         CUSTOMER MEDIA (NO AUTH)
      ====================================================== */}
      <Route
        path="/customer/media/:mediaId"
        element={<CustomerMediaViewer />}
      />

      {/* ======================================================
         CUSTOMER DASHBOARD
      ====================================================== */}
      <Route
        path="/dashboard"
        element={
          <RoleBasedRoute allowedRoles={["CUSTOMER"]}>
            <CustomerDashboard />
          </RoleBasedRoute>
        }
      />
      <Route
  path="/dashboard/customer/booking/:bookingId"
  element={
    <RoleBasedRoute allowedRoles={["CUSTOMER"]}>
      <CustomerBookingDetail />
    </RoleBasedRoute>
  }
/>


      {/* ======================================================
         CUSTOMER ACTIONS
      ====================================================== */}
      <Route
        path="/customer/book-service"
        element={
          <RoleBasedRoute allowedRoles={["CUSTOMER"]}>
            <BookService />
          </RoleBasedRoute>
        }
      />

      <Route
        path="/customer/raise-complaint"
        element={
          <RoleBasedRoute allowedRoles={["CUSTOMER"]}>
            <RaiseComplaint />
          </RoleBasedRoute>
        }
      />

      {/* ======================================================
         ADMIN DASHBOARD (PRISMA-STUDIO STYLE)
      ====================================================== */}
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverview />} />

        {/* OPERATIONS */}
        <Route path="service-bookings" element={<AdminServiceBookings />} />
        <Route path="job-cards" element={<AdminJobCards />} />
        <Route path="complaints" element={<AdminComplaints />} />

        {/* ROLES */}
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="technicians" element={<AdminTechnicians />} />
        <Route path="advisors" element={<AdminAdvisors />} />
        <Route path="sales" element={<AdminSales />} />
        <Route path="supply-chain" element={<AdminSupplyChain />} />

        {/* SYSTEM */}
        <Route path="vehicles" element={<AdminVehicles />} />
        <Route path="parts" element={<AdminParts />} />
        <Route path="media" element={<AdminMedia />} />
        <Route path="work-logs" element={<AdminWorkLogs />} />
      </Route>
      <Route
  path="/dashboard/admin/*"
  element={
    <ProtectedRoute roles={["ADMIN"]}>
      <AdminTabsProvider>
        <AdminLayout />
      </AdminTabsProvider>
    </ProtectedRoute>
  }
/>

      {/* ======================================================
         OTHER STAFF DASHBOARDS
      ====================================================== */}
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
  path="/dashboard/technician/:technicianId"
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

      {/* ======================================================
         JOB CARDS (SHARED)
      ====================================================== */}
      <Route
        path="/job-cards/new"
        element={
          <RoleBasedRoute allowedRoles={["ADMIN"]}>
            <CreateJobCard />
          </RoleBasedRoute>
        }
      />

      <Route
        path="/job-cards/:id"
        element={
          <RoleBasedRoute allowedRoles={["ADMIN", "CUSTOMER"]}>
            <JobCardDetail />
          </RoleBasedRoute>
        }
      />

      {/* ======================================================
         CUSTOMER DETAIL
      ====================================================== */}
      <Route
        path="/customers/:id"
        element={
          <RoleBasedRoute allowedRoles={["ADMIN", "CUSTOMER"]}>
            <CustomerDetail />
          </RoleBasedRoute>
        }
      />

      {/* ======================================================
         MEDIA VIEWER
      ====================================================== */}
      <Route
        path="/job-cards/:jobCardId/media/:mediaId"
        element={
          <RoleBasedRoute
            allowedRoles={["ADMIN", "TECHNICIAN", "CUSTOMER"]}
          >
            <MediaViewerPage />
          </RoleBasedRoute>
        }
      />
      {/*=============================================================
         TEST RIDE PAGE (TEMP)
         ====================================================== */}

      <Route path="/test-ride" element={<TestRide />} />

      {/*=============================================================}
          BIKE DETAILS PAGE (TEMP)
      ====================================================== */}
      
      <Route path="/bike/:id" element={<BikeDetails />} />
      {/* ======================================================
         TECHNICIAN JOB DETAIL
      ====================================================== */}
      <Route
       path="/dashboard/technician/job/:bookingId"
       element={
      <RoleBasedRoute allowedRoles={["TECHNICIAN"]}>
      <TechnicianJobDetail />
    </RoleBasedRoute>
  }
/>



      {/* ======================================================
         FALLBACK
      ====================================================== */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
