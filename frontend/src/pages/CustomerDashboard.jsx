import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../hooks/useAuth";

export default function CustomerDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [jobCards, setJobCards] = useState([]);
  const [serviceBookings, setServiceBookings] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login/customer", { replace: true });
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (loading || !user) return;
    const loadVehicles = async () => {
      try {
        const res = await client.get("/customers/me/vehicles");
        setVehicles(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load vehicles:", err);
      }
    };
    loadVehicles();
  }, [loading, user]);

  useEffect(() => {
    if (loading || !user) return;
    const loadJobCards = async () => {
      try {
        const res = await client.get("/customers/me/job-cards");
        setJobCards(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load job cards");
      } finally {
        setLoadingJobs(false);
      }
    };
    loadJobCards();
  }, [loading, user]);

  useEffect(() => {
    if (loading || !user) return;
    const loadServiceBookings = async () => {
      try {
        const res = await client.get("/customers/me/service-bookings");
        const bookingsData =
          Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data?.data)
            ? res.data.data
            : [];
        setServiceBookings(bookingsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingBookings(false);
      }
    };
    loadServiceBookings();
  }, [loading, user]);

  useEffect(() => {
    if (loading || !user) return;
    const loadProfile = async () => {
      try {
        const res = await client.get("/customers/me");
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
    loadProfile();
  }, [loading, user]);

  if (loading || !user) return null;

  const primaryVehicle = vehicles[0];

  const getBikeImage = (model) => {
    if (!model) return "/bikes/flee-b1/default.png";
    return `/bikes/flee-${model.toLowerCase()}/default.png`;
  };

  const statusColors = {
    OPEN: "bg-yellow-100 text-yellow-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    CLOSED: "bg-green-100 text-green-800",
  };

  return (
    <div className="min-h-screen bg-[#01263B] text-white p-8">

      <h1 className="text-4xl font-bold mb-6">
        Welcome back, <span className="text-cyan-400">{user.name}</span>
      </h1>

      {profile && (
        <div className="mb-6 text-xl text-gray-300 space-y-1">
          <p>Phone: {profile.mobileNumber || "-"}</p>
          <p>Email: {profile.email || "-"}</p>
          <p>Address: {profile.address || "-"}</p>
        </div>
      )}

      {primaryVehicle && (
        <div className="bg-[#0A3A55] p-6 rounded-xl mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold mb-2">
              {primaryVehicle.model}
            </h2>
            <p className="text-gray-300">VIN: {primaryVehicle.vinNumber}</p>
            <p className="text-gray-300 text-xl">
              Registration: {primaryVehicle.registrationNumber || "-"}
            </p>
            <p className="text-gray-300 text-xl">
              Battery No: {primaryVehicle.batteryNumber || "-"}
            </p>
            <p className="text-gray-300 text-xl">
              Motor No: {primaryVehicle.motorNumber || "-"}
            </p>
            <p className="text-gray-300 text-xl">
              Charger No: {primaryVehicle.chargerNumber || "-"}
            </p>
            <p className="text-gray-300 text-xl">
              Warranty: {primaryVehicle.warrantyStatus || "-"}
            </p>
          </div>

          <img
            src={getBikeImage(primaryVehicle.model)}
            alt="Bike"
            className="w-120 rounded-2xl object-contain"
          />
        </div>
      )}

      <button
        className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-lg mb-8 text-2xl font-semibold"
        onClick={() => navigate("/customer/book-service")}
      >
        + Book Service
      </button>

      {/* ================= SERVICE BOOKINGS ================= */}
      <h2 className="text-4xl font-semibold mb-4">Service Bookings</h2>

      {loadingBookings ? (
        <p className="text-gray-300 mb-10">Loading...</p>
      ) : serviceBookings.length === 0 ? (
        <p className="text-gray-300 mb-10">No service bookings found.</p>
      ) : (
        <table className="min-w-full bg-white text-black rounded-3xl overflow-hidden">
  <thead className="bg-gray-100 text-3xl font-bold">
  <tr>
    <th className="py-6 px-4 text-left text-5xl font-extrabold tracking-wide">
      Booking Ref
    </th>
    <th className="py-6 px-4 text-left text-5xl font-extrabold tracking-wide">
      Part
    </th>
    <th className="py-6 px-4 text-left text-5xl font-extrabold tracking-wide">
      Date
    </th>
    <th className="py-6 px-4 text-left text-5xl font-extrabold tracking-wide">
      Time
    </th>
    <th className="py-6 px-4 text-left text-5xl font-extrabold tracking-wide">
      Status
    </th>
    <th className="py-6 px-4 text-left text-5xl font-extrabold tracking-wide">
      Action
    </th>
  </tr>
</thead>
          <tbody>
            {serviceBookings.map((b) => (
              <tr key={b.id} className="border-t text-lg hover:bg-gray-50">
                <td className="py-3 px-4 font-bold">SB-{b.id}</td>
                <td className="py-3 px-4">{b.vehiclePart}</td>
                <td className="py-3 px-4">
                  {new Date(b.preferredDate).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">{b.timeSlot}</td>
                <td className="py-3 px-4 font-semibold">{b.status}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() =>
                      navigate(`/dashboard/customer/booking/${b.id}`)
                    }
                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1 rounded text-lg font-medium"
                  >
                    View Work
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ================= JOB CARDS ================= */}
      <h2 className="text-3xl font-semibold mb-4">Job Cards</h2>

      {loadingJobs ? (
        <p className="text-gray-300">Loading...</p>
      ) : jobCards.length === 0 ? (
        <p className="text-gray-300">No job cards found.</p>
      ) : (
        <table className="min-w-full bg-white text-black rounded-3xl overflow-hidden text-3xl font-medium">
          <thead className="bg-gray-100">
  <tr>
    <th className="py-6 px-4 text-left text-5xl font-extrabold tracking-wide">
      Job Card #
    </th>
    <th className="py-6 px-4 text-left text-5xl font-extrabold tracking-wide">
      Vehicle
    </th>
    <th className="py-6 px-4 text-left text-5xl font-extrabold tracking-wide">
      Service Type
    </th>
    <th className="py-6 px-4 text-left text-5xl font-extrabold tracking-wide">
      Odometer
    </th>
    <th className="py-6 px-4 text-left text-5xl font-extrabold tracking-wide">
      Voltage
    </th>
    <th className="py-6 px-4 text-left text-5xl font-extrabold tracking-wide">
      Status
    </th>
    <th className="py-6 px-4 text-left text-5xl font-extrabold tracking-wide">
      Created
    </th>
    <th className="py-6 px-4 text-left text-5xl font-extrabold tracking-wide">
      Action
    </th>
  </tr>
</thead>
          <tbody>
            {jobCards.map((job) => (
              <tr key={job.id} className="border-t text-lg hover:bg-gray-50">
                <td className="px-4 py-3 font-bold">{job.jobCardNumber}</td>
                <td className="px-4 py-3">{job.vehicle?.model || "-"}</td>
                <td className="px-4 py-3">{job.serviceType}</td>
                <td className="px-4 py-3">{job.odometer ?? "-"}</td>
                <td className="px-4 py-3">{job.batteryVoltage ?? "-"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded ${
                      statusColors[job.status] ||
                      "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {job.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-lg">
                  {new Date(job.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 space-x-4">
                  <Link
                    to={`/job-cards/${job.id}`}
                    className="text-blue-600 underline text-lg font-medium"
                  >
                    View
                  </Link>
                  <Link
                    to={`/customer/raise-complaint?jobCardId=${job.id}`}
                    className="text-red-600 underline text-lg font-medium"
                  >
                    Raise Complaint
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {error && <p className="text-red-400 mt-6">{error}</p>}
    </div>
  );
}