import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

/* ======================
   TYPES
====================== */

interface BookingData {
  bike: string;
  location: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
}

/* ======================
   MAIN COMPONENT
====================== */

export default function TestRide() {
  const locationRouter = useLocation();
  const selectedBike = locationRouter.state?.bike || "";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<BookingData>({
    bike: selectedBike,
    location: "",
    date: "",
    time: "",
    name: "",
    phone: "",
    email: "",
  });

  const next = () => setStep((prev) => prev + 1);
  const back = () => setStep((prev) => prev - 1);

  const handleConfirm = async () => {
  try {
    setLoading(true);

    await axios.post("http://localhost:4000/api/test-rides", {
      bikeName: formData.bike,
      location: formData.location,
      date: formData.date,
      timeSlot: formData.time,
      fullName: formData.name,
      phone: formData.phone,
      email: formData.email,
    });

    setStep(5); // go to success only if booking succeeds

  } catch (error: any) {
    console.log("Full error:", error);

    if (error.response?.data?.message) {
      alert(error.response.data.message);
    } else {
      alert("Booking failed. Please try again.");
    }

  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl">

        <Stepper step={step} />

        {step === 1 && (
          <StepSelectBike formData={formData} setFormData={setFormData} next={next} />
        )}

        {step === 2 && (
          <StepSelectLocation formData={formData} setFormData={setFormData} next={next} back={back} />
        )}

        {step === 3 && (
          <StepSelectDateTime formData={formData} setFormData={setFormData} next={next} back={back} />
        )}

        {step === 4 && (
          <StepDetails
            formData={formData}
            setFormData={setFormData}
            back={back}
            handleConfirm={handleConfirm}
            loading={loading}
          />
        )}

        {step === 5 && (
          <StepSuccess formData={formData} />
        )}

      </div>
    </div>
  );
}

/* ======================
   STEPPER
====================== */

function Stepper({ step }: { step: number }) {
  return (
    <div className="flex justify-center gap-4 mb-8">
      {[1, 2, 3, 4].map((num) => (
        <div
          key={num}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
            step >= num ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          {num}
        </div>
      ))}
    </div>
  );
}

/* ======================
   STEP 1 – BIKE
====================== */

function StepSelectBike({ formData, setFormData, next }: any) {
  const bikes = [
    { name: "Flee C2", image: "/bikes/flee-c2/default.png" },
    { name: "Flee B1", image: "/bikes/flee-b1/default.png" },
    { name: "Flee B2", image: "/bikes/flee-b2/default.png" },
    { name: "Flee B3", image: "/bikes/flee-b3/default.png" },
  ];

  return (
    <div>
      <h2 className="text-xl mb-6 text-center">Select Your Ride</h2>

      <div className="grid grid-cols-2 gap-6">
        {bikes.map((bike) => (
          <div
            key={bike.name}
            onClick={() => setFormData({ ...formData, bike: bike.name })}
            className={`cursor-pointer bg-gray-900 rounded-xl p-4 border ${
              formData.bike === bike.name
                ? "border-blue-500"
                : "border-gray-800"
            }`}
          >
            <img src={bike.image} className="w-full h-40 object-contain mb-4" />
            <h3>{bike.name}</h3>
          </div>
        ))}
      </div>

      <button
        disabled={!formData.bike}
        onClick={next}
        className="mt-8 w-full py-3 bg-blue-600 rounded-lg"
      >
        Continue
      </button>
    </div>
  );
}

/* ======================
   STEP 2 – LOCATION
====================== */

function StepSelectLocation({ formData, setFormData, next, back }: any) {
  const locations = ["Ashok Nagar", "Brigade Road", "Richmond Park", "MG Road"];

  return (
    <div>
      <h2 className="text-xl mb-6 text-center">Choose Location</h2>

      {locations.map((loc) => (
        <button
          key={loc}
          onClick={() => setFormData({ ...formData, location: loc })}
          className={`w-full p-4 mb-4 rounded-lg ${
            formData.location === loc ? "bg-blue-600" : "bg-gray-800"
          }`}
        >
          {loc}
        </button>
      ))}

      <div className="flex justify-between">
        <button onClick={back}>Back</button>
        <button onClick={next}>Continue</button>
      </div>
    </div>
  );
}

/* ======================
   STEP 3 – DATE & TIME
====================== */

function StepSelectDateTime({ formData, setFormData, next, back }: any) {
  return (
    <div>
      <h2 className="text-xl mb-6 text-center">Select Date & Time</h2>

      <input
        type="date"
        className="w-full p-3 bg-gray-800 rounded-lg mb-4"
        onChange={(e) =>
          setFormData({ ...formData, date: e.target.value })
        }
      />

      <select
        className="w-full p-3 bg-gray-800 rounded-lg"
        onChange={(e) =>
          setFormData({ ...formData, time: e.target.value })
        }
      >
        <option value="">Select Time</option>
        <option>11:00 AM</option>
        <option>12:00 PM</option>
        <option>1:00 PM</option>
      </select>

      <div className="flex justify-between mt-6">
        <button onClick={back}>Back</button>
        <button onClick={next}>Continue</button>
      </div>
    </div>
  );
}

/* ======================
   STEP 4 – VALIDATED DETAILS
====================== */

function StepDetails({
  formData,
  setFormData,
  back,
  handleConfirm,
  loading,
}: any) {
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    let newErrors: any = {};

    // NAME
    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = "Full name must be at least 3 characters";
    }

    // STRONG EMAIL VALIDATION
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address (example@gmail.com)";
    }

    // PHONE VALIDATION (react-phone-input format)
    if (!formData.phone || formData.phone.length < 12) {
      newErrors.phone = "Enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onConfirmClick = () => {
    if (validate()) {
      handleConfirm();
    }
  };

  return (
    <div>
      <h2 className="text-xl mb-6 text-center">
        Your Details
      </h2>

      {/* NAME */}
      <div className="mb-4">
        <input
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className={`w-full p-3 bg-gray-800 rounded-lg border ${
            errors.name ? "border-red-500" : "border-gray-700"
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">
            {errors.name}
          </p>
        )}
      </div>

      {/* PHONE */}
      <div className="mb-4">
        <PhoneInput
          country={"in"}
          value={formData.phone}
          onChange={(phone) =>
            setFormData({ ...formData, phone })
          }
          inputStyle={{
            width: "100%",
            backgroundColor: "#1f2937",
            border: errors.phone
              ? "1px solid #ef4444"
              : "1px solid #374151",
            color: "white",
            borderRadius: "8px",
          }}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">
            {errors.phone}
          </p>
        )}
      </div>

      {/* EMAIL */}
      <div className="mb-4">
        <input
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          className={`w-full p-3 bg-gray-800 rounded-lg border ${
            errors.email ? "border-red-500" : "border-gray-700"
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {errors.email}
          </p>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={back}>Back</button>

        <button
          onClick={onConfirmClick}
          disabled={loading}
          className={`px-6 py-2 rounded ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}


/* ======================
   SUCCESS
====================== */

function StepSuccess({ formData }: any) {
  return (
    <div className="text-center">
      <h2 className="text-2xl text-green-500 mb-4">
        You're All Set!
      </h2>

      <p>{formData.bike}</p>
      <p>{formData.location}</p>
      <p>{formData.date} at {formData.time}</p>
    </div>
  );
}
