import { useState, useRef, useEffect } from "react";
import { sendMessage } from "../../api/chat-api";

const ChatCard = () => {
  const [messages, setMessages] = useState<{ text: string; type: "user" | "bot" }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim() || loading) return; // Prevent empty messages or multiple submissions

    const userMessage = { text: input, type: "user" as const };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput(""); // Clear input field
    setLoading(true); // Set loading state

    try {
      const data = await sendMessage(input); // Call the API
      const botMessage = { text: data.response, type: "bot" as const };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error: any) {
      console.error(error);
      const errorMsg = {
        text: error.message || "Sorry, something went wrong. Please try again later.",
        type: "bot" as const,
      };
      setMessages((prevMessages) => [...prevMessages, errorMsg]);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
      <div className="w-full h-full flex flex-col bg-white shadow-lg rounded-lg p-6">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-100 rounded-lg shadow-inner">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-ws p-3 rounded-lg text-white ${
                  message.type === "user"
                    ? "bg-indigo-600 text-right"
                    : "bg-gray-700 text-left"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
    
        {/* Input Section */}
        <div className="mt-4 flex-shrink-0">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="w-full p-3 bg-gray-100 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              className={`px-4 py-3 ${
                loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
              } text-white rounded-r-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
  );
};

export default ChatCard;
