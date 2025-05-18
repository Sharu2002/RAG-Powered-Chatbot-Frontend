import { useRef, useEffect, useState } from "react";
import axios from "axios";

const ChatInterface = ({ messages, setMessages }) => {
  const [input, setInput] = useState("");
  const [ingestUrl, setIngestUrl] = useState("");
  const [ingestStatus, setIngestStatus] = useState("");  
  const [ingestedUrls, setIngestedUrls] = useState([]);
  const chatEndRef = useRef(null);

  // Backend URLs
  const BACKEND_URL = "http://127.0.0.1:8000/chat?query=";
  const INGEST_URL = "http://127.0.0.1:8000/ingest-url";
  const GET_INGESTED_URLS = "http://127.0.0.1:8000/ingest-urls";

  // Auto-scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    fetchIngestedUrls();
  }, []);

  const fetchIngestedUrls = async () => {
  try {
    const response = await axios.get(GET_INGESTED_URLS);
    setIngestedUrls(response.data);
  } catch (error) {
    console.error("Error fetching ingested URLs:", error);
  }
};

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

  const handleIngest = async () => {
    if (ingestUrl.trim()) {
      setIngestStatus("Ingesting...");
      
      try {
        const response = await axios.post(INGEST_URL, { url: ingestUrl });
        setIngestStatus("Ingestion Successful!");
        console.log("Ingestion complete for URL:", ingestUrl);
        setIngestUrl(""); // Clear the input field
        fetchIngestedUrls();
      } catch (error) {
        console.error("Error during ingestion:", error);
        
        if (error.response && error.response.status === 400) {
        setIngestStatus("URL already ingested.");
      }
        else if (error.response && error.response.status === 404) {
          setIngestStatus("Invalid/No content found for the provided URL.");
        }  else {
        setIngestStatus("Error during ingestion.");
      }
      }

      // Clear the status message after 3 seconds
      setTimeout(() => {
        setIngestStatus("");
      }, 3000);
    }
  };


  return (
<div className="flex h-[calc(90vh-64px)] bg-gray-100 p-4 space-x-4 overflow-hidden w-full max-w-[100vw] mx-auto">
      {/* Chat Container */}
      <div className="w-[75%] flex flex-col p-4 bg-white rounded-lg shadow-sm">
        <div className="flex-grow overflow-y-auto space-y-2">
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

        <div className="mt-4 flex items-center gap-2">
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
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>

      {/* Ingest URL Section */}
      <div className="w-[30%] bg-gray-200 p-4 rounded-lg">

        <h2 className="text-lg font-semibold mb-2">Ingest URL</h2>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-lg mb-2"
          placeholder="Enter URL to ingest..."
          value={ingestUrl}
          onChange={(e) => setIngestUrl(e.target.value)}
        />
        <button
          onClick={handleIngest}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Ingest
        </button>
        {/* Display Ingest Status */}
  {ingestStatus && (
    <div className="mt-2 text-center text-sm font-semibold bg-gray-200 text-blue-600">
      {ingestStatus}
    </div>
  )}
    {/* Display Ingested URLs */}
  <div className="mt-4">
    <h3 className="text-md font-semibold mb-2">Ingested URLs:</h3>
    <div className="h-120 overflow-y-auto bg-gray-200 rounded-lg">
      {ingestedUrls.length === 0 ? (
        <div className="text-gray-500">No URLs ingested yet.</div>
      ) : (
        ingestedUrls.map((url, index) => (
          <div key={index} className="text-sm mb-1 text-gray-700">
            {url}
          </div>
        ))
      )}
    </div>
  </div>
   {/* Display URL Count */}
    <div className="text-md font-semibold mb-2 py-5">
      Total URLs: <span className="text-md font-semibold mb-2">{ingestedUrls.length}</span>
    </div>
      </div>
    </div>
  );
};

export default ChatInterface;
