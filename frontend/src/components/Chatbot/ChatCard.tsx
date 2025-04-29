import { useState, useRef, useEffect } from "react";
import { sendMessage } from "../../api/chat-api";

const ChatCard = () => {
  const [messages, setMessages] = useState<{ text: string; type: "user" | "bot" }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async (customInput?: string) => {
    const messageToSend = customInput ?? input;
    if (!messageToSend.trim() || loading) return;

    const userMessage = { text: messageToSend, type: "user" as const };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const data = await sendMessage(messageToSend);
      const botMessage = { text: data.response, type: "bot" as const };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error: any) {
      const errorMsg = {
        text: error.message || "Sorry, something went wrong. Please try again later.",
        type: "bot" as const,
      };
      setMessages((prevMessages) => [...prevMessages, errorMsg]);
    } finally {
      setLoading(false);
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

  const promptSuggestions = [
    "What is a healthy BMI?",
    "Suggest a meal plan for diabetes",
    "How to reduce heart disease risk?",
  ];

  return (
    <div className="w-full h-full flex flex-col bg-white shadow-lg rounded-xl p-6">
      {/* Chat History */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg shadow-inner">
        {messages.length === 0 ? (
          <p className="text-sm text-gray-500">Ask me something or try a prompt below.</p>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-xl text-sm leading-relaxed shadow-md ${
                  message.type === "user"
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Prompt Suggestions */}
      <div className="mt-4 space-y-2">
        <p className="text-sm font-semibold text-gray-600">Try a prompt:</p>
        <div className="flex flex-wrap gap-2">
          {promptSuggestions.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="bg-indigo-100 text-indigo-700 text-sm px-3 py-2 rounded-full hover:bg-indigo-200 transition duration-200"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Section */}
      <div className="mt-4 flex-shrink-0">
        <div className="flex items-center border border-gray-300 rounded-lg shadow-sm bg-white">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full p-3 rounded-l-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          />
          <button
            onClick={() => handleSend()}
            className={`px-4 py-3 text-white rounded-r-lg transition duration-200 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
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
