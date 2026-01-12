import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateJobCard from "./pages/CreateJobCard";
import AddInspection from "./pages/AddInspection";
import AddComplaint from "./pages/AddComplaint";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/job-cards/new"
          element={
            <ProtectedRoute>
              <CreateJobCard />
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
      </Routes>
    </BrowserRouter>
  );
}
