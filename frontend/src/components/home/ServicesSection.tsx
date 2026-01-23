export default function ServicesSection() {
  const services = [
    {
      id: 1,
      name: "General Service",
      description: "Regular maintenance and inspection of your vehicle",
    },
    {
      id: 2,
      name: "Paid Service",
      description: "Comprehensive paid service with parts replacement",
    },
    {
      id: 3,
      name: "Warranty Service",
      description: "Service covered under warranty terms",
    },
    {
      id: 4,
      name: "Complaint Service",
      description: "Address specific complaints and issues",
    },
    {
      id: 5,
      name: "Battery Service",
      description: "Battery diagnosis, maintenance, and replacement",
    },
    {
      id: 6,
      name: "Charger Service",
      description: "Charger inspection, repair, and replacement",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {service.name}
              </h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
