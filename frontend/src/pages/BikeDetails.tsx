import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

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
]
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
]
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
]
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
]
}
];

const featureImages: Record<string,string> = {

"No Age Limit": "/features/no-license.png",
"Range 50km+": "/features/range.png",
"Removable Battery": "/features/battery.png",
"Charging < 4 Hours": "/features/charging.png",
"High Load Capacity": "/features/load.png",
"Savings up to ₹1 Lakh": "/features/savings.png",

"Battery Swap Support": "/features/battery-swap.png",
"10° Incline Capability": "/features/incline.png",
"IoT Integrated System": "/features/iot.png",
"Ergonomic Seating": "/features/seat.png",
"40 km Range": "/features/range1.png",
"No License Required": "/features/no-license.png",
"25 km/h Speed": "/features/speed.png",

"Dual Suspension": "/features/suspension.png",
"Long Range Battery": "/features/battery.png",
"Fast Charging": "/features/charging.png",
"Urban Ride Optimized": "/features/city.png",
"Heavy Load Support": "/features/load.png",

"High Performance Motor": "/features/motor.png",
"Advanced Cooling System": "/features/cooling.png",
"Smart Dashboard": "/features/dashboard1.png",
"Extended Battery Life": "/features/battery.png",
"Premium Comfort Seating": "/features/seat.png"
};

export default function BikeDetails(){

const { id } = useParams();
const bike = bikes.find((b)=> b.id === Number(id));

const [activeIndex,setActiveIndex] = useState(0);

if(!bike){
return <div className="text-white p-10">Bike not found</div>;
}

/* Auto change feature image */

useEffect(() => {

window.scrollTo(0,0);

const interval = setInterval(()=>{
setActiveIndex((prev)=> (prev + 1) % bike.features.length)
},3500)

return ()=> clearInterval(interval)

},[bike.features.length])

return(

<div className="bg-black text-white">

{/* HERO SECTION */}

<section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-100 via-blue-200 to-teal-200 text-gray-900">

{/* soft background circles */}

<div className="absolute w-[500px] h-[500px] bg-white/40 rounded-full blur-3xl top-[-120px] left-[-120px]"></div>

<div className="absolute w-[400px] h-[400px] bg-white/30 rounded-full blur-3xl bottom-[-100px] right-[-120px]"></div>


<div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center min-h-screen px-6">

{/* LEFT CONTENT */}

<div>

<p className="tracking-widest text-gray-600 text-sm mb-3">
LET'S RIDE THE
</p>

<h1 className="text-6xl md:text-7xl font-bold leading-tight">
{bike.name}
</h1>

<p className="text-lg text-gray-700 mt-4 max-w-md">
{bike.tagline}
</p>

<div className="mt-10 space-y-6 max-w-md">

{bike.features.slice(0,4).map((feature,index)=>{

const icon = featureImages[feature];

return(

<div key={index} className="flex items-center gap-4">

<img
src={icon}
className="w-10 h-10 object-contain"
/>

<p className="text-gray-900 text-xl font-semibold">
{feature}
</p>

</div>

)

})}

</div>

</div>


{/* BIKE IMAGE */}

<div className="flex justify-center">

<img
src={bike.image}
className="max-h-[520px] object-contain drop-shadow-[0_40px_40px_rgba(0,0,0,0.25)] hover:scale-105 transition duration-500"
/>

</div>

</div>


{/* SPECS CARD */}

<div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-16 text-center">

<div>
<p className="text-2xl font-bold">{bike.range}</p>
<p className="text-sm text-gray-600">Range</p>
</div>

<div>
<p className="text-2xl font-bold">{bike.speed}</p>
<p className="text-sm text-gray-600">Top Speed</p>
</div>

<div>
<p className="text-2xl font-bold">{bike.acceleration}</p>
<p className="text-sm text-gray-600">0–60</p>
</div>

</div>

</section>

{/* PEAK PERFORMANCE */}

<section className="bg-black py-32 px-6 border-t border-gray-800">

  <div className="max-w-6xl mx-auto">
<h2 className="text-3xl md:text-4xl text-center text-gray-300 mb-16">
  Peak performance, brought to you by
</h2>

<div className="grid md:grid-cols-3 gap-8">

  {/* 1 — Hub Motor */}
  <div className="bg-[#0f0f0f] rounded-3xl overflow-hidden border border-gray-800 hover:border-indigo-500 transition">
    <img
      src="/features/motor.png"
      className="w-full h-56 object-cover"
    />

    <div className="p-6">
      <h3 className="text-lg font-semibold">
        Hub Motor System
      </h3>

      <p className="text-gray-400 text-lg mt-2">
        High-efficiency BLDC hub motor delivering instant torque,
        smooth acceleration and silent operation.
      </p>
    </div>
  </div>


  {/* 2 — Battery */}
  <div className="bg-[#0f0f0f] rounded-3xl overflow-hidden border border-gray-800 hover:border-indigo-500 transition">
    <img
      src="/features/battery.png"
      className="w-full h-56 object-cover"
    />

    <div className="p-6">
      <h3 className="text-lg font-semibold">
        Lithium-Ion Battery Pack
      </h3>

      <p className="text-gray-400 text-lg mt-2">
        High-density removable battery engineered for long range,
        fast charging and reliable everyday performance.
      </p>
    </div>
  </div>


  {/* 3 — Suspension */}
  <div className="bg-[#0f0f0f] rounded-3xl p-6 border border-gray-800 hover:border-indigo-500 transition">
    <h3 className="text-lg font-semibold">
      Monoshock Suspension
    </h3>

    <p className="text-gray-400 text-lg mt-2">
      Advanced rear suspension that absorbs bumps
      and keeps the scooter stable on uneven roads.
    </p>

    <img
      src="/features/suspension.png"
      className="mt-6 h-40 object-contain mx-auto"
    />
  </div>


  {/* 4 — Chassis */}
  <div className="bg-[#0f0f0f] rounded-3xl p-6 border border-gray-800 hover:border-indigo-500 transition">
    <h3 className="text-lg font-semibold">
      Reinforced Aluminium Chassis
    </h3>

    <p className="text-gray-400 text-lg mt-2">
      Lightweight yet strong structure designed to support
      the motor, battery and rider with perfect balance.
    </p>

    <img
      src="/features/chassis.png"
      className="mt-6 h-40 object-contain mx-auto"
    />
  </div>


  {/* 5 — Controller */}
  <div className="bg-[#0f0f0f] rounded-3xl overflow-hidden border border-gray-800 hover:border-indigo-500 transition">
    <img
      src="/features/dashboard1.png"
      className="w-full h-56 object-cover"
    />

    <div className="p-6">
      <h3 className="text-lg font-semibold">
        Electronic Motor Controller
      </h3>

      <p className="text-gray-400 text-lg mt-2">
        Intelligent controller that regulates power flow
        between the battery and motor for smooth riding.
      </p>
    </div>
  </div>


  {/* 6 — Dashboard */}
  <div className="bg-[#0f0f0f] rounded-3xl overflow-hidden border border-gray-800 hover:border-indigo-500 transition">
    <img
      src="/features/dashboard.png"
      className="w-full h-56 object-cover"
    />

    <div className="p-6">
      <h3 className="text-lg font-semibold">
        Smart Dashboard System
      </h3>

      <p className="text-gray-400 text-lg mt-2">
        Digital dashboard displaying speed, battery,
        ride data and smart connectivity features.
      </p>
    </div>
  </div>

</div>

  </div>

</section>


  {/* SMART VOICE ASSISTANT */}
  <section className="bg-black py-32 px-6 border-t border-gray-800">

    <div className="max-w-6xl mx-auto text-center">

      <span className="inline-block bg-green-600 text-xs px-3 py-1 rounded-full mb-4">
        Coming Soon
      </span>

      <h2 className="text-5xl font-bold">
        Smart Voice Assistant
      </h2>

      <p className="text-gray-400 mt-4 max-w-xl mx-auto">
        Talk to your scooter and control navigation, music,
        location sharing and more without touching the screen.
      </p>

      <div className="mt-20 grid md:grid-cols-3 gap-10 text-sm">

        {[
          "Share my Live Location",
          "How far is the nearest charging point?",
          "Play the next song",
          "Take me home",
          "Increase screen brightness",
          "Set traction control to Rain"
        ].map((command, index) => (

          <div
            key={index}
            className="group bg-gray-900 px-6 py-4 rounded-full border border-gray-800
            hover:border-indigo-500 hover:bg-gray-800 hover:scale-105
            transition duration-300 cursor-pointer flex items-center justify-center gap-2"
          >

            <span className="text-gray-200 group-hover:text-white transition">
              {command}
            </span>

            <span className="opacity-0 group-hover:opacity-100 transition text-indigo-400">
              ↗
            </span>

          </div>

        ))}

      </div>

    </div>

  </section>

</div>

);
}
