export default function FleeC2Details(){

return(

<div className="bg-black text-white min-h-screen">

{/* HERO */}

<section className="min-h-screen flex items-center justify-center">

<div className="text-center">

<h1 className="text-6xl font-bold">
Flee C2
</h1>

<p className="text-gray-400 mt-4">
Premium Urban Mobility
</p>

<img
src="/bikes/flee-c2/default.png"
className="mx-auto mt-12 max-h-[420px]"
/>

</div>

</section>


{/* PERFORMANCE */}

<section className="py-32 text-center">

<h2 className="text-4xl font-bold">
Peak Performance
</h2>

<div className="flex justify-center gap-20 mt-12">

<div>
<p className="text-3xl font-bold">180 km</p>
<p className="text-gray-400">Range</p>
</div>

<div>
<p className="text-3xl font-bold">100 km/h</p>
<p className="text-gray-400">Top Speed</p>
</div>

<div>
<p className="text-3xl font-bold">2.9s</p>
<p className="text-gray-400">0–60</p>
</div>

</div>

</section>

</div>

)

}