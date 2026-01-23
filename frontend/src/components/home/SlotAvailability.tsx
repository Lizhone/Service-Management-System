export default function SlotAvailability() {
  const mockSlots = [
    {
      id: 1,
      date: "January 25, 2026",
      slots: [
        { time: "09:00 AM", available: true },
        { time: "10:30 AM", available: true },
        { time: "12:00 PM", available: false },
        { time: "02:00 PM", available: true },
        { time: "03:30 PM", available: true },
        { time: "05:00 PM", available: false },
      ],
    },
    {
      id: 2,
      date: "January 26, 2026",
      slots: [
        { time: "09:00 AM", available: true },
        { time: "10:30 AM", available: true },
        { time: "12:00 PM", available: true },
        { time: "02:00 PM", available: false },
        { time: "03:30 PM", available: true },
        { time: "05:00 PM", available: true },
      ],
    },
    {
      id: 3,
      date: "January 27, 2026",
      slots: [
        { time: "09:00 AM", available: false },
        { time: "10:30 AM", available: true },
        { time: "12:00 PM", available: true },
        { time: "02:00 PM", available: true },
        { time: "03:30 PM", available: false },
        { time: "05:00 PM", available: true },
      ],
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Available Slots
        </h2>
        <div className="space-y-8">
          {mockSlots.map((day) => (
            <div key={day.id} className="border-l-4 border-blue-600 pl-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {day.date}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {day.slots.map((slot, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg text-center font-medium transition ${
                      slot.available
                        ? "bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {slot.time}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-600 mt-8">
          Click on an available slot to book your service appointment
        </p>
      </div>
    </section>
  );
}
