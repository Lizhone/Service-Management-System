import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* =========================
   Types
========================= */

interface BikeColor {
  name: string;
  image: string;
  hex: string;
}

interface Bike {
  id: number;
  name: string;
  tagline: string;
  range: string;
  speed: string;
  acceleration: string;
  price: string;
  colors: BikeColor[];
}

/* =========================
   Bike Slide Component
========================= */

function BikeSlide({ bike }: { bike: Bike }) {
  const navigate = useNavigate();

  const [selectedColor, setSelectedColor] = useState<BikeColor>(
    bike.colors[0]
  );

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-gray-900 via-black to-black flex flex-col justify-between text-white py-20">
      {/* ===== IMAGE AREA ===== */}
      <div className="flex-1 flex items-center justify-center">
        <div className="h-[55vh] w-full flex items-center justify-center">
          <img
            key={selectedColor.image}
            src={selectedColor.image}
            alt={`${bike.name} - ${selectedColor.name}`}
            className="max-h-full max-w-full object-contain transition-all duration-500"
          />
        </div>
      </div>

      {/* ===== GLASS PANEL ===== */}
      <div className="w-[80%] max-w-5xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
        {/* Top Row */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              {bike.name}
            </h2>
            <p className="text-gray-400 mt-1">{bike.tagline}</p>
          </div>

          <div className="text-2xl font-semibold">{bike.price}</div>
        </div>

        {/* Specs */}
        <div className="flex justify-between mt-6 text-sm text-gray-400">
          <div>
            <p className="text-xl uppercase tracking-wide">Range</p>
            <p className="text-xl text-white font-medium mt-1">
              {bike.range}
            </p>
          </div>

          <div>
            <p className="text-xl uppercase tracking-wide">Top Speed</p>
            <p className="text-xl text-white font-medium mt-1">
              {bike.speed}
            </p>
          </div>

          <div>
            <p className="text-xl uppercase tracking-wide">0–60</p>
            <p className="text-xl text-white font-medium mt-1">
              {bike.acceleration}
            </p>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex justify-between items-center mt-8">
          {/* Color Selector */}
          {bike.colors.length > 1 && (
            <div className="flex gap-3">
              {bike.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={`w-7 h-7 rounded-full border-2 transition ${
                    selectedColor.name === color.name
                      ? "border-white scale-110"
                      : "border-gray-600"
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          )}

          {/* View Details */}
          <button
            onClick={() => navigate(`/bike/${bike.id}`)}
            className="px-5 py-2.5 border border-gray-500 rounded-md hover:border-white transition"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================
   Main Component
========================= */

export default function ServicesSection() {
  const navigate = useNavigate();

  const bikes: Bike[] = [
    {
      id: 1,
      name: "Flee C2",
      tagline: "Premium Urban Mobility",
      range: "180 km",
      speed: "100 km/h",
      acceleration: "2.9s",
      price: "₹1,49,999",
      colors: [
        { name: "Black", image: "/bikes/flee-c2/black.png", hex: "#111111" },
        { name: "Blue", image: "/bikes/flee-c2/blue.png", hex: "#1D4ED8" },
        { name: "Red", image: "/bikes/flee-c2/red.png", hex: "#C1121F" },
        { name: "Yellow", image: "/bikes/flee-c2/yellow.png", hex: "#FACC15" },
      ],
    },
    {
      id: 2,
      name: "Flee B1",
      tagline: "Smart Everyday Ride",
      range: "150 km",
      speed: "90 km/h",
      acceleration: "3.5s",
      price: "₹1,19,999",
      colors: [
        { name: "Default", image: "/bikes/flee-b1/default.png", hex: "#444444" },
        { name: "Blue", image: "/bikes/flee-c2/blue.png", hex: "#1D4ED8" },
        { name: "Red", image: "/bikes/flee-c2/red.png", hex: "#C1121F" },
        { name: "Yellow", image: "/bikes/flee-c2/yellow.png", hex: "#FACC15" },
      ],
    },
    {
      id: 3,
      name: "Flee B2",
      tagline: "Balanced Performance",
      range: "170 km",
      speed: "95 km/h",
      acceleration: "3.1s",
      price: "₹1,29,999",
      colors: [
        { name: "Default", image: "/bikes/flee-b2/default.png", hex: "#444444" },
        { name: "Blue", image: "/bikes/flee-c2/blue.png", hex: "#1D4ED8" },
        { name: "Red", image: "/bikes/flee-c2/red.png", hex: "#C1121F" },
        { name: "Yellow", image: "/bikes/flee-c2/yellow.png", hex: "#FACC15" },
      ],
    },
    {
      id: 4,
      name: "Flee B3",
      tagline: "Power & Efficiency Combined",
      range: "200 km",
      speed: "110 km/h",
      acceleration: "2.7s",
      price: "₹1,79,999",
      colors: [
        { name: "Default", image: "/bikes/flee-b3/default.png", hex: "#444444" },
        { name: "Blue", image: "/bikes/flee-c2/blue.png", hex: "#1D4ED8" },
        { name: "Red", image: "/bikes/flee-c2/red.png", hex: "#C1121F" },
        { name: "Yellow", image: "/bikes/flee-c2/yellow.png", hex: "#FACC15" },
      ],
    },
  ];

  return (
    <section className="bg-black">
      {/* Bikes */}
      {bikes.map((bike) => (
        <BikeSlide key={bike.id} bike={bike} />
      ))}

      {/* ===== PREMIUM CTA BLOCK ===== */}
      <div className="py-24 flex justify-center bg-black border-t border-white/10">
        <button
          onClick={() => navigate("/test-ride")}
          className="px-12 py-5 bg-white text-black text-lg font-semibold rounded-2xl hover:bg-gray-200 transition shadow-xl"
        >
          Book Test Ride
        </button>
      </div>
    </section>
  );
}