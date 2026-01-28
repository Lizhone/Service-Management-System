import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import client from "../api/client";

export default function CustomerDetail() {
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
  const [jobCards, setJobCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const customerRes = await client.get(`/customers/${id}`);
        const jobCardsRes = await client.get(
          `/customers/${id}/job-cards?page=1&limit=20`
        );

        setCustomer(customerRes.data);
        setJobCards(jobCardsRes.data.data); // ✅ FIXED
      } catch (err) {
        console.error("Failed to load customer history", err);
        setCustomer(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!customer) return <div className="p-6">Customer not found</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">{customer.name}</h1>
      <p className="text-gray-600 mb-6">{customer.mobileNumber}</p>

      <h2 className="text-lg font-semibold mb-3">Job Card History</h2>

      {jobCards.length === 0 ? (
        <p className="text-gray-500">No job cards found for this customer.</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="border-b bg-gray-50">
              <th align="left" className="p-2">Job Card #</th>
              <th align="left" className="p-2">Vehicle</th>
              <th align="left" className="p-2">Service</th>
              <th align="left" className="p-2">Status</th>
              <th align="left" className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {jobCards.map((jc) => (
              <tr key={jc.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{jc.jobCardNumber}</td>
                <td className="p-2">
                  {jc.vehicle?.model || "-"}
                </td>
                <td className="p-2">{jc.serviceType}</td>
                <td className="p-2">{jc.status}</td>
                <td className="p-2">
                  <Link
                    to={`/job-cards/${jc.id}`}
                    className="text-blue-600 hover:underline"
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
