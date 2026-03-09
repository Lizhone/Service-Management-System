export default function FleeB2Details(){

return(

<div className="bg-black text-white min-h-screen">

<section className="text-center py-32">

<h1 className="text-6xl font-bold">
Flee B2
</h1>

<p className="text-gray-400 mt-4">
Balanced Performance
</p>

<img
src="/bikes/flee-b2/default.png"
className="mx-auto mt-16 max-h-[420px]"
/>

</section>

<section className="text-center pb-32">

<h2 className="text-3xl font-semibold mb-12">
Performance Specs
</h2>

<div className="flex justify-center gap-24">

<div>
<p className="text-3xl font-bold">170 km</p>
<p className="text-gray-400">Range</p>
</div>

<div>
<p className="text-3xl font-bold">95 km/h</p>
<p className="text-gray-400">Top Speed</p>
</div>

<div>
<p className="text-3xl font-bold">3.1s</p>
<p className="text-gray-400">0-60</p>
</div>

</div>

</section>

</div>

)

}