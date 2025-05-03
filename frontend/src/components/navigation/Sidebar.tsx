import React from "react";
import {
  BarChart2,
  LogOut,
  User,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "../../hooks/auth-context";
import { useLocation } from "wouter";

const Sidebar = () => {
  const { logoutContext } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logoutContext();        // Clear token
    setLocation("/auth");   // Redirect to login
  };

  return (
    <aside className="bg-indigo-700 text-white w-64 p-6 min-h-screen flex flex-col">
      <h2 className="text-2xl font-bold mb-10"><a href="/">Thrive</a></h2>
      <nav className="space-y-4 text-sm font-medium">
        <a href="/" className="flex items-center gap-3 hover:text-indigo-200 transition">
          <BarChart2 size={18} /> Dashboard
        </a>
        <a href="/profile" className="flex items-center gap-3 hover:text-indigo-200 transition">
          <User size={18} /> Profile
        </a>
        <a href="/chat" className="flex items-center gap-3 hover:text-indigo-200 transition">
          <MessageCircle size={18} /> Chat
        </a>
      </nav>
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm hover:text-red-300 transition cursor-pointer"
        >
          <LogOut size={16} /> Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
