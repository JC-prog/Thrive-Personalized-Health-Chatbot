import React from "react";
import { HeartPulse, Brain, Dumbbell } from "lucide-react";
import Sidebar from "@components/navigation/Sidebar";
import { useEffect, useState } from "react";
import { UserProfileData } from "src/types/user";
import { getProfile, getRiskScores } from "../api/profile-api";

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
  diabetes_risk: number;
  heart_risk: number;
}

const DashboardContent = () => {
  //const user_profile = mockUserProfile; // Replace this with real user profile
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null); 
  const [riskScores, setRiskScores] = useState<UserRiskScore | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); 
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUserProfile(data);
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);  // Set loading to false after the profile is fetched
      }
    };

    const fetchRiskData = async () => {
      try {
        const data = await getRiskScores();
        setRiskScores(data);
      } catch (err: any) {
        setError(err.message || "Failed to load risk scores");
      }
    };

    fetchProfile();
    fetchRiskData();
  }, []);
  
    useEffect(() => {
      if (!loading && (userProfile?.assessment_done === 0)) {
        window.location.href = "/assessment";  
      }
    }, [userProfile, loading]);
    

  const mapHealthScore = (x: number): number => {
    // Calculate the mapped score
    const mappedScore = 5 - (4 * (x - 1)) / 29;
  
    // Ensure the score is within the 1-5 range
    return Math.min(5, Math.max(1, mappedScore));
  };

  return (
    <div className="flex-1 bg-slate-50 p-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Welcome back, {userProfile?.name}</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {userProfile && (
          <>
            {/* General Health Score Card */}
            <Card
              title="General Health Score"
              value={userProfile.generalHealth}
              icon={<HeartPulse size={28} />}
              bg={getScoreColor(userProfile.generalHealth)}
            />

            {/* Mental Health Score Card */}
            <Card
              title="Mental Health Score"
              value={mapHealthScore(userProfile.mentalHealth)} 
              icon={<Brain size={28} />}
              bg={getScoreColor(mapHealthScore(userProfile.mentalHealth))}
            />

            {/* Physical Health Score Card */}
            <Card
              title="Physical Health Score"
              value={mapHealthScore(userProfile.physicalHealth / 6)} 
              icon={<Dumbbell size={28} />}
              bg={getScoreColor(mapHealthScore(userProfile.physicalHealth))}
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
              {riskScores?.heart_risk.toFixed(2) ?? "-"}%
            </p>
          </div>

          {/* Diabetes Prediction Card */}
          <div className="rounded-2xl p-6 bg-blue-100 flex flex-col items-center justify-center shadow-md">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Diabetes Risk</h3>
            <p className="text-3xl font-bold text-blue-600">
              {riskScores?.diabetes_risk.toFixed(2) ?? "-"}%
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
