import React from 'react';
import { UserProfileUpdateData } from 'src/types/user';
import { useLocation } from 'wouter';
import { updateProfile } from '../../api/profile-api';

type Props = {
  next: () => void;
  prev: () => void;
  data: UserProfileUpdateData;
  update: (newData: Partial<UserProfileUpdateData>) => void;
};

const CompleteStep = ({ next, prev, data, update }: Props) => {
  const [, navigate] = useLocation();

  const handleComplete = async () => {
    try {
      // Attempt to update the profile
      const updatedData = await updateProfile(data);

      // Handle successful profile update
      console.log("Profile updated successfully:", updatedData);

      // Navigate to the home page (or another desired route)
      navigate('/');
    } catch (error) {
      // Catch any errors and log them
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="text-center w-full mx-auto px-4 py-6">

      <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
        Summary
      </h2>

      {/* Personal Information */}
      <div className="bg-indigo-50 p-6 rounded-xl shadow-sm mb-10 border border-indigo-100 text-left">
        <h3 className="font-semibold text-indigo-800 mb-4 text-xl">Personal Information:</h3>
        <ul className="space-y-2">
          <li><strong>Age:</strong> {data.age}</li>
          <li><strong>Gender:</strong> {data.gender}</li>
          <li><strong>Education Level:</strong> {data.education}</li>
          <li><strong>Healthcare Access:</strong> {data.healthcare}</li>
          <li><strong>Income Level:</strong> {data.income}</li>
        </ul>
      </div>
      
      {/* Lifestyle Factors */}
      <div className="bg-indigo-50 p-6 rounded-xl shadow-sm mb-10 border border-indigo-100 text-left">
        <h3 className="font-semibold text-indigo-800 mb-4 text-xl">Lifestyle Factors:</h3>
        <ul className="space-y-2">
          <li><strong>Smoking:</strong> {data.smoking}</li>
          <li><strong>Alcohol Consumption:</strong> {data.alcohol}</li>
          <li><strong>Exercise:</strong> {data.active_lifestyle}</li>
          <li><strong>Vegetable Intake:</strong> {data.vegetables}</li>
          <li><strong>Fruit Intake:</strong> {data.fruits}</li>
        </ul>
      </div>

      {/* Health Metrics */}
      <div className="bg-indigo-50 p-6 rounded-xl shadow-sm mb-10 border border-indigo-100 text-left">
        <h3 className="font-semibold text-indigo-800 mb-4 text-xl">Health Metrics:</h3>
        <ul className="space-y-2">
          <li><strong>Height:</strong> {data.height} cm</li>
          <li><strong>Weight:</strong> {data.weight} kg</li>
          <li><strong>BMI:</strong> {(data.weight / ((data.height / 100) ** 2)).toFixed(2)}</li>
          <li><strong>Systolic BP:</strong> {data.systolic_bp} mmHg</li>
          <li><strong>Diastolic BP:</strong> {data.diastolic_bp} mmHg</li>
          <li><strong>Glucose Level:</strong> {data.glucose_level} mg/dL</li>
          <li><strong>Total Cholesterol:</strong> {data.cholesterol_total} mg/dL</li>
        </ul>
      </div>

      {/* Medical History */}
      <div className="bg-indigo-50 p-6 rounded-xl shadow-sm mb-10 border border-indigo-100 text-left">
        <h3 className="font-semibold text-indigo-800 mb-4 text-xl">Medical History:</h3>
        <ul className="space-y-2">
          <li><strong>Heart History:</strong> {data.heart_history}</li>
          <li><strong>Stroke History:</strong> {data.stroke}</li>
          <li><strong>Disability History:</strong> {data.disability}</li>
        </ul>
      </div>

      {/* Health Score */}
      <div className="bg-indigo-50 p-6 rounded-xl shadow-sm mb-10 border border-indigo-100 text-left">
        <h3 className="font-semibold text-indigo-800 mb-4 text-xl">Medical History:</h3>
        <ul className="space-y-2">
          <li><strong>General Health:</strong> {data.generalHealth}</li>
          <li><strong>Stroke History:</strong> {data.mentalHealth}</li>
          <li><strong>Disability History:</strong> {data.physicalHealth}</li>
        </ul>
      </div>

      <div className="flex justify-between">
        <button
          className="px-6 py-3 bg-gray-300 text-gray-800 font-medium rounded-xl hover:bg-gray-400 transition-all"
          onClick={prev}
        >
          Back
        </button>

        <button
          className="px-8 py-4 bg-indigo-600 text-white font-medium rounded-xl shadow-md hover:bg-indigo-700 transition-all"
          onClick={handleComplete}
        >
          Complete
        </button>
      </div>
    </div>
  );
};

export default CompleteStep;
