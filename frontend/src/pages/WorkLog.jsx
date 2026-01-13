import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../api/client";

export default function WorkLog() {
  const { id } = useParams();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get(`/job-cards/${id}/work-log`)
      .then(res => setLogs(res.data || []))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-4">Loading work logs...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Work Log</h1>

      {logs.length === 0 ? (
        <p className="text-gray-500">No work logs yet.</p>
      ) : (
        <ul className="space-y-2">
          {logs.map(log => (
            <li key={log.id} className="border p-3 rounded">
              <p className="font-medium">{log.description}</p>
              <p className="text-sm text-gray-500">
                {new Date(log.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
