import { useEffect, useState } from "react";
import client from "../../api/client";

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
  try {
    const res = await client.get("/admin/dashboard-stats");
    console.log("FULL RESPONSE:", res);
    console.log("DATA ONLY:", res.data);
    setStats(res.data);
  } catch (err) {
    console.error("ERROR:", err.response || err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-white">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#01263B] min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Admin Overview</h1>

      {/* ===== STATS GRID ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

  <StatCard title="Total Customers" value={stats?.customers} />
  <StatCard title="Total Users" value={stats?.users} />
  <StatCard title="Total Vehicles" value={stats?.vehicles} />
  <StatCard title="Service Bookings" value={stats?.serviceBookings} />

  <StatCard title="Total Job Cards" value={stats?.jobCards} />
  <StatCard title="Active Job Cards" value={stats?.activeJobCards} />
  <StatCard title="Complaints" value={stats?.complaints} />
  <StatCard title="Test Rides" value={stats?.testRides} />

  <StatCard title="Work Logs" value={stats?.workLogs} />
  <StatCard title="Vehicle Inspections" value={stats?.inspections} />
  <StatCard title="Parts Replaced" value={stats?.partsReplaced} />

</div>


      {/* Future charts will go here */}
      <div className="mt-10"></div>
    </div>
  );
}

/* ===== Reusable Card ===== */
function StatCard({ title, value }) {
  return (
    <div className="bg-[#0A3A55] rounded-xl p-5 shadow-md hover:shadow-lg transition duration-300">
      <p className="text-sm text-gray-300">{title}</p>
      <h2 className="text-3xl font-bold text-cyan-400 mt-2">
        {value ?? 0}
      </h2>
    </div>
  );
}
