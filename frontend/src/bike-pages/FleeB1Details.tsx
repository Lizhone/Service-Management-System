export default function FleeB1Details(){

return(

<div className="min-h-screen bg-white text-gray-900">

<section className="text-center py-32">

<h1 className="text-5xl font-bold">
Flee B1
</h1>

<p className="mt-4 text-gray-500">
Smart Everyday Ride
</p>

<img
src="/bikes/flee-b1/default.png"
className="mx-auto mt-12 max-h-[400px]"
/>

</section>

<section className="text-center pb-24">

<div className="flex justify-center gap-20">

<div>
<p className="text-3xl font-bold">150 km</p>
<p className="text-gray-500">Range</p>
</div>

<div>
<p className="text-3xl font-bold">90 km/h</p>
<p className="text-gray-500">Top Speed</p>
</div>

<div>
<p className="text-3xl font-bold">3.5s</p>
<p className="text-gray-500">0-60</p>
</div>

</div>

</section>

</div>

)

}