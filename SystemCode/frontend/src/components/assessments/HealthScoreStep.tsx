import React, { useState } from 'react';
import { UserProfileUpdateData } from "src/types/user";
import { motion } from "framer-motion";

type Props = {
  next: () => void;
  prev: () => void;
  data: UserProfileUpdateData;
  update: (newData: Partial<UserProfileUpdateData>) => void;
};

const HealthScoreStep = ({ next, prev, data, update }: Props) => {
  const [generalHealth, setGeneralHealth] = useState(data.generalHealth);
  const [mentalHealth, setMentalHealth] = useState(data.mentalHealth);
  const [physicalHealth, setPhysicalHealth] = useState(data.physicalHealth);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case 'generalHealth':
        setGeneralHealth(Number(value));
        break;
      case 'mentalHealth':
        setMentalHealth(Number(value));
        break;
      case 'physicalHealth':
        setPhysicalHealth(Number(value));
        break;
    }
  };

  const handleNext = () => {
    update({
      generalHealth: generalHealth,
      mentalHealth: mentalHealth,
      physicalHealth: physicalHealth,
    });
    next();
  };

  const generateOptions = () => {
    const options = [];
    for (let i = 1; i <= 30; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return options;
  };

  return (
    <motion.div
      className="text-center max-w-3xl mx-auto px-4 py-8"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      {/* Step Indicator */}
      <div className="flex justify-between items-center mb-6">
        {["Personal Info", "Lifestyle","History" ,"Metrics", "Scores", "Summary"].map((step, idx) => (
          <div key={idx} className="flex-1 text-center">
            <div className={`h-1 rounded-full ${idx === 4 ? 'bg-indigo-600' : 'bg-gray-300'}`} />
            <p className={`mt-1 text-sm ${idx === 4 ? 'text-indigo-600 font-semibold' : 'text-gray-400'}`}>{step}</p>
          </div>
        ))}
      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text mb-6">
        Health Scores
      </h2>

      {/* Description */}
      <p className="text-gray-600 mb-6">Please select your health scores for the following metrics.</p>

      <div className="space-y-8">
        {/* General Health */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            How would you rate your general health? (5 = Best, 1 = Worst)
          </label>
          <select
            name="generalHealth"
            value={generalHealth}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            <option value="">Select</option>
            <option value="1">Poor</option>
            <option value="2">Fair</option>
            <option value="3">Good</option>
            <option value="4">Very Good</option>
            <option value="5">Excellent</option>
          </select>
        </div>

        {/* Mental Health */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            In the past 30 days, how many days did you feel your mental health (stress, depression) was not good?
          </label>
          <select
            name="mentalHealth"
            value={mentalHealth}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            <option value="">Select</option>
            {generateOptions()}
          </select>
          <p className="text-gray-500 text-sm mt-1">1 = Few days, 30 = Every day</p>
        </div>

        {/* Physical Health */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            In the past 30 days, how many days was your physical health (illness or injury) not good?
          </label>
          <select
            name="physicalHealth"
            value={physicalHealth}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            <option value="">Select</option>
            {generateOptions()}
          </select>
          <p className="text-gray-500 text-sm mt-1">1 = Few days, 30 = Every day</p>
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
    </motion.div>
  );
};

export default HealthScoreStep;
