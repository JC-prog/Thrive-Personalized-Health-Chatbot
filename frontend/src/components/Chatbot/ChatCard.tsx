import { useState, useRef, useEffect } from "react";
import { sendMessage } from "../../api/chat-api";
import nlp from "compromise";
import { CircularProgress } from '@mui/material';

// Global variable to store questions
let allQuestions: { question: string; intent: string }[] = [];

// export const sendMessage = async (message: string) => {
//   const response = await fetch("../../api/chat-api", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ message }),
//   });

//   if (!response.ok) {
//     throw new Error("Failed to fetch response from the server.");
//   }

//   return response.json(); // Return JSON response
// };

const ChatCard = () => {
  const [messages, setMessages] = useState<{ text: string; type: "user" | "bot" }[]>([
    {
      text: "👋 Hello! How can I assist you today? You can ask about heart health, diabetes risk, exercise tips, or healthy habits! 😊",
      type: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [dynamicPrompts, setDynamicPrompts] = useState<string[]>([]); // Dynamic prompts
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // Reference to the input field

  // Ensure the input field is focused
  const ensureInputFocus = () => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0); // Delay to ensure focus happens after DOM updates
  };
  const loadQuestions = async () => {
    try {
      const response = await fetch("/assets/questions.json"); // Adjust the path if needed
      const data = await response.json();
      allQuestions = data.questions; // Assuming the JSON structure is { "questions": [...] }
    } catch (error) {
      console.error("Failed to load questions:", error);
    }
  };
    // Set initial pre-prompts when the component loads
    useEffect(() => {
      setDynamicPrompts([
        "What are the symptoms of heart disease?",
        "How can I reduce my diabetes risk?",
        "What are some healthy exercise tips?",
      ]);
    }, []);
  const handleSend = async () => {
    if (!input.trim() || loading) return; // Prevent empty messages or multiple submissions

    const userMessage = { text: input, type: "user" as const };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const data = await sendMessage(input); // Call the API
      const botResponse = formatBotResponse(data); // Format the JSON response
      const botMessage = { text: botResponse, type: "bot" as const };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error: any) {
      const errorMsg = {
        text: error.message || "Sorry, something went wrong. Please try again later.",
        type: "bot" as const,
      };
      setMessages((prevMessages) => [...prevMessages, errorMsg]);
    } finally {
      setLoading(false); // Reset loading state
      ensureInputFocus(); // Ensure input field is focused after sending
      updateDynamicPrompts(); // Update prompts based on the latest chat history
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus on the input field when the component mounts
  useEffect(() => {
    ensureInputFocus();
  }, []);

  // Focus on the input field whenever loading state changes
  useEffect(() => {
    if (!loading) {
      ensureInputFocus();
    }
  }, [loading]);
  useEffect(() => {
    loadQuestions();
  }, []);

  // Extract the most important noun and verb from the latest user message
  const extractKeywords = (text: string) => {
    const doc = nlp(text);
    const nouns = doc.nouns().out("array"); // Extract nouns
    const verbs = doc.verbs().out("array"); // Extract verbs

    const mostImportantNoun = nouns[0] || null;
    const mostImportantVerb = verbs[0] || null;

    return { noun: mostImportantNoun, verb: mostImportantVerb, nouns, verbs };
  };

  
  // Check if the extracted keywords are relevant to the intents
  const isRelevantIntent = (keyword: string | null) => {
    if (!keyword) return false;
    const intents = {
      health: ["heart", "disease", "health", "symptoms"],
      exercise: ["exercise", "workout", "fitness", "training"],
      nutrition: ["diet", "nutrition", "food", "eating"],
    };
    return Object.values(intents).some((keywords) => keywords.includes(keyword.toLowerCase()));
  };
  
  // Update dynamic prompts based on the latest chat history
  const updateDynamicPrompts = () => {
    const userMessages = messages.filter((message) => message.type === "user").map((message) => message.text);
    const lastUserMessage = userMessages[userMessages.length - 1];

    if (!lastUserMessage) {
      setDynamicPrompts([
        "What are the symptoms of heart disease?",
        "How can I reduce my diabetes risk?",
        "What are some healthy exercise tips?",
      ]);
      return;
    }

    const updateDynamicPrompts = () => {
      const userMessages = messages.filter((message) => message.type === "user").map((message) => message.text);
      const lastUserMessage = userMessages[userMessages.length - 1];
    
      if (!lastUserMessage || allQuestions.length === 0) {
        setDynamicPrompts([
          "What are the symptoms of heart disease?",
          "How can I reduce my diabetes risk?",
          "What are some healthy exercise tips?",
        ]);
        return;
      }
    
      const { noun, verb } = extractKeywords(lastUserMessage);
    
      // Define intent categories and associated keywords
      const intents = {
        health: ["heart", "disease", "health", "symptoms"],
        exercise: ["exercise", "workout", "fitness", "training"],
        nutrition: ["diet", "nutrition", "food", "eating"],
      };
    
      // Determine the intent of the last user message
      const determineIntent = (keyword: string | null) => {
        if (!keyword) return null;
        return Object.entries(intents).find(([_, keywords]) =>
          keywords.includes(keyword.toLowerCase())
        )?.[0];
      };
    
      const userIntent = determineIntent(noun) || determineIntent(verb);
    
      // Filter questions based on the detected intent
      const relatedQuestions = allQuestions.filter((q) => q.intent === userIntent);
    
      // // Select one related question and two random questions
      // const selectedQuestions = [];
      // if (relatedQuestions.length > 0) {
      //   selectedQuestions.push(relatedQuestions[0].question); // Add the first related question
      // }
      // const randomQuestions = allQuestions
      //   .filter((q) => !selectedQuestions.includes(q.question)) // Exclude already selected questions
      //   .sort(() => 0.5 - Math.random()) // Shuffle the array
      //   .slice(0, 2); // Select two random questions
    
      // // Combine the selected questions
      // const prompts = [...selectedQuestions, ...randomQuestions.map((q) => q.question)].slice(0, 3);
      const prompts = relatedQuestions.map((q) => q.question).slice(0, 3); // Select up to 3 related questions
      // Update the dynamic prompts
      setDynamicPrompts(prompts);
    };

    const { noun, verb, nouns, verbs } = extractKeywords(lastUserMessage);
    
    // Define intent categories and associated keywords
    const intents = {
      health: ["heart", "disease", "health", "symptoms"],
      exercise: ["exercise", "workout", "fitness", "training"],
      nutrition: ["diet", "nutrition", "food", "eating"],
    };

    

    // Check if the extracted keywords match any intent
    const isRelevantIntent = (keyword: string | null) => {
      if (!keyword) return false;
      return Object.values(intents).some((keywords) => keywords.includes(keyword.toLowerCase()));
    };

    // Validate relevance of extracted keywords
    const isNounRelevant = isRelevantIntent(noun);
    const isVerbRelevant = isRelevantIntent(verb);

    // Generate prompts based on extracted keywords
    const prompts = [];
    if (isNounRelevant && isVerbRelevant) {
      prompts.push(`How can I ${verb} ${noun}?`);
      prompts.push(`What are the benefits of ${verb}ing ${noun}?`);
      prompts.push(`Can you explain more about ${noun}?`);
    } else if (isNounRelevant) {
      prompts.push(`What are some tips related to ${noun}?`);
      prompts.push(`Can you provide more information about ${noun}?`);
      prompts.push(`Why is ${noun} important?`);
    } else if (isVerbRelevant) {
      prompts.push(`How can I ${verb} effectively?`);
      prompts.push(`What are the best ways to ${verb}?`);
      prompts.push(`Why should I ${verb}?`);
    } else {
      prompts.push(`Can you provide more details?`);
      prompts.push("What should I know about this?");
      prompts.push("How can I learn more?");
    }
    // Validate and correct grammar using compromise
    const correctedPrompts = prompts.map((prompt) => {
      const doc = nlp(prompt);
      return doc.text(); // Returns the corrected sentence
    });
    // Ensure only 3 prompts are displayed
    setDynamicPrompts(prompts.slice(0, 3));
  };

  const formatBotResponse = (data: any): string => {
    if (!data || typeof data !== "object") {
      return "Sorry, I couldn't process the response.";
    }
  
    // Check if the response contains the 'answer' key (expected format)
    if ("answer" in data) {
      let formattedResponse = `<p>${data.answer.replace(/\n/g, "<br/>")}</p>`; // Replace line breaks with <br/>
  
      // Check for additional data (optional)
      if (data.additional_data && typeof data.additional_data === "object") {
        formattedResponse += "<br/><strong>Additional Information:</strong><ul>";
        formattedResponse += Object.entries(data.additional_data)
          .map(([key, value]) => {
            if (Array.isArray(value)) {
              return `<li><strong>${key}:</strong> ${value.join(", ")}</li>`;
            }
            return `<li><strong>${key}:</strong> ${value}</li>`;
          })
          .join("");
        formattedResponse += "</ul>";
      }
  
      return formattedResponse;
    }
  
    // Fallback for unexpected formats
    return "Sorry, I couldn't process the response. Please try again.";
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle sample prompt click
  const handlePromptClick = async (prompt: string) => {
    if (loading) return; // Prevent sending if already loading

    const userMessage = { text: prompt, type: "user" as const };
    setMessages((prevMessages) => [...prevMessages, userMessage]); // Add the prompt to the chat history
    setLoading(true); // Set loading state

    try {
      const data = await sendMessage(prompt); // Call the API with the prompt
      const botResponse = formatBotResponse(data); // Format the JSON response
      const botMessage = { text: botResponse, type: "bot" as const };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error: any) {
      console.error(error);
      const errorMsg = {
        text: error.message || "Sorry, something went wrong. Please try again later.",
        type: "bot" as const,
      };
      setMessages((prevMessages) => [...prevMessages, errorMsg]); // Add error message to chat history
    } finally {
      setLoading(false); // Reset loading state
      ensureInputFocus(); // Ensure input field is focused after sending
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white shadow-lg rounded-xl p-6">
      {/* Chat History */}
      <div className="space-y-4 max-h-[80vh] min-h-60 overflow-y-auto p-4 bg-gray-100 rounded-lg shadow-inner">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`${
                message.type === "user" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"
              } max-w-[70%] p-3 rounded-lg shadow-md`}
            >
              {typeof message.text === "string" ? (
                <div dangerouslySetInnerHTML={{ __html: message.text }} />
              ) : (
                <pre className="whitespace-pre-wrap">{JSON.stringify(message.text, null, 2)}</pre>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Sample Prompts */}
      <div className="mt-4 space-y-2">
        <p className="text-sm text-gray-600">Try one of these prompts to get started:</p>
        <div className="flex flex-wrap gap-2">
          {dynamicPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handlePromptClick(prompt)}
              className={`px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition duration-200 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
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
            className="w-full p-3 bg-gray-100 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            disabled={loading}
            ref={inputRef}
          />
          <button
            onClick={handleSend}
            className={`px-4 py-3 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            } text-white rounded-r-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200`}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} className="text-white" /> : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
