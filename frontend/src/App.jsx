import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateJobCard from "./pages/CreateJobCard";
import JobCardDetail from "./pages/JobCardDetail";
import AddInspection from "./pages/AddInspection";
import AddComplaint from "./pages/AddComplaint";
import PartsReplacement from "./pages/PartsReplacement";
import WorkLog from "./pages/WorkLog";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Login />} />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* JOB CARD */}
      <Route
        path="/job-cards/new"
        element={
          <ProtectedRoute>
            <CreateJobCard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/job-cards/:id"
        element={
          <ProtectedRoute>
            <JobCardDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/job-cards/:id/inspection"
        element={
          <ProtectedRoute>
            <AddInspection />
          </ProtectedRoute>
        }
      />

      <Route
        path="/job-cards/:id/complaints"
        element={
          <ProtectedRoute>
            <AddComplaint />
          </ProtectedRoute>
        }
      />

      <Route
        path="/job-cards/:id/parts"
        element={
          <ProtectedRoute>
            <PartsReplacement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/job-cards/:id/work-log"
        element={
          <ProtectedRoute>
            <WorkLog />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
