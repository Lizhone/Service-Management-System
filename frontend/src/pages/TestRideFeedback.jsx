import { useState } from "react";
import axios from "axios";

export default function TestRideFeedback() {
  const [contact, setContact] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

 const handleSubmit = async () => {
  if (!contact || !feedback) {
    alert("Please enter contact and feedback");
    return;
  }

  try {
    setLoading(true);

    await axios.post(
      "http://localhost:4000/api/test-rides/feedback",
      {
        contact: contact,      // 🔥 MUST BE "contact"
        feedback: feedback,    // 🔥 MUST MATCH BACKEND
      }
    );

    alert("Feedback submitted successfully ✅");

    setContact("");
    setFeedback("");

  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Failed to submit feedback"
    );
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
      
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl">

        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Test Ride Feedback
        </h2>

        {/* Single Contact Field */}
        <input
          type="text"
          placeholder="Phone or Email"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-gray-100 text-black placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Feedback Box */}
        <textarea
          placeholder="Write your feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full p-3 h-28 rounded-lg bg-gray-100 text-black placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 transition-all duration-200 text-white font-semibold shadow-lg"
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>

      </div>
    </div>
  );
}