import React from "react";
import Sidebar from "@components/navigation/Sidebar";
import ChatCard from "@components/Chatbot/ChatCard";

const Card = ({
  title,
  value,
  unit,
  icon,
  bg = "bg-indigo-100",
}: {
  title: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  bg?: string;
}) => (
  <div className={`rounded-2xl shadow-md p-5 ${bg} flex items-center gap-4`}>
    <div className="text-indigo-600">{icon}</div>
    <div>
      <h4 className="text-sm text-slate-600">{title}</h4>
      <p className="text-lg font-semibold">
        {value} <span className="text-xs text-slate-500">{unit}</span>
      </p>
    </div>
  </div>
);

const ChatbotContent = () => (
  <div className="flex-1 flex flex-col bg-slate-50 p-8 overflow-hidden">
    <h1 className="text-3xl font-bold mb-6 text-slate-800">Chatbot</h1>
    <div className="flex-1 overflow-hidden">
      <ChatCard />
    </div>
  </div>
);


const ChatPage = () => (
  <div className="flex h-screen font-sans overflow-hidden">
    <Sidebar />
    <ChatbotContent />
  </div>
);


export default ChatPage;
