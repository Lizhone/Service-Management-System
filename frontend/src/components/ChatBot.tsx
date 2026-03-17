import { useState } from "react";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I can help you with bikes or test rides 🚀",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {
  if (!text.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Server error" },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* FLOAT BUTTON */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full z-[9999]"
        >
          💬
        </button>
      )}

      {/* CHAT BOX */}
      {open && (
        <div className="fixed bottom-6 right-6 w-80 bg-white rounded-xl shadow-2xl z-[9999]">

          {/* HEADER */}
          <div className="bg-black text-white p-4 flex justify-between">
            <span>FLEE Assistant</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* MESSAGES */}
          <div className="p-4 h-72 overflow-y-auto space-y-2 bg-gray-50">

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded max-w-[80%] text-sm ${
                  msg.sender === "bot"
                    ? "bg-gray-200"
                    : "bg-black text-white ml-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="bg-gray-200 p-2 rounded text-sm w-fit">
                Typing...
              </div>
            )}

            {/* QUICK BUTTONS */}
            <div className="flex flex-col gap-2 mt-3">
              <button
                onClick={() => sendMessage("I want to book a test ride")}
                className="bg-gray-800 text-white px-3 py-2 rounded-full text-sm"
              >
                Book Test Ride
              </button>

              <button
                onClick={() => sendMessage("Show bike details")}
                className="bg-gray-800 text-white px-3 py-2 rounded-full text-sm"
              >
                Bike Info
              </button>
            </div>

          </div>

          {/* INPUT */}
          <div className="border-t p-2 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border px-2 py-1 text-sm rounded"
              placeholder="Type message..."
            />

            <button
              onClick={() => sendMessage(input)}
              className="bg-black text-white px-3 rounded"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}