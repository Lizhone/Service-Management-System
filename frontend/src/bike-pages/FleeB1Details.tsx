import { useEffect } from "react";

export default function FleeB1Details() {

useEffect(() => {
window.scrollTo({ top: 0, behavior: "instant" });
}, []);

return (

<div className="min-h-screen bg-white text-gray-900">

{/* HERO SECTION */}

<section className="text-center py-28 px-6">

<h1 className="text-5xl md:text-6xl font-bold animate-fadeUp">
Flee B1
</h1>

<p className="mt-4 text-gray-500 text-lg animate-fadeUp">
Smart Everyday Ride
</p>

<img
src="/bikes/flee-b1/default.png"
className="mx-auto mt-14 max-h-[420px] animate-bikeFade"
/>

</section>


{/* PERFORMANCE SPECS */}

<section className="pb-28">

<div className="flex justify-center gap-20 text-center">

<div className="animate-fadeUp delay-200">
<p className="text-3xl font-bold">150 km</p>
<p className="text-gray-500 mt-1">Range</p>
</div>

<div className="animate-fadeUp delay-300">
<p className="text-3xl font-bold">90 km/h</p>
<p className="text-gray-500 mt-1">Top Speed</p>
</div>

<div className="animate-fadeUp delay-500">
<p className="text-3xl font-bold">3.5s</p>
<p className="text-gray-500 mt-1">0-60</p>
</div>

</div>

</section>
{/* TECHNOLOGY SECTION */}

<section className="bg-[#01263B] py-24 px-6">

<div className="max-w-6xl mx-auto">

<h2 className="text-3xl font-semibold mb-14 text-white">
Technologies Used in Flee B1 
</h2>

<div className="grid md:grid-cols-2 gap-8">


{/* 1 BLDC MOTOR */}

<div className="relative rounded-2xl overflow-hidden group h-[320px] shadow-xl">

<img
src="/features/motor.png"
className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110"
/>

<div className="absolute inset-0 bg-black/60"></div>

<div className="relative p-8 text-white">

<h3 className="text-xl font-semibold mb-3">
1. BLDC Hub Motor Technology
</h3>

<p className="text-lg text-gray-200 mb-3">
The B1 electric bike uses a Brushless Direct Current hub motor mounted
directly in the wheel, improving efficiency and reducing mechanical loss.
</p>

<ul className="text-lg text-gray-200 space-y-1">
<li>• High efficiency</li>
<li>• Low maintenance</li>
<li>• Quiet operation</li>
<li>• Long lifespan</li>
</ul>

</div>

</div>


{/* 2 BATTERY */}

<div className="relative rounded-2xl overflow-hidden group h-[320px] shadow-xl">

<img
src="/features/battery.png"
className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110"
/>

<div className="absolute inset-0 bg-black/60"></div>

<div className="relative p-8 text-white">

<h3 className="text-xl font-semibold mb-3">
2. Lithium-Ion Battery Technology
</h3>

<p className="text-lg text-gray-200 mb-3">
The B1 bike uses a Lithium-Ion battery pack that provides higher energy
density and longer lifespan than traditional batteries.
</p>

<ul className="text-lg text-gray-200 space-y-1">
<li>• Lightweight battery pack</li>
<li>• Fast charging capability</li>
<li>• High energy efficiency</li>
<li>• Long battery life cycles</li>
</ul>

</div>

</div>


{/* 3 BMS */}

<div className="relative rounded-2xl overflow-hidden group h-[320px] shadow-xl">

<img
src="/features/BMS.png"
className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110"
/>

<div className="absolute inset-0 bg-black/60"></div>

<div className="relative p-8 text-white">

<h3 className="text-xl font-semibold mb-3">
3. Battery Management System
</h3>

<p className="text-lg text-gray-200 mb-3">
The BMS monitors battery voltage and temperature to ensure safe operation
and improve battery lifespan.
</p>

<ul className="text-lg text-gray-200 space-y-1">
<li>• Voltage monitoring</li>
<li>• Temperature monitoring</li>
<li>• Battery protection</li>
<li>• Charging control</li>
</ul>

</div>

</div>


{/* 4 ECU */}

<div className="relative rounded-2xl overflow-hidden group h-[320px] shadow-xl">

<img
src="/features/electronic unit.png"
className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110"
/>

<div className="absolute inset-0 bg-black/60"></div>

<div className="relative p-8 text-white">

<h3 className="text-xl font-semibold mb-3">
4. Electronic Controller Unit
</h3>

<p className="text-lg text-gray-200 mb-3">
The ECU manages motor performance and regulates power delivery
from the battery.
</p>

<ul className="text-lg text-gray-200 space-y-1">
<li>• Motor control</li>
<li>• Speed regulation</li>
<li>• Power optimization</li>
<li>• Energy management</li>
</ul>

</div>

</div>


{/* 5 REGENERATIVE BRAKING */}

<div className="relative rounded-2xl overflow-hidden group h-[320px] shadow-xl">

<img
src="/features/Regenerative Braking Technology.png"
className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110"
/>

<div className="absolute inset-0 bg-black/60"></div>

<div className="relative p-8 text-white">

<h3 className="text-xl font-semibold mb-3">
5. Regenerative Braking Technology
</h3>

<p className="text-lg text-gray-200 mb-3">
Regenerative braking converts braking energy back into electrical energy
and stores it in the battery.
</p>

<ul className="text-lg text-gray-200 space-y-1">
<li>• Improves efficiency</li>
<li>• Extends driving range</li>
<li>• Reduces energy loss</li>
</ul>

</div>

</div>


{/* 6 DIGITAL DISPLAY */}

<div className="relative rounded-2xl overflow-hidden group h-[320px] shadow-xl">

<img
src="/features/dashboard.png"
className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110"
/>

<div className="absolute inset-0 bg-black/60"></div>

<div className="relative p-8 text-white">

<h3 className="text-xl font-semibold mb-3">
6. Smart Digital Display
</h3>

<p className="text-lg text-gray-200 mb-3">
A digital dashboard provides real-time information to riders.
</p>

<ul className="text-lg text-gray-200 space-y-1">
<li>• Speed indicator</li>
<li>• Battery level display</li>
<li>• Distance tracking</li>
<li>• Warning indicators</li>
</ul>

</div>

</div>


{/* 7 IOT CONNECTIVITY */}

<div className="relative rounded-2xl overflow-hidden group h-[320px] shadow-xl">

<img
src="/features/iot.png"
className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110"
/>

<div className="absolute inset-0 bg-black/60"></div>

<div className="relative p-8 text-white">

<h3 className="text-xl font-semibold mb-3">
7. IoT Smart Connectivity
</h3>

<p className="text-lg text-gray-200 mb-3">
IoT integration allows riders to monitor and control vehicle functions
via mobile applications.
</p>

<ul className="text-lg text-gray-200 space-y-1">
<li>• GPS tracking</li>
<li>• Vehicle diagnostics</li>
<li>• Theft alerts</li>
<li>• Remote monitoring</li>
</ul>

</div>

</div>


{/* 8 CHASSIS */}

<div className="relative rounded-2xl overflow-hidden group h-[320px] shadow-xl">

<img
src="/features/chassis.png"
className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110"
/>

<div className="absolute inset-0 bg-black/60"></div>

<div className="relative p-8 text-white">

<h3 className="text-xl font-semibold mb-3">
8. Lightweight Chassis Design
</h3>

<p className="text-lg text-gray-200">
The B1 electric bike features a lightweight yet durable chassis that
improves balance, stability and efficiency.
</p>

</div>

</div>


</div>

</div>

</section>

{/* SAFETY SECTION */}

<section className="bg-[#01263B] text-white py-24 px-6">

<div className="max-w-6xl mx-auto">

<h2 className="text-3xl font-semibold mb-14">
Safety Features 
</h2>

<div className="grid md:grid-cols-3 gap-8">


{/* LED LIGHT */}

<div className="bg-[#0c3a55] rounded-2xl p-5 shadow-lg hover:scale-105 transition">

<img
src="/features/LED.png"
className="rounded-xl mb-6 w-full h-[200px] object-cover"
/>

<h3 className="text-lg font-semibold mb-2">
LED Headlight and Tail Light
</h3>

<p className="text-gray-200 text-sm leading-relaxed">
Improves visibility during night riding and alerts vehicles behind
the rider when braking.
</p>

</div>


{/* BRAKING SYSTEM */}

<div className="bg-[#0c3a55] rounded-2xl p-5 shadow-lg hover:scale-105 transition">

<img
src="/features/RBS.png"
className="rounded-xl mb-6 w-full h-[200px] object-cover"
/>

<h3 className="text-lg font-semibold mb-2">
Reliable Braking System
</h3>

<p className="text-gray-200 text-sm leading-relaxed">
Provides quick stopping power and improves control during emergency
situations.
</p>

</div>


{/* SPEED CONTROL */}

<div className="bg-[#0c3a55] rounded-2xl p-5 shadow-lg hover:scale-105 transition">

<img
src="/features/dashboard.png"
className="rounded-xl mb-6 w-full h-[200px] object-cover"
/>

<h3 className="text-lg font-semibold mb-2">
Speed Control System
</h3>

<p className="text-gray-200 text-sm leading-relaxed">
Multiple speed modes allow riders to adjust speed for better control
depending on road conditions.
</p>

</div>


{/* STRONG FRAME */}

<div className="bg-[#0c3a55] rounded-2xl p-5 shadow-lg hover:scale-105 transition">

<img
src="/features/chassis.png"
className="rounded-xl mb-6 w-full h-[200px] object-cover"
/>

<h3 className="text-lg font-semibold mb-2">
Strong Frame Structure
</h3>

<p className="text-gray-200 text-sm leading-relaxed">
Durable metal chassis improves vehicle stability and protects internal
components.
</p>

</div>


{/* FOOTBOARD */}

<div className="bg-[#0c3a55] rounded-2xl p-5 shadow-lg hover:scale-105 transition">

<img
src="/features/Anti-Slip Footboard.png"
className="rounded-xl mb-6 w-full h-[200px] object-cover"
/>

<h3 className="text-lg font-semibold mb-2">
Anti-Slip Footboard
</h3>

<p className="text-gray-200 text-sm leading-relaxed">
Prevents rider's feet from slipping, especially in wet riding
conditions.
</p>

</div>


{/* HORN */}

<div className="bg-[#0c3a55] rounded-2xl p-5 shadow-lg hover:scale-105 transition">

<img
src="/features/Horn Bell Alert System.png"
className="rounded-xl mb-6 w-full h-[200px] object-cover"
/>

<h3 className="text-lg font-semibold mb-2">
Horn / Bell Alert System
</h3>

<p className="text-gray-200 text-sm leading-relaxed">
Allows riders to alert pedestrians and nearby vehicles to avoid
collisions.
</p>

</div>


{/* IOT SECURITY */}

<div className="bg-[#0c3a55] rounded-2xl p-5 shadow-lg hover:scale-105 transition md:col-span-3">

<img
src="/features/iot.png"
className="rounded-xl mb-6 w-full h-[240px] object-cover"
/>

<h3 className="text-lg font-semibold mb-2">
Smart Security and Tracking (IoT)
</h3>

<p className="text-gray-200 text-sm mb-3">
Remote monitoring and security system that helps protect the vehicle.
</p>

<ul className="text-gray-200 text-sm space-y-1 list-disc list-inside">
<li>GPS tracking</li>
<li>Geo-fencing</li>
<li>Remote vehicle lock</li>
</ul>

</div>


</div>

</div>

</section>

</div>

);
}