import React, { useState } from "react";
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
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    logoutContext();
    setLocation("/auth");
  };

  return (
    <>
      <aside className="bg-indigo-700 text-white w-64 p-6 min-h-screen flex flex-col">
        <h2 className="text-2xl font-bold mb-10">
          <a href="/">Thrive</a>
        </h2>
        <nav className="space-y-4 text-sm font-medium">
          <a
            href="/"
            className="flex items-center gap-3 hover:text-indigo-200 transition"
          >
            <BarChart2 size={18} /> Dashboard
          </a>
          <a
            href="/profile"
            className="flex items-center gap-3 hover:text-indigo-200 transition"
          >
            <User size={18} /> Profile
          </a>
          <a
            href="/chat"
            className="flex items-center gap-3 hover:text-indigo-200 transition"
          >
            <MessageCircle size={18} /> Chat
          </a>
        </nav>
        <div className="mt-auto">
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 text-sm text-white hover:text-red-300 transition cursor-pointer pt-4 border-t border-indigo-500 mt-4"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      </aside>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl w-80 text-gray-800">
            <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
            <p className="mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
