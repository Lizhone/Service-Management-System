import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateJobCard from './pages/CreateJobCard';
import ProtectedRoute from './components/ProtectedRoute';

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
      </Routes>
    </BrowserRouter>
  );
}
