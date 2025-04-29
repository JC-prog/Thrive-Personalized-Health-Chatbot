import React, { useState } from 'react';
import { UserProfileUpdateData } from 'src/types/user';

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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLifestyle((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleNext = () => {
    update({
      smoking: lifestyle.smoking,
      alcohol: lifestyle.alcohol,
      active_lifestyle: lifestyle.active_lifestyle,
      vegetables: lifestyle.vegetables,
      fruits: lifestyle.fruits,
    });
    next();
  };

  return (
    <div className="text-center max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
        Lifestyle Information
      </h2>
      <p className="text-gray-600 mb-6">Please select your lifestyle habits.</p>

      <div className="space-y-6">
        {/* Smoking */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Do you smoke?</label>
          <select
            name="smoking"
            value={lifestyle.smoking}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>

        {/* Alcohol */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Do you drink alcohol?</label>
          <select
            name="alcohol"
            value={lifestyle.alcohol}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>

        {/* Exercise */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Do you exercise regularly?</label>
          <select
            name="active_lifestyle"
            value={lifestyle.active_lifestyle}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>

        {/* Vegetables */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Do you eat vegetables regularly?</label>
          <select
            name="vegetables"
            value={lifestyle.vegetables}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>

        {/* Fruits */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Do you eat fruits regularly?</label>
          <select
            name="fruits"
            value={lifestyle.fruits}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="0">No</option>
            <option value="1">Yes</option>
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
