import React from 'react';
import { UserProfileData } from 'src/types/user';
import { useLocation } from 'wouter';
import { updateProfile } from '../../api/profile-api'

type Props = {
  next: () => void;
  prev: () => void;
  data: UserProfileData;
  update: (newData: Partial<UserProfileData>) => void;
};

const CompleteStep = ({ next, prev, data, update }: Props) => {
  const [, navigate] = useLocation();

  const handleComplete = async () => {
    try {
      const updatedData = await updateProfile(data);

      navigate('/');
    } catch (error) {
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
          <li><strong>Age:</strong> {data.general_data.age}</li>
          <li><strong>Gender:</strong> {data.general_data.gender}</li>
          <li><strong>Education Level:</strong> {data.general_data.education}</li>
          <li><strong>Healthcare Access:</strong> {data.general_data.healthcare}</li>
          <li><strong>Income Level:</strong> {data.general_data.income}</li>
        </ul>
      </div>
      
      {/* Lifestyle Factors */}
      <div className="bg-indigo-50 p-6 rounded-xl shadow-sm mb-10 border border-indigo-100 text-left">
        <h3 className="font-semibold text-indigo-800 mb-4 text-xl">Lifestyle Factors:</h3>
        <ul className="space-y-2">
          <li><strong>Smoking:</strong> {data.lifestyle.smoking}</li>
          <li><strong>Alcohol Consumption:</strong> {data.lifestyle.alcohol}</li>
          <li><strong>Exercise:</strong> {data.lifestyle.exercise}</li>
          <li><strong>Vegetable Intake:</strong> {data.lifestyle.vegetable}</li>
          <li><strong>Fruit Intake:</strong> {data.lifestyle.fruits}</li>
        </ul>
      </div>

      {/* Health Metrics */}
      <div className="bg-indigo-50 p-6 rounded-xl shadow-sm mb-10 border border-indigo-100 text-left">
        <h3 className="font-semibold text-indigo-800 mb-4 text-xl">Health Metrics:</h3>
        <ul className="space-y-2">
          <li><strong>Height:</strong> {data.clinical_measurement.height} cm</li>
          <li><strong>Weight:</strong> {data.clinical_measurement.weight} kg</li>
          <li><strong>BMI:</strong> {data.clinical_measurement.bmi}</li>
          <li><strong>Systolic BP:</strong> {data.clinical_measurement.systolic_bp} mmHg</li>
          <li><strong>Diastolic BP:</strong> {data.clinical_measurement.diastolic_bp} mmHg</li>
          <li><strong>Glucose Level:</strong> {data.clinical_measurement.glucose_level} mg/dL</li>
          <li><strong>Total Cholesterol:</strong> {data.clinical_measurement.cholesterol_total} mg/dL</li>
        </ul>
      </div>

      {/* Medical History */}
      <div className="bg-indigo-50 p-6 rounded-xl shadow-sm mb-10 border border-indigo-100 text-left">
        <h3 className="font-semibold text-indigo-800 mb-4 text-xl">Medical History:</h3>
        <ul className="space-y-2">
          <li><strong>Heart History:</strong> {data.medical_history.heart_history}</li>
          <li><strong>Stroke History:</strong> {data.medical_history.stroke}</li>
          <li><strong>Disabilitay History:</strong> {data.medical_history.disability}</li>
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
