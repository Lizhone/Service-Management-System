import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import client from "../api/client";

export default function CustomerDetail() {
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
  const [jobCards, setJobCards] = useState([]); // ✅ MUST be []
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  const load = async () => {
    try {
      const customerRes = await client.get(`/customers/${id}`);
      const jobCardsRes = await client.get(`/customers/${id}/job-cards`);

      setCustomer(customerRes.data);

      setJobCards(
        Array.isArray(jobCardsRes.data?.data)
          ? jobCardsRes.data.data
          : []
      );
    } catch (err) {
      setError("Failed to load customer details");
    } finally {
      setLoading(false);
    }
  };

  load();
}, [id]);
;

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!customer) return <div className="p-6">Customer not found</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">{customer.name}</h1>
      <p className="text-gray-600 mb-6">{customer.mobileNumber}</p>

      <h2 className="text-lg font-semibold mb-3">Job Card History</h2>

      {jobCards.length === 0 ? (
        <p className="text-gray-500">No job cards found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th align="left">Job Card #</th>
              <th align="left">Vehicle</th>
              <th align="left">Service Type</th>
              <th align="left">Service Date/Time</th>
              <th align="left">Status</th>
              <th align="left">Odometer</th>
              <th align="left">Battery Voltage</th>
              <th align="left">Admin/Advisor Remark</th>
              <th align="left">Created At</th>
              <th align="left">Action</th>
            </tr>
          </thead>
          <tbody>
            {jobCards.map((jc) => (
              <tr key={jc.id} className="border-b">
                <td>{jc.jobCardNumber}</td>
                <td>{jc.vehicle?.model || "-"}</td>
                <td>{jc.serviceType}</td>
                <td>{jc.serviceInDatetime ? new Date(jc.serviceInDatetime).toLocaleString() : '-'}</td>
                <td>{jc.status}</td>
                <td>{jc.odometer ?? '-'}</td>
                <td>{jc.batteryVoltage ?? '-'}</td>
                <td>{jc.remarks || jc.adminRemark || jc.advisorRemark || '-'}</td>
                <td>{jc.createdAt ? new Date(jc.createdAt).toLocaleString() : '-'}</td>
                <td>
                  <Link
                    to={`/job-cards/${jc.id}`}
                    className="text-blue-600 underline"
                  >
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
