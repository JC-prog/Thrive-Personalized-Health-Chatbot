import React, { useState } from 'react';
import { UserProfileData } from "src/types/user";

type Props = {
  next: () => void;
  prev: () => void;
  data: UserProfileData;
  update: (newData: Partial<UserProfileData>) => void;
};

const HealthMetricStep = ({ next, prev, data, update }: Props) => {
  const [clinicalMeasurement, setClinicalMeasurement] = useState(data.clinical_measurement);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClinicalMeasurement(prev => ({
      ...prev,
      [name]: Number(value) // assuming all are numbers
    }));
  };

  const handleNext = () => {
    update({
      clinical_measurement: clinicalMeasurement
    });
    next();
  };

  return (
    <div className="text-center max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
        Health Metrics
      </h2>
      <p className="text-gray-600 mb-6">If you know your recent health metrics, please provide them below (optional).</p>

      <div className="space-y-6">
        {/* Height */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Height (cm)</label>
          <input
            type="number"
            name="height"
            value={clinicalMeasurement.height}
            onChange={handleChange}
            placeholder="e.g., 170"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Weight */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={clinicalMeasurement.weight}
            onChange={handleChange}
            placeholder="e.g., 65"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Systolic BP */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Systolic Blood Pressure (mmHg)</label>
          <input
            type="number"
            name="systolic_bp"
            value={clinicalMeasurement.systolic_bp}
            onChange={handleChange}
            placeholder="e.g., 120"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Diastolic BP */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Diastolic Blood Pressure (mmHg)</label>
          <input
            type="number"
            name="diastolic_bp"
            value={clinicalMeasurement.diastolic_bp}
            onChange={handleChange}
            placeholder="e.g., 80"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Glucose Level */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Fasting Glucose Level (mg/dL)</label>
          <input
            type="number"
            name="glucose_level"
            value={clinicalMeasurement.glucose_level}
            onChange={handleChange}
            placeholder="e.g., 90"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Total Cholesterol */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Total Cholesterol (mg/dL)</label>
          <input
            type="number"
            name="cholesterol_total"
            value={clinicalMeasurement.cholesterol_total}
            onChange={handleChange}
            placeholder="e.g., 180"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="bg-primary-50 p-4 rounded-lg">
          <p className="text-sm text-primary-800">
            <span className="font-medium">Don't know these values?</span> That's okay! You can still get valuable insights from our assessment.
          </p>
        </div>
      </div>

      <div className="flex justify-between pt-10">
        <button
          type="button"
          onClick={prev}
          className="px-6 py-3 bg-gray-300 text-gray-800 font-medium rounded-xl hover:bg-gray-400 transition-all"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="px-8 py-4 bg-indigo-600 text-white font-medium rounded-xl shadow-md hover:bg-indigo-700 transition-all"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HealthMetricStep;
