import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../api/client";

export default function WorkLog() {
  const { id } = useParams();
  const [taskName, setTaskName] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await client.get(`/job-cards/${id}/work-log`);
      setLogs(res.data || []);
    } catch (err) {
      console.error("Failed to load work logs", err);
      alert("Failed to load work logs. Check console.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) load();
  }, [id]);

  const create = async () => {
    if (!taskName.trim()) return alert("Enter task name");

    try {
      await client.post(`/job-cards/${id}/work-log`, { taskName });
      setTaskName("");
      load();
    } catch (err) {
      console.error("Create failed", err);
      alert(err.response?.data?.error || "Create failed");
    }
  };

  const start = async (logId) => {
    try {
      await client.post(`/work-log/${logId}/start`);
      load();
    } catch (err) {
      console.error("Start failed", err);
      alert(err.response?.data?.error || "Start failed");
    }
  };

  const complete = async (logId) => {
    try {
      await client.post(`/work-log/${logId}/complete`);
      load();
    } catch (err) {
      console.error("Complete failed", err);
      alert(err.response?.data?.error || "Complete failed");
    }
  };

  if (loading) return <div className="p-6">Loading work logs…</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Work Log</h2>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1"
          placeholder="Task name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <button
          onClick={create}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Add Task
        </button>
      </div>

      <h3 className="font-semibold">Active / Pending</h3>
      {logs.filter((l) => l.status !== "COMPLETED").length === 0 && (
        <p className="text-gray-500 text-sm mb-2">No active tasks</p>
      )}

      {logs.filter((l) => l.status !== "COMPLETED").map((l) => (
        <div key={l.id} className="flex gap-2 border p-2 mb-2">
          <span className="flex-1">
            {l.taskName} ({l.status})
          </span>

          {l.status === "PENDING" && (
            <button
              className="text-blue-600"
              onClick={() => start(l.id)}
            >
              Start
            </button>
          )}

          {l.status === "ACTIVE" && (
            <button
              className="text-green-600"
              onClick={() => complete(l.id)}
            >
              Complete
            </button>
          )}
        </div>
      ))}

      <h3 className="font-semibold mt-4">Completed</h3>
      {logs.filter((l) => l.status === "COMPLETED").length === 0 && (
        <p className="text-gray-500 text-sm mb-2">No completed tasks</p>
      )}

      {logs.filter((l) => l.status === "COMPLETED").map((l) => (
        <div key={l.id} className="border p-2 text-gray-700">
          {l.taskName} — {l.durationMin ?? 0} min
        </div>
      ))}
    </div>
  );
}
