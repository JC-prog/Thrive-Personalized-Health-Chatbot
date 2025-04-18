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

const DashboardContent = () => (
  <div className="flex-1 bg-slate-50 p-8 min-h-screen">
    <h1 className="text-3xl font-bold mb-6 text-slate-800">Chat</h1>

    {/* Chart Placeholder */}
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Weekly Activity Summary</h2>
      <div className="w-full bg-slate-100 rounded-xl p-4">
        <ChatCard />
      </div>
    </div>
  </div>
);

const ChatPage = () => (
  <div className="flex font-sans">
    <Sidebar />
    <DashboardContent />
  </div>
);

export default ChatPage;
