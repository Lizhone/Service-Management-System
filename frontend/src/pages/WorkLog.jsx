import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import client from "../api/client";

export default function WorkLog() {
  const { id } = useParams();

  const [taskName, setTaskName] = useState("");
  const [technicianName, setTechnicianName] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // TEMPORARY DEBUG: explicit token + header
  const load = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      console.log("TOKEN BEING SENT:", token);

      const res = await client.get(`/job-cards/${id}/work-log`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLogs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(
        "LOAD WORKLOG ERROR:",
        err.response?.status,
        err.response?.data || err.message
      );
      setError("Failed to load work logs");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const create = async () => {
    if (!taskName.trim() || !technicianName.trim()) return;

    try {
      setError("");

      await client.post(`/job-cards/${id}/work-log`, {
        taskName,
        technicianName,
      });

      setTaskName("");
      setTechnicianName("");
      load();
    } catch (err) {
      console.error(
        "CREATE WORKLOG ERROR:",
        err.response?.status,
        err.response?.data || err.message
      );
      setError("Failed to create task");
    }
  };

  const start = async (logId) => {
    try {
      setError("");
      await client.patch(`/work-log/${logId}/start`);
      load();
    } catch (err) {
      console.error(
        "START WORKLOG ERROR:",
        err.response?.status,
        err.response?.data || err.message
      );
      setError("Failed to start task");
    }
  };

  const complete = async (logId) => {
    try {
      setError("");
      await client.patch(`/work-log/${logId}/complete`);
      load();
    } catch (err) {
      console.error(
        "COMPLETE WORKLOG ERROR:",
        err.response?.status,
        err.response?.data || err.message
      );
      setError("Failed to complete task");
    }
  };

  const activeLogs = logs.filter(
    (l) => l.status === "PENDING" || l.status === "IN_PROGRESS"
  );
  const completedLogs = logs.filter((l) => l.status === "COMPLETED");

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Work Log</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Add task */}
      <div className="flex gap-2 mb-6">
        <input
          className="border px-3 py-2 flex-1 rounded"
          placeholder="Task name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <input
          className="border px-3 py-2 flex-1 rounded"
          placeholder="Technician name"
          value={technicianName}
          onChange={(e) => setTechnicianName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") create();
          }}
        />
        <button
          onClick={create}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Add Task
        </button>
      </div>

      {/* Active / Pending */}
      {activeLogs.length > 0 && (
        <>
          <h3 className="font-semibold mb-3 text-lg">Active / Pending</h3>
          <div className="space-y-2 mb-6">
            {activeLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 border rounded bg-gray-50 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">{log.taskName}</div>
                  <div className="text-sm text-gray-600">
                    Technician: {log.technicianName}
                  </div>
                  <div className="text-sm text-gray-600">
                    Status:{" "}
                    {log.status === "PENDING" ? "Pending" : "In Progress"}
                  </div>
                </div>

                <div className="flex gap-2">
                  {log.status === "PENDING" && (
                    <button
                      onClick={() => start(log.id)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                    >
                      Start
                    </button>
                  )}
                  {log.status === "IN_PROGRESS" && (
                    <button
                      onClick={() => complete(log.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Completed */}
      {completedLogs.length > 0 && (
        <>
          <h3 className="font-semibold mb-3 text-lg">Completed</h3>
          <div className="space-y-2">
            {completedLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 border rounded bg-green-50"
              >
                <div className="font-medium line-through">
                  {log.taskName}
                </div>
                <div className="text-sm text-gray-600">
                  Technician: {log.technicianName}
                </div>
                {log.durationMin != null && (
                  <div className="text-sm text-gray-600">
                    Duration: {log.durationMin} minutes
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {!loading && logs.length === 0 && (
        <div className="text-gray-500">No work logs yet.</div>
      )}

      {loading && (
        <div className="text-gray-500">Loading work logs…</div>
      )}
    </div>
  );
}
