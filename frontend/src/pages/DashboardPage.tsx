import React from "react";
import { HeartPulse, Brain, Dumbbell } from "lucide-react";
import Sidebar from "@components/navigation/Sidebar";
import { useEffect, useState } from "react";
import { UserProfileData } from "src/types/user";
import { getProfile } from "../api/profile-api";

const Card = ({
  title,
  value,
  icon,
  bg,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  bg: string;
}) => (
  <div className={`rounded-2xl shadow-md p-5 ${bg} flex items-center gap-4`}>
    <div className="text-white bg-white/20 p-2 rounded-full">{icon}</div>
    <div>
      <h4 className="text-sm text-slate-600">{title}</h4>
      <p className="text-lg font-semibold text-white">
        {value.toFixed(2)} <span className="text-xs">/ 5</span>
      </p>
    </div>
  </div>
);

// Function to get background color based on score
const getScoreColor = (score: number) => {
  if (score >= 4) return "bg-green-400";    // Good
  if (score === 3) return "bg-yellow-400";  // Medium
  return "bg-red-400";                      // Poor
};

interface UserProfile {
  generalHealth: number;
  mentalHealth: number;
  physicalHealth: number;
}

interface UserRiskScore {
  heartRiskScore: number;
  diabetesRiskScore: number;
}

const mockUserProfile: UserProfile = {
  generalHealth: 4.2,
  mentalHealth: 2.8,
  physicalHealth: 3.0,
};

const mockRiskScore: UserRiskScore = {
  heartRiskScore: 50,
  diabetesRiskScore: 50
}

const DashboardContent = () => {
  //const user_profile = mockUserProfile; // Replace this with real user profile
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null); 
  const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const data = await getProfile();
          setUserProfile(data);
        } catch (err: any) {
          setError(err.message || "Failed to load profile");
        }
      };
  
      fetchProfile();
    }, []);

  return (
    <div className="flex-1 bg-slate-50 p-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Welcome back, John</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {userProfile && (
          <>
            <Card
              title="General Health Score"
              value={userProfile.generalHealth}
              icon={<HeartPulse size={28} />}
              bg={getScoreColor(userProfile.generalHealth)}
            />
            <Card
              title="Mental Health Score"
              value={userProfile.mentalHealth / 6}
              icon={<Brain size={28} />}
              bg={getScoreColor(userProfile.mentalHealth / 6)}
            />
            <Card
              title="Physical Health Score"
              value={userProfile.physicalHealth / 6}
              icon={<Dumbbell size={28} />}
              bg={getScoreColor(userProfile.physicalHealth / 6)}
            />
          </>
        )}
      </div>


     {/* Chart Placeholder */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">Prediction Results</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Heart Disease Prediction Card */}
          <div className="rounded-2xl p-6 bg-red-100 flex flex-col items-center justify-center shadow-md">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Heart Disease Risk</h3>
            <p className="text-3xl font-bold text-red-600">
              {mockRiskScore.heartRiskScore.toFixed(2)}%
            </p>
          </div>

          {/* Diabetes Prediction Card */}
          <div className="rounded-2xl p-6 bg-blue-100 flex flex-col items-center justify-center shadow-md">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Diabetes Risk</h3>
            <p className="text-3xl font-bold text-blue-600">
              {mockRiskScore.diabetesRiskScore.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <a href="/assessment">
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-full text-lg font-semibold hover:bg-indigo-700 transition">
              Take Assessment
            </button>
          </a>
        </div>
      </div>

    </div>
  );
};

const DashboardPage = () => (
  <div className="flex font-sans">
    <Sidebar />
    <DashboardContent />
  </div>
);

export default DashboardPage;
