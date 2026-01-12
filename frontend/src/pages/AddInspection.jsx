import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useVehicleInspection } from "../hooks/useVehicleInspection";

const COMPONENTS = ["brakes", "lights", "tires", "battery"];

export default function AddInspection() {
  const { id } = useParams();
  const { submitInspection, fetchInspection } = useVehicleInspection();

  const [form, setForm] = useState({
    brakes: "OK",
    lights: "OK",
    tires: "OK",
    battery: "OK",
    remarks: "",
  });

  useEffect(() => {
    fetchInspection(id)
      .then((items) => {
        if (Array.isArray(items)) {
          const mapped = { remarks: "" };
          for (const item of items) {
            mapped[item.componentName.toLowerCase()] = item.condition;
          }
          setForm((prev) => ({ ...prev, ...mapped }));
        }
      })
      .catch(() => {});
  }, [id]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const payload = COMPONENTS.map((c) => ({
      componentName: c.charAt(0).toUpperCase() + c.slice(1),
      condition: form[c],
    }));

    await submitInspection(id, payload);
    alert("Inspection saved");
  };

  return (
    <div className="p-6 max-w-md space-y-4">
      <h2 className="text-xl font-bold">Vehicle Inspection</h2>

      {COMPONENTS.map((item) => (
        <div key={item} className="flex justify-between">
          <span className="capitalize">{item}</span>
          <select
            value={form[item]}
            onChange={(e) => handleChange(item, e.target.value)}
            className="border px-2 py-1"
          >
            <option value="OK">OK</option>
            <option value="NOT_OK">Not OK</option>
            <option value="DAMAGE">Damaged</option>
          </select>
        </div>
      ))}

      <textarea
        className="border p-2 w-full"
        placeholder="Remarks"
        value={form.remarks}
        onChange={(e) => handleChange("remarks", e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Inspection
      </button>
    </div>
  );
}
