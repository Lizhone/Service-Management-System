import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchParts, saveParts } from "../api/parts";

const emptyRow = {
  partName: "",
  partNumber: "",
  action: "REPLACE",
  warrantyApplicable: false,
};

export default function PartsReplacement() {
  const { id } = useParams();
  const [rows, setRows] = useState([emptyRow]);
  const [existing, setExisting] = useState([]);

  const loadParts = async () => {
    const res = await fetchParts(id);
    setExisting(res.data);
  };

  useEffect(() => {
    loadParts();
  }, [id]);

  const updateRow = (i, key, value) => {
    const updated = [...rows];
    updated[i] = { ...updated[i], [key]: value };
    setRows(updated);
  };

  const addRow = () => setRows([...rows, { ...emptyRow }]);

  const handleSubmit = async () => {
    const valid = rows.every((r) => r.partName && r.action);
    if (!valid) return alert("Fill all required fields");

    await saveParts(id, rows);
    setRows([{ ...emptyRow }]);
    loadParts();
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Parts Replacement</h2>

      {rows.map((r, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input
            className="border p-1"
            placeholder="Part Name"
            value={r.partName}
            onChange={(e) => updateRow(i, "partName", e.target.value)}
          />
          <input
            className="border p-1"
            placeholder="Part Number"
            value={r.partNumber}
            onChange={(e) => updateRow(i, "partNumber", e.target.value)}
          />
          <select
            className="border p-1"
            value={r.action}
            onChange={(e) => updateRow(i, "action", e.target.value)}
          >
            <option value="NEW">New</option>
            <option value="REPLACE">Replace</option>
            <option value="REFURBISHED">Refurbished</option>
          </select>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={r.warrantyApplicable}
              onChange={(e) =>
                updateRow(i, "warrantyApplicable", e.target.checked)
              }
            />
            Warranty
          </label>
        </div>
      ))}

      <div className="flex gap-2">
        <button onClick={addRow} className="bg-gray-300 px-3 py-1 rounded">
          + Add
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          Save Parts
        </button>
      </div>

      <h3 className="font-semibold mt-4">Existing Parts</h3>
      <ul className="list-disc ml-5">
        {existing.map((p) => (
          <li key={p.id}>
            {p.partName} — {p.action} {p.warrantyApplicable && "(Warranty)"}
          </li>
        ))}
      </ul>
    </div>
  );
}
