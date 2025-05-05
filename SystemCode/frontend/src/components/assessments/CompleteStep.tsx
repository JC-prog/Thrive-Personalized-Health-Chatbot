import React, { useState } from 'react';
import { UserProfileUpdateData } from 'src/types/user';
import { useLocation } from 'wouter';
import { updateProfile } from '../../api/profile-api';
import { motion } from "framer-motion";
import AuthToast from '@components/Toast/AuthToast';

type Props = {
  next: () => void;
  prev: () => void;
  data: UserProfileUpdateData;
  update: (newData: Partial<UserProfileUpdateData>) => void;
};

// Array of income levels
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
  "Graduated from University"
]

const CompleteStep = ({ next, prev, data, update }: Props) => {
  const [, navigate] = useLocation();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const [toastMessage, setToastMessage] = useState('');
  
  const handleComplete = async () => {
    try {
      const updatedData = await updateProfile(data);
      console.log("Profile updated successfully:", updatedData);
  
      // Show success toast
      setToastType("success");
      setToastMessage("Profile updated successfully!");
      setToastVisible(true);
  
      // Delay before navigating
      setTimeout(() => {
        setToastVisible(false);
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setToastType("error");
      setToastMessage("Failed to update profile.");
      setToastVisible(true);
  
      // Auto-hide error toast after a while
      setTimeout(() => {
        setToastVisible(false);
      }, 3000);
    }
  };
    

  return (
    <motion.div
      className="text-center max-w-3xl mx-auto px-6 py-10 bg-gradient-to-r from-blue-50 via-indigo-50 to-indigo-100 rounded-xl shadow-xl"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <AuthToast
        message={toastMessage}
        type={toastType}
        isVisible={toastVisible}
      />

      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-8 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
        Summary
      </h2>

      {/* Step Indicator */}
      <div className="flex justify-between items-center mb-6">
        {["Personal Info", "Lifestyle", "History", "Metrics", "Scores", "Summary"].map((step, idx) => (
          <div key={idx} className="flex-1 text-center">
            <div className={`h-1 rounded-full ${idx === 5 ? 'bg-indigo-600' : 'bg-gray-300'}`} />
            <p className={`mt-1 text-sm ${idx === 5 ? 'text-indigo-600 font-semibold' : 'text-gray-400'}`}>{step}</p>
          </div>
        ))}
      </div>

      {/* Personal Information */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border-t-4 border-indigo-600 text-left">
        <h3 className="font-semibold text-indigo-700 mb-4 text-xl">Personal Information</h3>
        <ul className="space-y-3">
          <li><strong className="text-indigo-600">Age:</strong> {data.age}</li>
          <li><strong className="text-indigo-600">Gender:</strong> {data.gender === 1 ? "Male" : "Female"}</li>
          <li><strong className="text-indigo-600">Education Level:</strong> {educationLevels[data.education - 1]}</li>
          <li><strong className="text-indigo-600">Healthcare Access:</strong> {data.healthcare === 1 ? "Yes" : "No"}</li>
          <li><strong className="text-indigo-600">Income Level:</strong> {incomeLevels[data.income - 1]}</li>
        </ul>
      </div>

      {/* Lifestyle Factors */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border-t-4 border-indigo-600 text-left">
        <h3 className="font-semibold text-indigo-700 mb-4 text-xl">Lifestyle Factors</h3>
        <ul className="space-y-3">
          <li><strong className="text-indigo-600">Smoking:</strong> {data.smoking === 1 ? "Yes" : "No"}</li>
          <li><strong className="text-indigo-600">Alcohol Consumption:</strong> {data.alcohol === 1 ? "Yes" : "No"}</li>
          <li><strong className="text-indigo-600">Exercise:</strong> {data.active_lifestyle === 1 ? "Yes" : "No"}</li>
          <li><strong className="text-indigo-600">Vegetable Intake:</strong> {data.vegetables === 1 ? "Yes" : "No"}</li>
          <li><strong className="text-indigo-600">Fruit Intake:</strong> {data.fruits === 1 ? "Yes" : "No"}</li>
        </ul>
      </div>

      {/* Health Metrics */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border-t-4 border-indigo-600 text-left">
        <h3 className="font-semibold text-indigo-700 mb-4 text-xl">Health Metrics</h3>
        <ul className="space-y-3">
          <li><strong className="text-indigo-600">Height:</strong> {data.height} cm</li>
          <li><strong className="text-indigo-600">Weight:</strong> {data.weight} kg</li>
          <li><strong className="text-indigo-600">BMI:</strong> {(data.weight / ((data.height / 100) ** 2)).toFixed(2)}</li>
          <li><strong className="text-indigo-600">Systolic BP:</strong> {data.systolic_bp} mmHg</li>
          <li><strong className="text-indigo-600">Diastolic BP:</strong> {data.diastolic_bp} mmHg</li>
          <li><strong className="text-indigo-600">Glucose Level:</strong> {data.glucose_level} mg/dL</li>
          <li><strong className="text-indigo-600">Total Cholesterol:</strong> {data.cholesterol_total} mg/dL</li>
        </ul>
      </div>

      {/* Medical History */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border-t-4 border-indigo-600 text-left">
        <h3 className="font-semibold text-indigo-700 mb-4 text-xl">Medical History</h3>
        <ul className="space-y-3">
          <li><strong className="text-indigo-600">Heart History:</strong> {data.heart_history === 1 ? "Yes" : "No"}</li>
          <li><strong className="text-indigo-600">Stroke History:</strong> {data.stroke === 1 ? "Yes" : "No"}</li>
          <li><strong className="text-indigo-600">Disability History:</strong> {data.disability === 1 ? "Yes" : "No"}</li>
        </ul>
      </div>

      {/* Health Score */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border-t-4 border-indigo-600 text-left">
        <h3 className="font-semibold text-indigo-700 mb-4 text-xl">Health Score</h3>
        <ul className="space-y-3">
          <li><strong className="text-indigo-600">General Health:</strong> {data.generalHealth}</li>
          <li><strong className="text-indigo-600">Mental Health:</strong> {data.mentalHealth} Day</li>
          <li><strong className="text-indigo-600">Physical Health:</strong> {data.physicalHealth} Day</li>
        </ul>
      </div>

      <div className="flex justify-between space-x-4 pt-8">
        <button
          className="px-6 py-3 bg-gray-300 text-gray-800 font-medium rounded-xl hover:bg-gray-400 transition-all w-1/3"
          onClick={prev}
        >
          Back
        </button>

        <button
          className="px-8 py-4 bg-indigo-600 text-white font-medium rounded-xl shadow-md hover:bg-indigo-700 transition-all w-1/3"
          onClick={handleComplete}
        >
          Complete
        </button>
      </div>
    </motion.div>
  );
};

export default CompleteStep;
