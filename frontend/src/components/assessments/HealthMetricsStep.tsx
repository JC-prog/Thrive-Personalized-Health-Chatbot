import React, { useState } from 'react';
import { UserProfileUpdateData } from "src/types/user";
import { motion } from "framer-motion";

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
    <motion.div
      className="max-w-3xl mx-auto px-4 py-8"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      {/* Step Indicator */}
      <div className="flex justify-between items-center mb-6">
        {["Personal Info", "Lifestyle","History" ,"Metrics", "Scores", "Summary"].map((step, idx) => (
          <div key={idx} className="flex-1 text-center">
            <div className={`h-1 rounded-full ${idx === 3 ? 'bg-indigo-600' : 'bg-gray-300'}`} />
            <p className={`mt-1 text-sm ${idx === 3 ? 'text-indigo-600 font-semibold' : 'text-gray-400'}`}>{step}</p>
          </div>
        ))}
      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold text-center text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text mb-6">
        Health Metrics
      </h2>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
        {/* Height */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Height (cm)</label>
          <input
            type="number"
            name="height"
            value={height}
            onChange={handleChange}
            placeholder="e.g., 170"
            className="w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-700"
          />
        </div>

        {/* Weight */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={weight}
            onChange={handleChange}
            placeholder="e.g., 65"
            className="w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-700"
          />
        </div>

        {/* Systolic BP */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Systolic Blood Pressure (mmHg)</label>
          <input
            type="number"
            name="systolic_bp"
            value={systolicBp}
            onChange={handleChange}
            placeholder="e.g., 120"
            className="w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-700"
          />
        </div>

        {/* Diastolic BP */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Diastolic Blood Pressure (mmHg)</label>
          <input
            type="number"
            name="diastolic_bp"
            value={diastolicBp}
            onChange={handleChange}
            placeholder="e.g., 80"
            className="w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-700"
          />
        </div>

        {/* Glucose Level */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Fasting Glucose Level (mg/dL)</label>
          <input
            type="number"
            name="glucose_level"
            value={glucoseLevel}
            onChange={handleChange}
            placeholder="e.g., 90"
            className="w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-700"
          />
        </div>

        {/* Total Cholesterol */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Total Cholesterol (mg/dL)</label>
          <input
            type="number"
            name="cholesterol_total"
            value={cholesterolTotal}
            onChange={handleChange}
            placeholder="e.g., 180"
            className="w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-700"
          />
        </div>

      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={prev}
          className="px-6 py-3 bg-gray-300 text-gray-800 font-medium rounded-xl hover:bg-gray-400 transition-all cursor-pointer"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-xl shadow-md hover:bg-indigo-700 transition-all cursor-pointer"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default HealthMetricStep;
