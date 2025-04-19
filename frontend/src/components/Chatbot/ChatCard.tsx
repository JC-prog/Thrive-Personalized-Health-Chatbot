import { useState, useRef, useEffect } from "react";

const ChatCard = () => {
  const [messages, setMessages] = useState<{ text: string; type: 'user' | 'bot' }[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (input.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: input, type: 'user' },
        { text: "This is a bot response", type: 'bot' } // Mocked bot response
      ]);
      setInput(""); // Clear input field
    }
  };

  // Auto scroll to bottom when new message is added
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
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
      {/* Chat History */}
      <div className="space-y-4 max-h-[60vh] min-h-60 overflow-y-auto p-4 bg-gray-100 rounded-lg shadow-inner">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg text-white ${
                message.type === 'user' ? 'bg-indigo-600' : 'bg-gray-700'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="mt-4">
        <div className="flex items-center border border-gray-300 rounded-lg">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full p-3 bg-gray-100 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSend}
            className="px-4 py-3 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
