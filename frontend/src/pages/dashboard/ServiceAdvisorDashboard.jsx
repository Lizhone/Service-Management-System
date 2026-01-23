import { Link } from "react-router-dom";

export default function ServiceAdvisorDashboard() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Service Advisor Dashboard</h1>
        <p className="text-gray-600 text-sm">Limited operational visibility</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Job Cards Overview */}
        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-3">Job Cards</h2>
          <p className="text-gray-600 text-sm mb-3">View and manage job cards</p>
          {/* TODO: Implement job card list for service advisors */}
          <p className="text-yellow-600 text-xs">TODO: Load job cards with filtered access</p>
        </div>

        {/* Section 2: Customers */}
        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-3">Customers</h2>
          <p className="text-gray-600 text-sm mb-3">View customer information</p>
          {/* TODO: Implement customer list for service advisors */}
          <p className="text-yellow-600 text-xs">TODO: Load customers with details</p>
        </div>

        {/* Section 3: Reports */}
        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-3">Reports</h2>
          <p className="text-gray-600 text-sm mb-3">View operational reports</p>
          {/* TODO: Implement reports for service advisors */}
          <p className="text-yellow-600 text-xs">TODO: Build advisory reports dashboard</p>
        </div>

        {/* Section 4: Quick Actions */}
        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
          <p className="text-gray-600 text-sm mb-3">Common tasks</p>
          {/* TODO: Add quick action buttons */}
          <p className="text-yellow-600 text-xs">TODO: Add shortcut buttons for frequent tasks</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <p className="text-blue-800 text-sm">
          Service Advisor role features coming soon. For now, contact admin for access to full job card management.
        </p>
      </div>
    </div>
  );
}
