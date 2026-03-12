import { useState, useEffect, useRef } from "react";
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
   Bike Card
========================= */

function BikeCard({ bike }: { bike: Bike }) {

  const navigate = useNavigate();

  const [selectedColor, setSelectedColor] = useState<BikeColor>(
    bike.colors[0]
  );

  return (

    <div className="relative h-[520px] rounded-2xl overflow-hidden group shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(0,0,0,0.6)]">

      {/* IMAGE */}

      <img
        key={selectedColor.image}
        src={selectedColor.image}
        alt={`${bike.name} - ${selectedColor.name}`}
        className="absolute inset-0 w-full h-full object-contain bg-gray-200 group-hover:scale-105 transition duration-500"
      />

      {/* OVERLAY */}

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70"></div>

      {/* CONTENT */}

      <div className="relative z-10 flex flex-col justify-between h-full p-8 text-white">

        {/* TOP */}

        <div>

          <h2 className="text-3xl font-semibold">
            {bike.name}
          </h2>

          <p className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm mt-2">
            {bike.tagline}
          </p>

        </div>


        {/* BOTTOM */}

        <div>

          <p className="text-2xl text-gray-100 text-semibold">
            Prices starting at
          </p>

          <p className="text-xl font-semibold mt-1">
            {bike.price}
          </p>

          {/* COLORS */}

          {bike.colors.length > 1 && (

            <div className="flex gap-3 mt-4">

              {bike.colors.map((color) => (

                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={`w-7 h-7 rounded-full border-2 transition ${
                    selectedColor.name === color.name
                      ? "border-white scale-110"
                      : "border-gray-400"
                  }`}
                  style={{ backgroundColor: color.hex }}
                />

              ))}

            </div>

          )}

          {/* BUTTONS */}

          <div className="flex gap-4 mt-6">

            <button
              onClick={() => navigate(`/bike/${bike.id}`)}
              className="px-5 py-2 bg-black/60 border border-white/40 rounded-full text-sm font-medium hover:bg-black transition"
            >
              Explore
            </button>

          </div>

        </div>
        

      </div>

    </div>

  );

}

type ProgressCircleProps = {
  percent: number;
  animate?: boolean;
};

function ProgressCircle({ percent, animate = false }: ProgressCircleProps) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => setProgress(percent), 120);
      return () => clearTimeout(t);
    } else {
      setProgress(percent);
    }
  }, [percent, animate]);

  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg className="absolute w-20 h-20 -rotate-90">
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="#374151"
          strokeWidth="8"
          fill="transparent"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="#facc15"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-[1400ms]"
        />
      </svg>

      <span className="text-white font-semibold text-lg">{progress}%</span>
    </div>
  );
}

/* =========================
   Main Component
========================= */

export default function ServicesSection() {
  const navigate = useNavigate();
  const valueSectionRef = useRef<HTMLDivElement | null>(null);
const [animateProgress, setAnimateProgress] = useState(false);

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

  <section className="bg-[#05101a] py-24 px-6">

    {/* SECTION HEADING */}

    <div className="max-w-7xl mx-auto text-center mb-16">

      <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">
        Our Electric Bikes
      </h2>

      <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
        Discover the next generation of urban mobility designed for performance,
        efficiency, and everyday convenience.
      </p>

    </div>

    {/* BIKE GRID */}

    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

      {bikes.map((bike) => (
        <BikeCard key={bike.id} bike={bike} />
      ))}

    </div>

    {/* BOOK TEST RIDE CTA */}

<div className="flex justify-center mt-16 mb-10">

  <button
  onClick={() => navigate("/test-ride")}
  className="px-10 py-4 text-lg font-semibold border-2 border-white text-white rounded-full hover:bg-white hover:text-black transition duration-300"
>
  Book Test Ride
</button>

</div>

     {/* VALUE ASSURANCE */}
      <div
        ref={valueSectionRef}
        className="w-full mt-24 mb-20 bg-black text-white rounded-xl overflow-hidden grid md:grid-cols-3 items-center border border-gray-800"
      >

        {/* LEFT */}
        <div className="p-10 border-r border-gray-800 flex flex-col justify-between">

          <p className="text-xl font-medium">
            inGO Electric Value Assurance
          </p>

          <p className="text-lg text-gray-400 mt-16 max-w-sm">
            Enjoy long-term value with your inGO electric vehicle.
            Our value assurance program helps you upgrade or return
            your vehicle with attractive buyback options.
          </p>

        </div>

        {/* CENTER */}
        <div className="p-10 text-center">

          <h2 className="text-4xl md:text-5xl font-bold mb-10 leading-tight">
            Smart mobility today. <br />
            Value for tomorrow.
          </h2>

          <div className="flex justify-center gap-16">

            <div>
              <ProgressCircle percent={60} animate={animateProgress} />
              <p className="text-sm text-gray-400 mt-4">
                Assured value after 12 months
              </p>
            </div>

            <div>
              <ProgressCircle percent={50} animate={animateProgress} />
              <p className="text-sm text-gray-400 mt-4">
                Assured value after 24 months
              </p>
            </div>

          </div>

        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center items-center">

         <img
  src="/bikes/flee-b3/default.png"
  alt="inGO Electric Bike"
  className="bike-slide-fade bike-float img-hover w-[380px] md:w-[420px] object-contain"
/>
        </div>

      </div>

      {/* STEPS SECTION */}
      <div className="w-full mb-24 bg-black text-white rounded-xl overflow-hidden grid md:grid-cols-2 items-center border border-gray-800">

        {/* IMAGE */}
        <div className="flex justify-center p-10">

          <img
  src="/images/bike-riders.png"
  alt="Bike Riders"
  className="img-hover w-[480px] md:w-[520px] object-contain"
/>

        </div>

        {/* TEXT */}
        <div className="px-12 py-12 text-left">

          <h2 className="text-4xl md:text-5xl italic mb-10 leading-snug">
            3 easy steps to avail Assured Buyback
          </h2>

          <div className="space-y-6 text-gray-300 text-lg">

            <div className="flex gap-4">
              <span className="text-green-400 text-xl">✔</span>
              <p>
                <strong>Book a Test Ride.</strong> Experience the innovation and
                performance of inGO Electric vehicles.
              </p>
            </div>

            <div className="flex gap-4">
              <span className="text-green-400 text-xl">✔</span>
              <p>
                <strong>Vehicle Inspection.</strong> Bring your vehicle to our
                authorized service centre for a complete inspection.
              </p>
            </div>

            <div className="flex gap-4">
              <span className="text-green-400 text-xl">✔</span>
              <p>
                <strong>Confirm Your Service.</strong> Review the inspection
                report and confirm the required service.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* BATTERY TECHNOLOGY SECTION */}

<div className="card-hover bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl transition duration-500">

  <div className="card-hover bg-gray-900 rounded-xl p-6 border border-gray-700 transition">
    {/* LEFT SIDE */}

    <div>

      <h2 className="text-4xl md:text-5xl font-semibold text-white leading-tight mb-8">
        Advanced Battery <br/> Technology
      </h2>

      <p className="text-gray-400 mb-10 max-w-md">
        inGO Electric vehicles are powered by high-performance lithium-ion
        batteries designed for efficiency, safety, and long-term durability.
        Our battery systems ensure reliable range and consistent performance
        for everyday urban mobility.
      </p>

      <div className="mt-8 flex justify-left">

  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition duration-500">

    <img
      src="/features/inbattery.png"
      alt="Battery System"
      className="w-[300px] object-contain"
    />

  </div>

</div>
    </div>


    {/* RIGHT SIDE */}

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

      {/* RANGE */}

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 hover:border-yellow-400 transition">

        <p className="text-green-400 font-medium mb-2">
          Long Range
        </p>

        <h3 className="text-xl text-white font-semibold mb-3">
          Efficient Energy Output
        </h3>

        <p className="text-sm text-gray-400">
          Our lithium-ion battery system delivers consistent energy output,
          allowing riders to travel longer distances with fewer charging cycles.
        </p>

      </div>


      {/* PERFORMANCE */}

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 hover:border-yellow-400 transition">

        <p className="text-green-400 font-medium mb-2">
          Performance
        </p>

        <h3 className="text-xl text-white font-semibold mb-3">
          Stable Power Delivery
        </h3>

        <p className="text-sm text-gray-400">
          Intelligent battery management ensures smooth power delivery and
          consistent riding performance.
        </p>

      </div>


      {/* ACCELERATION */}

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 hover:border-yellow-400 transition">

        <p className="text-green-400 font-medium mb-2">
          Acceleration
        </p>

        <h3 className="text-xl text-white font-semibold mb-3">
          Instant Electric Torque
        </h3>

        <p className="text-sm text-gray-400">
          Electric torque delivers instant acceleration, making city commuting
          quick and responsive.
        </p>

      </div>


      {/* SAFETY */}

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 hover:border-yellow-400 transition">

        <p className="text-green-400 font-medium mb-2">
          Safety
        </p>

        <h3 className="text-xl text-white font-semibold mb-3">
          Smart Battery Protection
        </h3>

        <p className="text-sm text-gray-400">
          Built-in battery protection systems monitor temperature and voltage
          for safe and reliable operation.
        </p>

      </div>

    </div>

  </div>

 {/* ===============================
   INGO ADVANTAGES SECTION
================================ */}

<div className="w-full bg-black py-28 mt-24 border border-gray-800 rounded-2xl">

  {/* HEADER */}

  <div className="text-center mb-16">

    <span className="px-4 py-1 rounded-full border text-green-400 text-lg font-medium">
      inGO Advantage
    </span>

    <h2 className="text-4xl md:text-5xl font-semibold text-white mt-6">
      Smart mobility built for the future
    </h2>

    <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-lg">
      inGO Electric bikes are designed to deliver intelligent connectivity,
      practical urban mobility, and efficient electric transportation.
    </p>

  </div>


  {/* ADVANTAGE GRID */}

  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-6">


    {/* IoT */}

    <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 transition duration-300 hover:-translate-y-2 hover:border-yellow-400 hover:shadow-xl">

      <h3 className="text-xl font-semibold text-green-400 mb-3">
      Smart IoT Connectivity
     </h3>

      <p className="text-gray-400 text-lg">
        inGO EVs integrate IoT and telematics systems that allow riders
        to monitor and manage their vehicles digitally.
      </p>

      <ul className="mt-4 text-gray-400 text-lg space-y-1">
        <li>• GPS tracking</li>
        <li>• Remote locking / unlocking</li>
        <li>• Geo-fencing</li>
        <li>• Theft & tow alerts</li>
        <li>• Ride status monitoring</li>
      </ul>

    </div>


    {/* Urban Mobility */}

    <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 transition duration-300 hover:-translate-y-2 hover:border-yellow-400 hover:shadow-xl">

      <h3 className="text-xl font-semibold text-green-400 mb-3">
        Designed for Urban Mobility
      </h3>

      <p className="text-gray-400 text-lg">
        inGO electric bikes are engineered specifically for city mobility
        and last-mile transportation.
      </p>

      <ul className="mt-4 text-gray-400 text-lg space-y-1">
        <li>• Short daily commuting</li>
        <li>• Campus transportation</li>
        <li>• Delivery & logistics usage</li>
        <li>• Efficient navigation in city traffic</li>
      </ul>

    </div>


    {/* Low Cost */}

    <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 transition duration-300 hover:-translate-y-2 hover:border-yellow-400 hover:shadow-xl">

      <h3 className="text-xl font-semibold text-green-400 mb-3">
        Extremely Low Running Cost
      </h3>

      <p className="text-gray-400 text-lg">
        inGO electric bikes are highly economical compared to petrol vehicles.
      </p>

      <ul className="mt-4 text-gray-400 text-lg space-y-1">
        <li>• ₹5 electricity cost for ~50 km</li>
        <li>• Charge from regular home socket</li>
        <li>• Full charge in about 4 hours</li>
      </ul>

    </div>


    {/* Load Capacity */}

    <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 transition duration-300 hover:-translate-y-2 hover:border-yellow-400 hover:shadow-xl">

    <h3 className="text-xl font-semibold text-green-400 mb-3">
        High Load Capacity
      </h3>

      <p className="text-gray-400 text-lg">
        Flee models are designed for utility and commercial applications.
      </p>

      <ul className="mt-4 text-gray-400 text-lg space-y-1">
        <li>• Cargo carrying capability</li>
        <li>• Rear carrier support</li>
        <li>• Ideal for delivery fleets</li>
        <li>• Suitable for logistics operations</li>
      </ul>

    </div>


    {/* Battery */}

    <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 transition duration-300 hover:-translate-y-2 hover:border-yellow-400 hover:shadow-xl">

      <h3 className="text-xl font-semibold text-green-400 mb-3">
        Removable Battery System
      </h3>

      <p className="text-gray-400 text-lg">
        The removable lithium-ion battery offers convenient charging
        and operational flexibility.
      </p>

      <ul className="mt-4 text-gray-400 text-lg space-y-1">
        <li>• Charge at home or office</li>
        <li>• Quick battery replacement</li>
        <li>• Ideal for fleet operators</li>
      </ul>

    </div>


    {/* Made in India */}

    <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 transition duration-300 hover:-translate-y-2 hover:border-yellow-400 hover:shadow-xl">

     <h3 className="text-xl font-semibold text-green-400 mb-3">
        Made-in-India Technology
      </h3>

      <p className="text-gray-400 text-lg">
        inGO Electric focuses on locally developed components and
        indigenous battery systems to support Indian manufacturing
        and reduce reliance on imports.
      </p>

    </div>

  </div>
</div>
</div>
  </section>
  

  

);
}