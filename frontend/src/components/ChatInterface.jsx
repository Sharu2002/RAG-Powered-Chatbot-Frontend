import { useRef, useEffect, useState } from "react";
import axios from "axios";

const ChatInterface = ({ messages, setMessages }) => {
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // Backend URL
  const BACKEND_URL = "http://127.0.0.1:8000/chat?query=";

  // Auto-scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { id: Date.now(), sender: "User", text: input };

      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput("");

      try {
        const response = await axios.get(`${BACKEND_URL}${encodeURIComponent(input)}`);
        const botMessage = {
          id: Date.now() + 1,
          sender: "Bot",
          text: response.data.message,
        };

        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error("Error fetching response from server:", error);
        const errorMessage = {
          id: Date.now() + 1,
          sender: "Bot",
          text: "Error fetching response from server.",
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(90vh-64px)] bg-gray-100 p-4">
      {/* Chat Container */}
      <div className="flex-grow overflow-y-auto p-4 bg-white rounded-lg shadow-sm mb-4 space-y-2">
        {messages.length === 0 ? (
          <div className="text-gray-500 text-center">Session Cleared</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "User" ? "justify-end" : "justify-start"} w-full`}
            >
              <div
                className={`${
                  msg.sender === "User"
                    ? "bg-gray-800 text-white"
                    : "bg-gray-300 text-gray-800 mb-7"
                } px-4 py-2 rounded-xl break-words w-auto max-w-[90%]`}
              >
                {msg.text}
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Section */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          className="flex-grow p-2 border border-gray-300 rounded-lg"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
