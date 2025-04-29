import React, { useState } from 'react';
import { UserProfileUpdateData } from "src/types/user";

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
    <div className="text-center max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
        Health Scores
      </h2>
      <p className="text-gray-600 mb-6">Please select your health scores.</p>

      <div className="space-y-6">
        {/* General Health */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">How would you rate your general health? ( 5 = Best, 1 = Worst )</label>
          <select
            name="generalHealth"
            value={generalHealth}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
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
                In the past 30 days, how many days did you feel that your mental health (stress, depression, emotional issues) was not good? (1–30 days)
            </label>
            <select
                name="mentalHealth"
                value={mentalHealth}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            >
                <option value="">Select</option>
                {generateOptions()} {/* This will generate options from 1 to 30 */}
            </select>
        </div>

        {/* Physical Health */}
        <div>
            <label className="block text-gray-700 font-semibold mb-2">
                In the past 30 days, how many days was your physical health (illness or injury) not good? (1–30 days)
            </label>
            <select
                name="physicalHealth"
                value={physicalHealth}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            >
                <option value="">Select</option>
                {generateOptions()} {/* This will generate options from 1 to 30 */}
            </select>
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

export default HealthScoreStep;
