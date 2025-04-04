import React, { useState } from 'react';
import { FormData } from '@pages/assessment-page';

type Props = {
  next: () => void;
  prev: () => void;
  data: FormData;
  update: (newData: Partial<FormData>) => void;
};

const LifestyleStep = ({ next, prev, data, update }: Props) => {
  const [lifestyle, setLifestyle] = useState({
    smoking: data.lifestyle?.smoking || '',
    alcohol: data.lifestyle?.alcohol || '',
    exercise: data.lifestyle?.exercise || '',
    diet: data.lifestyle?.diet || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLifestyle(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    update({ lifestyle });
    next();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 text-left">
      <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent text-center">
        Lifestyle Factors
      </h2>
      <p className="text-gray-600 text-lg mb-10 text-center">
        Tell us about your daily habits and lifestyle.
      </p>

      <div className="space-y-6">
        {/* Smoking */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Smoking Status</label>
          <select
            name="smoking"
            value={lifestyle.smoking}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select an option</option>
            <option value="never">Never smoked</option>
            <option value="former">Former smoker</option>
            <option value="occasional">Occasional smoker</option>
            <option value="regular">Regular smoker</option>
          </select>
        </div>

        {/* Alcohol */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Alcohol Consumption</label>
          <select
            name="alcohol"
            value={lifestyle.alcohol}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select an option</option>
            <option value="none">None</option>
            <option value="light">Light (1–2 drinks/week)</option>
            <option value="moderate">Moderate (3–7 drinks/week)</option>
            <option value="heavy">Heavy (8+ drinks/week)</option>
          </select>
        </div>

        {/* Exercise */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Physical Activity</label>
          <select
            name="exercise"
            value={lifestyle.exercise}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select an option</option>
            <option value="sedentary">Sedentary (little to no exercise)</option>
            <option value="light">Light (1–2 days/week)</option>
            <option value="moderate">Moderate (3–5 days/week)</option>
            <option value="active">Active (6–7 days/week)</option>
          </select>
        </div>

        {/* Diet */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Diet Quality</label>
          <select
            name="diet"
            value={lifestyle.diet}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select an option</option>
            <option value="poor">Poor (highly processed, sugary, fatty)</option>
            <option value="fair">Fair (some healthy, some processed)</option>
            <option value="good">Good (mostly whole foods)</option>
            <option value="excellent">Excellent (plant-based, minimally processed)</option>
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

export default LifestyleStep;
