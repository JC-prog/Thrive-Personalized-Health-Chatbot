import React, { useState } from 'react';
import { FormData } from '@pages/assessment-page';

type Props = {
  next: () => void;
  prev: () => void;
  data: FormData;
  update: (newData: Partial<FormData>) => void;
};

const PersonalInfoStep = ({ next, prev, data, update }: Props) => {
    const [metrics, setMetrics] = useState({
      bloodPressure: data.bloodPressure || '',
      glucoseLevel: data.glucoseLevel || '',
      cholesterol: data.cholesterol || '',  // Add cholesterol
      bloodSugar: data.bloodSugar || '',    // Add bloodSugar
    });
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setMetrics(prev => ({ ...prev, [name]: value }));
    };
  
    const handleNext = () => {
      update({ ...metrics }); // Update the parent state with all metrics
      next();
    };
  
    return (
      <div className="text-center max-w-3xl mx-auto px-4 py-6">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
          Health Metrics
        </h2>
        <p className="text-gray-600 mb-6">If you know your recent health metrics, please provide them below (optional).</p>
  
        {/* Display name */}
        <p className="text-gray-600 mb-4">Name: {data.name}</p>
  
        <div className="space-y-6">
          {/* Blood Pressure */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Blood Pressure (mmHg)</label>
            <input
              type="text"
              name="bloodPressure"
              value={metrics.bloodPressure}
              onChange={handleChange}
              placeholder="e.g., 120/80"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            />
            <p className="mt-1 text-xs text-gray-500">Format: systolic/diastolic (e.g., 120/80)</p>
          </div>
  
          {/* Cholesterol */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Total Cholesterol (mg/dL)</label>
            <input
              type="number"
              name="cholesterol"
              value={metrics.cholesterol}
              onChange={handleChange}
              placeholder="e.g., 180"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
  
          {/* Blood Sugar */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Fasting Blood Sugar (mg/dL)</label>
            <input
              type="number"
              name="bloodSugar"
              value={metrics.bloodSugar}
              onChange={handleChange}
              placeholder="e.g., 90"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
  
          {/* Info about not knowing the values */}
          <div className="bg-primary-50 p-4 rounded-lg">
            <p className="text-sm text-primary-800">
              <span className="font-medium">Don't know these values?</span> That's okay! You can still get valuable insights from our assessment. Consider scheduling a check-up with your healthcare provider to learn these important numbers.
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
  
  export default PersonalInfoStep;
  