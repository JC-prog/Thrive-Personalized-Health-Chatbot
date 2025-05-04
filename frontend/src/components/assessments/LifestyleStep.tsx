import React, { useState } from 'react';
import { UserProfileUpdateData } from "src/types/user";
import { motion } from "framer-motion";
import { FaSmokingBan, FaBeer, FaRunning, FaCarrot, FaAppleAlt } from 'react-icons/fa';

type Props = {
  next: () => void;
  prev: () => void;
  data: UserProfileUpdateData;
  update: (newData: Partial<UserProfileUpdateData>) => void;
};

const LifestyleStep = ({ next, prev, data, update }: Props) => {
  const [lifestyle, setLifestyle] = useState({
    smoking: data.smoking,
    alcohol: data.alcohol,
    active_lifestyle: data.active_lifestyle,
    vegetables: data.vegetables,
    fruits: data.fruits,
  });

  const handleChange = (key: keyof typeof lifestyle, value: number) => {
    setLifestyle((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNext = () => {
    update(lifestyle);
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
      {/* Step indicator */}
      <div className="flex justify-between items-center mb-6">
        {["Personal Info", "Lifestyle","History" ,"Metrics", "Scores", "Summary"].map((step, idx) => (
          <div key={idx} className="flex-1 text-center">
            <div className={`h-1 rounded-full ${idx === 1 ? 'bg-indigo-600' : 'bg-gray-300'}`} />
            <p className={`mt-1 text-sm ${idx === 1 ? 'text-indigo-600 font-semibold' : 'text-gray-400'}`}>{step}</p>
          </div>
        ))}
      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold text-center text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text mb-6">
        Lifestyle Information
      </h2>

      {/* Form card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
        {/* Smoking */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Do you smoke?</label>
          <div className="flex gap-4">
            {[{ label: "Yes", value: 1 }, { label: "No", value: 0 }].map((option) => (
              <button
                key={option.value}
                className={`flex-1 py-2 rounded-xl border ${lifestyle.smoking === option.value ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 border-gray-300'} hover:shadow-md transition cursor-pointer`}
                onClick={() => handleChange('smoking', option.value)}
                type="button"
              >
                <div className="flex items-center justify-center space-x-2">
                  <FaSmokingBan className="text-xl" />
                  <span>{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Alcohol */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Do you drink alcohol?</label>
          <div className="flex gap-4">
            {[{ label: "Yes", value: 1 }, { label: "No", value: 0 }].map((option) => (
              <button
                key={option.value}
                className={`flex-1 py-2 rounded-xl border ${lifestyle.alcohol === option.value ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 border-gray-300'} hover:shadow-md transition cursor-pointer`}
                onClick={() => handleChange('alcohol', option.value)}
                type="button"
              >
                <div className="flex items-center justify-center space-x-2">
                  <FaBeer className="text-xl" />
                  <span>{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Lifestyle */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Do you exercise regularly?</label>
          <div className="flex gap-4">
            {[{ label: "Yes", value: 1 }, { label: "No", value: 0 }].map((option) => (
              <button
                key={option.value}
                className={`flex-1 py-2 rounded-xl border ${lifestyle.active_lifestyle === option.value ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 border-gray-300'} hover:shadow-md transition cursor-pointer`}
                onClick={() => handleChange('active_lifestyle', option.value)}
                type="button"
              >
                <div className="flex items-center justify-center space-x-2">
                  <FaRunning className="text-xl" />
                  <span>{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Vegetables */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Do you eat vegetables regularly?</label>
          <div className="flex gap-4">
            {[{ label: "Yes", value: 1 }, { label: "No", value: 0 }].map((option) => (
              <button
                key={option.value}
                className={`flex-1 py-2 rounded-xl border ${lifestyle.vegetables === option.value ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 border-gray-300'} hover:shadow-md transition cursor-pointer`}
                onClick={() => handleChange('vegetables', option.value)}
                type="button"
              >
                <div className="flex items-center justify-center space-x-2">
                  <FaCarrot className="text-xl" />
                  <span>{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Fruits */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Do you eat fruits regularly?</label>
          <div className="flex gap-4">
            {[{ label: "Yes", value: 1 }, { label: "No", value: 0 }].map((option) => (
              <button
                key={option.value}
                className={`flex-1 py-2 rounded-xl border ${lifestyle.fruits === option.value ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 border-gray-300'} hover:shadow-md transition cursor-pointer`}
                onClick={() => handleChange('fruits', option.value)}
                type="button"
              >
                <div className="flex items-center justify-center space-x-2">
                  <FaAppleAlt className="text-xl" />
                  <span>{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
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

export default LifestyleStep;
