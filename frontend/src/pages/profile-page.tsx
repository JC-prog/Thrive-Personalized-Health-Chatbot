import React, { useEffect, useState } from "react";
import Sidebar from "@components/navigation/Sidebar";
import { User } from 'lucide-react';
import { UserProfileData } from "src/types/user";
import { getProfile } from "../api/profile-api";

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

  return (
    <div className="flex-1 bg-slate-50 p-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Profile</h1>

      <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col gap-y-8">
        {/* Profile Picture & Basic Info (combine into a horizontal flex) */}
        <div className="flex flex-col md:flex-row gap-8">
            <div className="w-32 h-32 flex items-center justify-center rounded-full border-4 border-indigo-100 bg-indigo-50">
                <User className="w-16 h-16 text-indigo-600" />
            </div>

            <div className="flex-1">
                <h2 className="text-2xl font-semibold text-slate-800 mb-2">{userProfile?.name}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm text-slate-600">Username</h4>
                      <p className="text-base font-medium text-slate-800">{userProfile?.username}</p>
                    </div>
                    <div>
                      <h4 className="text-sm text-slate-600">Email</h4>
                      <p className="text-base font-medium text-slate-800">{userProfile?.email}</p>
                    </div>
                    <div>
                      <h4 className="text-sm text-slate-600">Phone</h4>
                      <p className="text-base font-medium text-slate-800">{userProfile?.general_data?.phone_number ?? "-"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm text-slate-600">Age</h4>
                      <p className="text-base font-medium text-slate-800">{userProfile?.general_data?.age ?? "-"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm text-slate-600">Gender</h4>
                      <p className="text-base font-medium text-slate-800">{userProfile?.general_data?.gender ?? "-"}</p>
                    </div>
                </div>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-semibold text-slate-800 mb-2">Lifestyle Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><h4 className="text-sm text-slate-600">Physical Activity</h4><p className="text-base font-medium text-slate-800">3x a week</p></div>
                    <div><h4 className="text-sm text-slate-600">Diet</h4><p className="text-base font-medium text-slate-800">Balanced</p></div>
                    <div><h4 className="text-sm text-slate-600">Alcohol Intake</h4><p className="text-base font-medium text-slate-800">3x a week</p></div>
                    <div><h4 className="text-sm text-slate-600">Smoking Status</h4><p className="text-base font-medium text-slate-800">Yes</p></div>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-semibold text-slate-800 mb-2">Clinical Measurement</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><h4 className="text-sm text-slate-600">Height</h4><p className="text-base font-medium text-slate-800">{userProfile?.clinical_measurement?.height ?? "-"}</p></div>
                    <div><h4 className="text-sm text-slate-600">Weight</h4><p className="text-base font-medium text-slate-800">{userProfile?.clinical_measurement?.weight ?? "-"}</p></div>
                    <div><h4 className="text-sm text-slate-600">Blood Pressure</h4><p className="text-base font-medium text-slate-800">{userProfile?.clinical_measurement?.systolic_bp ?? "-"}/{userProfile?.clinical_measurement?.diastolic_bp ?? "-"}</p></div>
                    <div><h4 className="text-sm text-slate-600">BMI</h4><p className="text-base font-medium text-slate-800">{userProfile?.clinical_measurement?.bmi ?? "-"}</p></div>
                    <div><h4 className="text-sm text-slate-600">Glucose</h4><p className="text-base font-medium text-slate-800">{userProfile?.clinical_measurement?.glucose_level ?? "-"}</p></div>
                    <div><h4 className="text-sm text-slate-600">Cholesterol</h4><p className="text-base font-medium text-slate-800">{userProfile?.clinical_measurement?.cholesterol_total ?? "-"}</p></div>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-semibold text-slate-800 mb-2">Medical History</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><h4 className="text-sm text-slate-600">Condition</h4><p className="text-base font-medium text-slate-800">None</p></div>
                <div><h4 className="text-sm text-slate-600">Allergies</h4><p className="text-base font-medium text-slate-800">Peanuts</p></div>
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
