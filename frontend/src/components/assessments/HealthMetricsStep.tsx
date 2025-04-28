import React, { useState } from 'react';
import { UserProfileUpdateData } from "src/types/user";

type Props = {
  next: () => void;
  prev: () => void;
  data: UserProfileUpdateData;
  update: (newData: Partial<UserProfileUpdateData>) => void;
};

const HealthMetricStep = ({ next, prev, data, update }: Props) => {
  // Individual state for clinical measurements
  const [height, setHeight] = useState(data.height);
  const [weight, setWeight] = useState(data.weight);
  const [systolicBp, setSystolicBp] = useState(data.systolic_bp);
  const [diastolicBp, setDiastolicBp] = useState(data.diastolic_bp);
  const [glucoseLevel, setGlucoseLevel] = useState(data.glucose_level);
  const [cholesterolTotal, setCholesterolTotal] = useState(data.cholesterol_total);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = Number(value);

    switch (name) {
      case 'height':
        setHeight(numericValue);
        break;
      case 'weight':
        setWeight(numericValue);
        break;
      case 'systolic_bp':
        setSystolicBp(numericValue);
        break;
      case 'diastolic_bp':
        setDiastolicBp(numericValue);
        break;
      case 'glucose_level':
        setGlucoseLevel(numericValue);
        break;
      case 'cholesterol_total':
        setCholesterolTotal(numericValue);
        break;
      default:
        break;
    }
  };

  const handleNext = () => {
    update({
      height,
      weight,
      systolic_bp: systolicBp,
      diastolic_bp: diastolicBp,
      glucose_level: glucoseLevel,
      cholesterol_total: cholesterolTotal,
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
            value={height}
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
            value={weight}
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
            value={systolicBp}
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
            value={diastolicBp}
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
            value={glucoseLevel}
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
            value={cholesterolTotal}
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
