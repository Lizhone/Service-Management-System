import { useState, useEffect, useRef } from "react";
import { X, RotateCcw, MessageCircle } from "lucide-react";
import axios from "axios";
import logo from "../assets/logo.png";

type Message = {
  sender: "bot" | "user";
  text: string;
  time?: string;
  options?: { label: string; action: () => void }[];
};

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState("idle");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    bike: "",
    date: "",
    slot: "",
  });

  useEffect(() => {
    resetChat();
  }, []);

  useEffect(() => {
    if (!hasOpened) {
      const timer = setTimeout(() => {
        setOpen(true);
        setHasOpened(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [hasOpened]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (msg: Message) => {
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((prev) => [...prev, { ...msg, time }]);
  };

  const addOptionsMessage = (text: string, options: any[]) => {
    setMessages((prev) => [...prev, { sender: "bot", text, options }]);
  };

  const handleOptionClick = (label: string, action: () => void) => {
    addMessage({ sender: "user", text: label });
    action();
  };

  const resetChat = () => {
    setMessages([
      {
        sender: "bot",
        text: "Hi! I can help you with bikes or test rides 🚀",
        options: [
          { label: "🚗 Book Test Ride", action: startBooking },
          { label: "📘 Bike Info", action: handleBikeInfo },
        ],
      },
    ]);

    setStep("idle");

    setFormData({
      name: "",
      phone: "",
      email: "",
      location: "",
      bike: "",
      date: "",
      slot: "",
    });
  };

  const openBrochure = () => {
    window.open("/brochures/flee-brochure.pdf", "_blank");
  };

  const downloadBrochure = () => {
    const link = document.createElement("a");
    link.href = "/brochures/flee-brochure.pdf";
    link.download = "Flee-Brochure.pdf";
    link.click();
  };

  function handleBikeInfo() {
    addMessage({
      sender: "bot",
      text: `🚀 Flee High Speed • Range: 120 km • Top Speed: 75 km/h
⚡ Flee Low Speed • Range: 90 km • Top Speed: 60 km/h`,
    });

    addOptionsMessage("What would you like to do?", [
      { label: "📄 View Brochure", action: openBrochure },
      { label: "⬇️ Download Brochure", action: downloadBrochure },
      { label: "🚗 Book Test Ride", action: startBooking },
    ]);
  }

  function startBooking() {
    setStep("name");
    addMessage({ sender: "bot", text: "Great! What is your name?" });
  }

  const handleUserFlow = (message: string) => {
    if (step === "name") {
      setFormData((p) => ({ ...p, name: message }));
      setStep("phone");
      addMessage({ sender: "bot", text: "Enter your phone number" });
      return;
    }

    if (step === "phone") {
      if (!/^[6-9]\d{9}$/.test(message)) {
        addMessage({ sender: "bot", text: "❌ Enter valid phone number" });
        return;
      }

      setFormData((p) => ({ ...p, phone: message }));
      setStep("email");
      addMessage({ sender: "bot", text: "Enter your email (optional)" });
      return;
    }

    if (step === "email") {
      if (message && !/^\S+@\S+\.\S+$/.test(message)) {
        addMessage({ sender: "bot", text: "❌ Invalid email" });
        return;
      }

      setFormData((p) => ({ ...p, email: message }));
      setStep("location");
      addMessage({ sender: "bot", text: "Enter your location" });
      return;
    }

    if (step === "location") {
      setFormData((p) => ({ ...p, location: message }));
      setStep("bike");

      addOptionsMessage("Select a bike:", [
        { label: "Flee High Speed", action: () => selectBike("Flee High Speed") },
        { label: "Flee Low Speed", action: () => selectBike("Flee Low Speed") },
      ]);
      return;
    }

    if (step === "date") {
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(message)) {
        addMessage({ sender: "bot", text: "❌ Use format DD/MM/YYYY" });
        return;
      }

      const updated = { ...formData, date: message };

      setFormData(updated);
      setStep("slot");

      addOptionsMessage("Select a time slot:", [
        { label: "11:00 AM", action: () => selectSlot("11:00 AM", updated) },
        { label: "12:00 PM", action: () => selectSlot("12:00 PM", updated) },
        { label: "1:00 PM", action: () => selectSlot("1:00 PM", updated) },
      ]);
    }
  };

  const selectBike = (bike: string) => {
    setFormData((p) => ({ ...p, bike }));
    setStep("date");
    addMessage({ sender: "bot", text: "Enter preferred date (DD/MM/YYYY)" });
  };

  const selectSlot = (slot: string, currentData: any) => {
    const updated = { ...currentData, slot };

    setFormData(updated);
    setStep("confirm");

    addMessage({
      sender: "bot",
      text: `📋 Booking Summary:

👤 ${updated.name}
📞 ${updated.phone}
📧 ${updated.email || "N/A"}
📍 ${updated.location}
🏍 ${updated.bike}
📅 ${updated.date}
⏰ ${slot}`,
    });

    addOptionsMessage("Confirm booking?", [
      { label: "✅ Confirm", action: () => confirmBooking(updated) },
      { label: "✏️ Edit", action: startBooking },
    ]);
  };

  const confirmBooking = async (data: any) => {
    const formatDate = (date: string) => {
      const [dd, mm, yyyy] = date.split("/");
      return `${yyyy}-${mm}-${dd}`;
    };

    const formatPhone = (phone: string) => {
      const digits = phone.replace(/\D/g, "");
      return `+91 ${digits.slice(0, 5)}-${digits.slice(5)}`;
    };

    try {
      await axios.post("http://localhost:4000/api/test-rides", {
        fullName: data.name,
        phone: formatPhone(data.phone),
        email: data.email || "",
        location: data.location || "Bangalore",
        bikeName: data.bike,
        date: formatDate(data.date),
        timeSlot: data.slot,
      });

      addMessage({ sender: "bot", text: "✅ Booking confirmed!" });
      setStep("idle");
    } catch (err: any) {
      console.log(err.response?.data || err.message);
      addMessage({ sender: "bot", text: "❌ Booking failed" });
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    addMessage({ sender: "user", text: input });

    if (step !== "idle") {
      handleUserFlow(input);
    } else {
      const msg = input.toLowerCase();

      if (msg.includes("bike")) handleBikeInfo();
      else if (msg.includes("book")) startBooking();
      else {
        addOptionsMessage("Choose an option:", [
          { label: "🚗 Book Test Ride", action: startBooking },
          { label: "📘 Bike Info", action: handleBikeInfo },
        ]);
      }
    }

    setInput("");
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-lg"
      >
        <MessageCircle size={22} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[350px] h-[520px] bg-white shadow-xl rounded-xl flex flex-col">

      {/* HEADER */}
      <div className="bg-black text-white flex justify-between items-center px-4 py-3">
        <div className="flex items-center gap-2">
          <img src={logo} className="w-7 h-7 rounded-full bg-black p-1" />
          <span className="text-sm font-semibold">FLEE Assistant</span>
        </div>

        <div className="flex gap-3">
          <button onClick={resetChat}><RotateCcw size={18} /></button>
          <button onClick={() => setOpen(false)}><X size={18} /></button>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex items-start gap-2 ${m.sender === "user" ? "justify-end" : "justify-start"}`}>

            {m.sender === "bot" && (
              <img src={logo} className="w-7 h-7 rounded-full bg-black p-1 mt-1" />
            )}

            <div className="max-w-[75%]">
              <div className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-line ${
                m.sender === "bot" ? "bg-gray-200" : "bg-blue-500 text-white"
              }`}>
                {m.text}

                {m.time && (
                  <div className={`text-[10px] mt-2 ${
                    m.sender === "user" ? "text-white/70 text-right" : "text-gray-500 text-right"
                  }`}>
                    {m.time}
                  </div>
                )}
              </div>

              {m.options && (
                <div className="flex flex-col gap-2 mt-2">
                  {m.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(opt.label, opt.action)}
                      className="bg-black text-white px-3 py-2 rounded-lg text-sm"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* INPUT */}
      <div className="border-t flex">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-3 outline-none"
          placeholder="Type message..."
        />
        <button onClick={sendMessage} className="bg-black text-white px-4">
          ➤
        </button>
      </div>
    </div>
  );
}