import React, { useEffect, useState } from "react";
import { HeartPulse, Brain, Dumbbell } from "lucide-react";
import Sidebar from "@components/navigation/Sidebar";
import RiskHistoryChart from "@components/Charts/RiskHistoryChart";
import { UserProfileData } from "src/types/user";
import { getProfile, getRiskScores } from "../api/profile-api";
import { format, formatDistanceToNow } from "date-fns";
import { CalendarCheck2, Info, RefreshCcw } from "lucide-react";
import { Syringe } from "lucide-react";
import { Lightbulb, MessageCircle } from "lucide-react";

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
  diabetes_history: { date: string; risk_score: number }[];
  heart_history: { date: string; risk_score: number }[];
}


const DashboardContent = () => {
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [riskScores, setRiskScores] = useState<UserRiskScore | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const lastUpdated = userProfile?.assessment_done_at
  ? new Date(userProfile.assessment_done_at)
  : null;

  const formattedDate = lastUpdated ? format(lastUpdated, "PPP") : null;
  const timeAgo = lastUpdated ? formatDistanceToNow(lastUpdated, { addSuffix: true }) : null;

  // Scale the data by multiplying by 100
  const scaledDiabetesHistory = riskScores?.diabetes_history.map(item => ({
    ...item,
    risk_score: item.risk_score * 100,  // Multiply each risk score by 100
  }));

  const scaledHeartHistory = riskScores?.heart_history.map(item => ({
    ...item,
    risk_score: item.risk_score * 100,  // Multiply each risk score by 100
  }));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUserProfile(data);
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
        window.location.href = "/assessment";
      } finally {
        setLoading(false);
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
    if (!loading && userProfile?.assessment_done === 0) {
      window.location.href = "/assessment";
    }
  }, [userProfile, loading]);

  const mapHealthScore = (x: number): number => {
    const mappedScore = 5 - (4 * (x - 1)) / 29;
    return Math.min(5, Math.max(1, mappedScore));
  };

  return (
    <div className="flex-1 bg-gray-100 p-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Welcome back, {userProfile?.name}
      </h1>
  
      {/* Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {userProfile && (
          <>
            <Card
              title="General Health"
              value={userProfile.generalHealth}
              icon={<HeartPulse size={28} className="text-white" />}
              bg={getScoreColor(userProfile.generalHealth)}
            />
            <Card
              title="Mental Health"
              value={mapHealthScore(userProfile.mentalHealth)}
              icon={<Brain size={28} className="text-white" />}
              bg={getScoreColor(mapHealthScore(userProfile.mentalHealth))}
            />
            <Card
              title="Physical Health"
              value={mapHealthScore(userProfile.physicalHealth / 6)}
              icon={<Dumbbell size={28} className="text-white" />}
              bg={getScoreColor(mapHealthScore(userProfile.physicalHealth))}
            />
          </>
        )}
      </div>
  
      {/* Call to Action */}
      <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition mb-10 flex items-start gap-4">
        <div className="bg-indigo-100 p-3 rounded-full">
          <CalendarCheck2 className="text-indigo-600" size={28} />
        </div>
        <div className="flex-1">
          <p className="text-slate-700 text-lg mb-2">
            Last assessment completed on <span className="font-semibold">{formattedDate}</span> ({timeAgo}).
          </p>
          <p className="text-slate-600 mb-4 flex items-center gap-2">
            <Info size={18} className="text-slate-500" />
            Keeping your assessment up to date helps us provide the most accurate health insights for you.
          </p>
          <a href="/assessment">
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-full text-lg font-semibold flex items-center gap-2 hover:bg-indigo-700 transition cursor-pointer">
              <RefreshCcw size={20} />
              Update Assessment
            </button>
          </a>
        </div>
      </div>

      {/* Risk Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Heart Disease Risk */}
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition flex items-start gap-4">
          <div className="bg-red-100 p-3 rounded-full">
            <HeartPulse className="text-red-500" size={28} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Heart Disease Risk</h3>
            <p className="text-4xl font-bold text-red-500">
              {riskScores?.heart_risk != null
                ? `${(riskScores.heart_risk * 100).toFixed(2)}%`
                : "-"}
            </p>
          </div>
        </div>

        {/* Diabetes Risk */}
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition flex items-start gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Syringe className="text-blue-500" size={28} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Diabetes Risk</h3>
            <p className="text-4xl font-bold text-blue-500">
              {riskScores?.diabetes_risk != null
                ? `${(riskScores.diabetes_risk * 100).toFixed(2)}%`
                : "-"}
            </p>
          </div>
        </div>
      </div>

    {/* Insights Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition mb-10 flex flex-col gap-4">
        <div className="flex items-center gap-3 mb-2">
          <Lightbulb className="text-yellow-500" size={24} />
          <h3 className="text-lg font-semibold text-gray-700">Insights</h3>
        </div>
        
        {/* Heart Disease Insight */}
        {riskScores?.heart_risk != null && (
          <div className="text-gray-600">
            {riskScores.heart_risk >= 0.5 ? (
              <p>
                <span className="font-semibold text-red-500">High heart disease risk</span>. We recommend scheduling a cardiovascular health screening and adopting a heart-friendly diet and lifestyle.
              </p>
            ) : (
              <p>
                <span className="font-semibold text-green-600">Heart disease risk is within a healthy range</span>. Keep maintaining a balanced lifestyle!
              </p>
            )}
          </div>
        )}

        {/* Diabetes Insight */}
        {riskScores?.diabetes_risk != null && (
          <div className="text-gray-600">
            {riskScores.diabetes_risk >= 0.5 ? (
              <p>
                <span className="font-semibold text-blue-500">High diabetes risk</span>. Consider reducing sugar intake, staying active, and speaking with a healthcare professional.
              </p>
            ) : (
              <p>
                <span className="font-semibold text-green-600">Diabetes risk is within a healthy range</span>. Great job—keep it up!
              </p>
            )}
          </div>
        )}

        {/* Chatbot CTA with Message Icon */}
        <button
          onClick={() => window.location.href = "/chat"}
          className="mt-6 self-start flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition cursor-pointer"
        >
          <MessageCircle className="text-white" size={20} />
          <span className="text-lg font-semibold">Talk to our virtual health assistant! 💬</span>
        </button>
      </div>

  
    
      {/* Chart Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm overflow-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Risk History</h2>
        {riskScores ? (
          <div className="w-full h-full">
            <RiskHistoryChart
              diabetesHistory={scaledDiabetesHistory || []}
              heartHistory={scaledHeartHistory || []}
            />
          </div>
        ) : (
          <p className="text-gray-500">Loading risk history...</p>
        )}
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
