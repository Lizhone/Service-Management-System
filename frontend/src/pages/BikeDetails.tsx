import { useParams, useNavigate } from "react-router-dom";

interface Bike {
  id: number;
  name: string;
  tagline: string;
  range: string;
  speed: string;
  acceleration: string;
  image: string;
  features: string[];
}

const bikes: Bike[] = [
  {
    id: 1,
    name: "Flee C2",
    tagline: "Premium Urban Mobility",
    range: "180 km",
    speed: "100 km/h",
    acceleration: "2.9s",
    image: "/bikes/flee-c2/default.png",
    features: [
      "No Age Limit",
      "Range 50km+",
      "Removable Battery",
      "Charging < 4 Hours",
      "High Load Capacity",
      "Savings up to ₹1 Lakh"
    ],
  },
  {
    id: 2,
    name: "Flee B1",
    tagline: "Smart Everyday Ride",
    range: "150 km",
    speed: "90 km/h",
    acceleration: "3.5s",
    image: "/bikes/flee-b1/default.png",
    features: [
      "Battery Swap Support",
      "10° Incline Capability",
      "IoT Integrated System",
      "Ergonomic Seating",
      "40 km Range",
      "No License Required",
      "25 km/h Speed"
    ],
  },
  {
    id: 3,
    name: "Flee B2",
    tagline: "Balanced Performance",
    range: "170 km",
    speed: "95 km/h",
    acceleration: "3.1s",
    image: "/bikes/flee-b2/default.png",
    features: [
      "Dual Suspension",
      "Long Range Battery",
      "Fast Charging",
      "Urban Ride Optimized",
      "Heavy Load Support"
    ],
  },
  {
    id: 4,
    name: "Flee B3",
    tagline: "Power & Efficiency Combined",
    range: "200 km",
    speed: "110 km/h",
    acceleration: "2.7s",
    image: "/bikes/flee-b3/default.png",
    features: [
      "High Performance Motor",
      "Advanced Cooling System",
      "Smart Dashboard",
      "Extended Battery Life",
      "Premium Comfort Seating"
    ],
  },
];

export default function BikeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const bike = bikes.find((b) => b.id === Number(id));

  if (!bike) {
    return <div className="text-white p-10">Bike not found</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* Bike Image */}
        <img
          src={bike.image}
          alt={bike.name}
          className="w-full max-h-[500px] object-contain"
        />

        {/* Bike Info */}
        <div>
          <h1 className="text-4xl font-bold">{bike.name}</h1>
          <p className="text-gray-400 mt-2">{bike.tagline}</p>

          {/* Specs */}
          <div className="grid grid-cols-3 gap-6 mt-8 text-center">
            <div>
              <p className="text-gray-400 text-sm">Range</p>
              <p className="font-semibold">{bike.range}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Top Speed</p>
              <p className="font-semibold">{bike.speed}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">0–60</p>
              <p className="font-semibold">{bike.acceleration}</p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-10">
            <h3 className="text-xl font-semibold mb-6">Key Features</h3>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
              {bike.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✔</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-10">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-700 rounded-md hover:bg-gray-600"
            >
              Back
            </button>

            <button
              onClick={() =>
                navigate("/test-ride", { state: { bike: bike.name } })
              }
              className="px-6 py-3 bg-blue-600 rounded-md hover:bg-blue-500"
            >
              Test Ride
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
