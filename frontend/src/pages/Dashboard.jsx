import { useJobCards } from '../hooks/useJobCards';

export default function Dashboard() {
  const { jobCards, loading } = useJobCards();

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Job Cards</h1>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Job #</th>
            <th className="border p-2">Customer</th>
            <th className="border p-2">Vehicle</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {jobCards.map((j) => (
            <tr key={j.id}>
              <td className="border p-2">{j.jobCardNumber}</td>
              <td className="border p-2">{j.customer?.name}</td>
              <td className="border p-2">{j.vehicle?.vinNumber}</td>
              <td className="border p-2">{j.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
