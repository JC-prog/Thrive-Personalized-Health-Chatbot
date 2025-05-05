import React, { useState } from 'react';
import { UserProfileUpdateData } from "src/types/user";
import { motion } from "framer-motion";
import { FaHeart, FaBrain, FaWheelchair } from 'react-icons/fa';

type Props = {
  next: () => void;
  prev: () => void;
  data: UserProfileUpdateData;
  update: (newData: Partial<UserProfileUpdateData>) => void;
};

const MedicalHistoryStep = ({ next, prev, data, update }: Props) => {
  const [medicalHistory, setMedicalHistory] = useState({
    heartHistory: data.heart_history,
    stroke: data.stroke,
    disability: data.disability,
  });

  const handleChange = (key: keyof typeof medicalHistory, value: number) => {
    setMedicalHistory((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNext = () => {
    update(medicalHistory);
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
            <div className={`h-1 rounded-full ${idx === 2 ? 'bg-indigo-600' : 'bg-gray-300'}`} />
            <p className={`mt-1 text-sm ${idx === 2 ? 'text-indigo-600 font-semibold' : 'text-gray-400'}`}>{step}</p>
          </div>
        ))}
      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold text-center text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text mb-6">
        Medical History
      </h2>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
        {/* Heart History */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Have you been diagnosed with heart disease before?</label>
          <div className="flex gap-4">
            {[{ label: "Yes", value: 1 }, { label: "No", value: 0 }].map((option) => (
              <button
                key={option.value}
                className={`flex-1 py-2 rounded-xl border ${medicalHistory.heartHistory === option.value ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 border-gray-300'} hover:shadow-md transition cursor-pointer`}
                onClick={() => handleChange('heartHistory', option.value)}
                type="button"
              >
                <div className="flex items-center justify-center space-x-2">
                  <FaHeart className="text-xl" />
                  <span>{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Stroke */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Have you ever had a stroke?</label>
          <div className="flex gap-4">
            {[{ label: "Yes", value: 1 }, { label: "No", value: 0 }].map((option) => (
              <button
                key={option.value}
                className={`flex-1 py-2 rounded-xl border ${medicalHistory.stroke === option.value ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 border-gray-300'} hover:shadow-md transition cursor-pointer`}
                onClick={() => handleChange('stroke', option.value)}
                type="button"
              >
                <div className="flex items-center justify-center space-x-2">
                  <FaBrain className="text-xl" />
                  <span>{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Disability */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Do you have any form of disability?</label>
          <div className="flex gap-4">
            {[{ label: "Yes", value: 1 }, { label: "No", value: 0 }].map((option) => (
              <button
                key={option.value}
                className={`flex-1 py-2 rounded-xl border ${medicalHistory.disability === option.value ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 border-gray-300'} hover:shadow-md transition cursor-pointer`}
                onClick={() => handleChange('disability', option.value)}
                type="button"
              >
                <div className="flex items-center justify-center space-x-2">
                  <FaWheelchair className="text-xl" />
                  <span>{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          className="px-6 py-3 bg-gray-300 text-gray-800 font-medium rounded-xl hover:bg-gray-400 transition cursor-pointer"
          onClick={prev}
        >
          Back
        </button>

        <button
          className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-md transition cursor-pointer"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default MedicalHistoryStep;
