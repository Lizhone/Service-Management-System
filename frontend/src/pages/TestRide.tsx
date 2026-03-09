import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import DatePicker from "react-datepicker";

import "react-phone-input-2/lib/style.css";
import "react-datepicker/dist/react-datepicker.css";

interface BookingData {
  bike: string;
  location: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
}

export default function TestRide() {

const routerLocation = useLocation();
const navigate = useNavigate();
const selectedBike = routerLocation.state?.bike || "";

/* Scroll to top when page opens */

useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, []);

const [loading,setLoading] = useState(false);
const [errors,setErrors] = useState<any>({});

const [selectedDate,setSelectedDate] = useState<Date | null>(null);

const [formData,setFormData] = useState<BookingData>({
  bike: selectedBike,
  location: "",
  date: "",
  time: "",
  name: "",
  phone: "",
  email: "",
  address: "",
});


/* ================= VALIDATION ================= */

const validate = () => {

let newErrors:any = {};

if(!formData.bike) newErrors.bike = true;
if(!formData.location) newErrors.location = true;
if(!formData.date) newErrors.date = true;
if(!formData.time) newErrors.time = true;
if(!formData.name || formData.name.length < 3) newErrors.name = true;
if(!formData.email) newErrors.email = true;
if(!formData.phone) newErrors.phone = true;

setErrors(newErrors);

return Object.keys(newErrors).length === 0;

};


/* ================= BOOK TEST RIDE ================= */

const handleConfirm = async () => {

if(!validate()) return;

try{

setLoading(true);

await axios.post("http://localhost:4000/api/test-rides",{

bikeName: formData.bike,
location: formData.location,
date: formData.date,
timeSlot: formData.time,
fullName: formData.name,
phone: formData.phone,
email: formData.email,
address: formData.address,

});

alert("Test Ride Booked Successfully ✅");

setFormData({
bike:"",
location:"",
date:"",
time:"",
name:"",
phone:"",
email:"",
address:"",
});

setSelectedDate(null);

}
catch(error:any){

alert(
error.response?.data?.message ||
"Booking failed. Please try again."
);

}
finally{
setLoading(false);
}

};


/* ================= DATA ================= */

const bikes = [
{ name:"Flee C2", image:"/bikes/flee-c2/default.png" },
{ name:"Flee B1", image:"/bikes/flee-b1/default.png" },
{ name:"Flee B2", image:"/bikes/flee-b2/default.png" },
{ name:"Flee B3", image:"/bikes/flee-b3/default.png" },
];

const locations = ["Bangalore","Goa"];


/* ================= UI ================= */

return(

<div className="min-h-screen bg-black text-white flex justify-center p-6">

<div className="w-full max-w-4xl">


{/* ================= BIKE SELECT ================= */}

<h2 className="text-xl mb-6 text-center">
Select Your Ride
</h2>

<div className="grid grid-cols-2 gap-6 mb-10">

{bikes.map((bike)=>(
<div
key={bike.name}
onClick={()=>setFormData({...formData,bike:bike.name})}
className={`cursor-pointer bg-gray-900 rounded-xl p-4 border ${
formData.bike === bike.name
? "border-blue-500"
: "border-gray-800"
}`}
>

<img
src={bike.image}
className="w-full h-40 object-contain mb-4"
/>

<h3>{bike.name}</h3>

</div>
))}

</div>


{/* ================= LOCATION ================= */}

<h2 className="text-xl mb-4 text-center">
Choose Location
</h2>

<div className="grid grid-cols-2 gap-4 mb-10">

{locations.map((loc)=>(
<button
key={loc}
onClick={()=>setFormData({...formData,location:loc})}
className={`p-4 rounded-lg transition ${
formData.location === loc
? "bg-blue-600"
: "bg-gray-800 hover:bg-gray-700"
}`}
>
{loc}
</button>
))}

</div>


{/* ================= DATE & TIME ================= */}

<h2 className="text-xl mb-4 text-center">
Select Date & Time
</h2>

<div className="w-full mb-4">

<DatePicker
selected={selectedDate}
onChange={(date: Date | null)=>{

setSelectedDate(date);

if(date){
const isoDate = date.toISOString().split("T")[0];
setFormData({...formData,date:isoDate});
}

}}
dateFormat="dd/MM/yyyy"
minDate={new Date()}
placeholderText="Select Date"
className="w-full p-3 bg-gray-200 text-black rounded-lg"
/>

</div>

<select
value={formData.time}
onChange={(e)=>setFormData({...formData,time:e.target.value})}
className="w-full p-3 mb-10 bg-gray-200 text-black rounded-lg"
>

<option value="">Select Time</option>

<option>11:00 AM</option>
<option>12:00 PM</option>
<option>1:00 PM</option>

</select>


{/* ================= CUSTOMER DETAILS ================= */}

<h2 className="text-xl mb-4 text-center">
Your Details
</h2>


<input
placeholder="Full Name"
value={formData.name}
onChange={(e)=>setFormData({...formData,name:e.target.value})}
className="w-full p-3 mb-4 bg-gray-200 text-black rounded-lg"
/>


<div className="mb-4">

<PhoneInput
country={"in"}
value={formData.phone}
onChange={(phone)=>setFormData({...formData,phone})}
inputStyle={{
width:"100%",
backgroundColor:"#111827",
borderRadius:"8px",
color:"white"
}}
/>

</div>


<input
type="email"
placeholder="Email Address"
value={formData.email}
onChange={(e)=>setFormData({...formData,email:e.target.value})}
className="w-full p-3 mb-4 bg-gray-200 text-black rounded-lg"
/>


<textarea
placeholder="Address"
value={formData.address}
onChange={(e)=>setFormData({...formData,address:e.target.value})}
className="w-full p-3 mb-6 bg-gray-200 text-black rounded-lg"
/>


{/* ================= LOCATION ROUTE ================= */}

<button
type="button"
onClick={()=>navigate("/location-route",{
state:{ location:formData.location }
})}
className="w-full py-3 mb-6 bg-blue-600 hover:bg-blue-700 rounded-lg"
>
Locate Me
</button>


{/* ================= CONFIRM BOOKING ================= */}

<button
onClick={handleConfirm}
disabled={loading}
className="w-full py-4 rounded-xl text-lg font-semibold bg-green-600 hover:bg-green-700"
>

{loading ? "Booking..." : "Confirm Booking"}

</button>


</div>

</div>

);

}