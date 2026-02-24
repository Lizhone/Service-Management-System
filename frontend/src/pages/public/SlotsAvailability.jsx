import { useEffect, useState } from "react";
import client from "../../api/client";

export default function SlotsAvailability() {
  const [slots, setSlots] = useState([]);
  const [testRideHistory, setTestRideHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const today = new Date();

      // ✅ CHANGED: rolling 2 months (NOT 3)
      const twoMonthsLater = new Date();
      twoMonthsLater.setMonth(today.getMonth() + 2);

      const res = await client.get("/test-rides/slots-range", {
        params: {
          startDate: today.toISOString(),
          endDate: twoMonthsLater.toISOString(),
        },
      });

      setSlots(res.data || []);

      const historyRes = await client.get("/test-rides");
      setTestRideHistory(historyRes.data || []);
    } catch (err) {
      console.error("Failed to load slots:", err);
    } finally {
      setLoading(false);
    }
  };

  // confirmed lookup
  const confirmedSet = new Set(
    (testRideHistory || [])
      .filter((ride) => ride.status === "CONFIRMED")
      .map(
        (ride) =>
          `${new Date(ride.date).toDateString()}_${ride.timeSlot}`
      )
  );

  // group by month
  const groupedByMonth = slots.reduce((acc, day) => {
    const date = new Date(day.date);
    const monthKey = date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(day);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#01263B] text-white flex items-center justify-center">
        Loading slots...
      </div>
    );
  }

  return (
    // ✅ FULL WIDTH PAGE FIX
    <div className="w-full min-h-screen bg-[#01263B] text-white">

      {/* ✅ REMOVED max-w-7xl and mx-auto to prevent white sides */}

      <div className="w-full px-6 md:px-10 py-10">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Test Ride Availability
        </h1>

        {Object.keys(groupedByMonth).length === 0 && (
          <p className="text-center text-gray-400">
            No slots available
          </p>
        )}

        {Object.entries(groupedByMonth).map(([month, days]) => (
          <div key={month} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 border-b border-cyan-700 pb-2">
              {month}
            </h2>

            <div className="grid gap-6">
              {days.map((day) => (
                <div
                  key={day.date}
                  className="bg-[#0A3A55] rounded-xl p-5 shadow-lg"
                >
                  <h3 className="font-semibold mb-4 text-cyan-300">
                    {new Date(day.date).toDateString()}
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {(day.slots || []).map((slot) => {
                      const slotKey = `${new Date(day.date).toDateString()}_${slot.time}`;
                      const isBooked = confirmedSet.has(slotKey);

                      return (
                        <button
                          key={slot.time}
                          className={`
                            py-2 rounded-lg text-sm font-semibold border transition-all duration-200
                            ${
                              isBooked
                                ? "bg-green-500/20 text-green-300 border-green-500/40 opacity-80"
                                : "bg-[#083147] text-white border-cyan-500 hover:bg-cyan-600 hover:scale-105"
                            }
                          `}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}