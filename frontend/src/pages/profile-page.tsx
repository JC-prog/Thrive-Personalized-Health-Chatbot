import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import { UserProfileData } from "src/types/user";
import { getProfile } from "../api/profile-api";
import Sidebar from "@components/navigation/Sidebar";
// Maps
const incomeLevels = [
  "Less than $10,000",
  "$10,000 to less than $15,000",
  "$15,000 to less than $20,000",
  "$20,000 to less than $25,000",
  "$35,000 to less than $50,000",
  "$50,000 to less than $75,000",
  "$75,000 or more",
];

const educationLevels = [
  "Never attended school",
  "Primary School",
  "Secondary School",
  "Junior College",
  "Polytechnic",
  "Graduated from University",
];

const ProfileContent = () => {
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

  if (error) {
    return <div className="text-red-600 font-semibold">{error}</div>;
  }

  if (!userProfile) {
    return <div className="text-gray-600">Loading profile...</div>;
  }

  const bmi = (userProfile.weight / ((userProfile.height / 100) ** 2)).toFixed(2);

  return (
    <div className="flex-1 bg-slate-50 p-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Profile</h1>

      <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col gap-y-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-32 h-32 flex items-center justify-center rounded-full border-4 border-indigo-100 bg-indigo-50">
            <User className="w-16 h-16 text-indigo-600" />
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">{userProfile.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm text-slate-600">Username</h4>
                <p className="text-base font-medium text-slate-800">{userProfile.username}</p>
              </div>
              <div>
                <h4 className="text-sm text-slate-600">Email</h4>
                <p className="text-base font-medium text-slate-800">{userProfile.email ?? "-"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Info */}
        <div className="grid md:grid-cols-2 gap-6 text-slate-800">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-indigo-700">Personal</h3>
            <ul className="space-y-1">
              <li><strong>Age:</strong> {userProfile.age}</li>
              <li><strong>Gender:</strong> {userProfile.gender === 1 ? "Male" : "Female"}</li>
              <li><strong>Education:</strong> {educationLevels[userProfile.education - 1]}</li>
              <li><strong>Income:</strong> {incomeLevels[userProfile.income - 1]}</li>
              <li><strong>Healthcare Access:</strong> {userProfile.healthcare === 1 ? "Yes" : "No"}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-indigo-700">Lifestyle</h3>
            <ul className="space-y-1">
              <li><strong>Smoking:</strong> {userProfile.smoking === 1 ? "Yes" : "No"}</li>
              <li><strong>Alcohol:</strong> {userProfile.alcohol === 1 ? "Yes" : "No"}</li>
              <li><strong>Exercise:</strong> {userProfile.active_lifestyle === 1 ? "Yes" : "No"}</li>
              <li><strong>Vegetables:</strong> {userProfile.vegetables === 1 ? "Yes" : "No"}</li>
              <li><strong>Fruits:</strong> {userProfile.fruits === 1 ? "Yes" : "No"}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-indigo-700">Health Metrics</h3>
            <ul className="space-y-1">
              <li><strong>Height:</strong> {userProfile.height} cm</li>
              <li><strong>Weight:</strong> {userProfile.weight} kg</li>
              <li><strong>BMI:</strong> {bmi}</li>
              <li><strong>Systolic BP:</strong> {userProfile.systolic_bp} mmHg</li>
              <li><strong>Diastolic BP:</strong> {userProfile.diastolic_bp} mmHg</li>
              <li><strong>Glucose:</strong> {userProfile.glucose_level} mg/dL</li>
              <li><strong>Cholesterol:</strong> {userProfile.cholesterol_total} mg/dL</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-indigo-700">Medical History & Scores</h3>
            <ul className="space-y-1">
              <li><strong>Heart History:</strong> {userProfile.heart_history === 1 ? "Yes" : "No"}</li>
              <li><strong>Stroke:</strong> {userProfile.stroke === 1 ? "Yes" : "No"}</li>
              <li><strong>Disability:</strong> {userProfile.disability === 1 ? "Yes" : "No"}</li>
              <li><strong>General Health:</strong> {userProfile.generalHealth}</li>
              <li><strong>Mental Health Days:</strong> {userProfile.mentalHealth}</li>
              <li><strong>Physical Health Days:</strong> {userProfile.physicalHealth}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = () => (
  <div className="flex font-sans">
    <Sidebar />
    <ProfileContent />
  </div>
);

export default ProfilePage;
