import React, { useState } from 'react';
import { UserProfileUpdateData } from "src/types/user";

type Props = {
  next: () => void;
  prev: () => void;
  data: UserProfileUpdateData;
  update: (newData: Partial<UserProfileUpdateData>) => void;
};

const MedicalHistoryStep = ({ next, prev, data, update }: Props) => {
  const [heartHistory, setHeartHistory] = useState(data.heart_history);
  const [stroke, setStroke] = useState(data.stroke);
  const [disability, setDisability] = useState(data.disability);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case 'heart_history':
        setHeartHistory(Number(value));
        break;
      case 'stroke':
        setStroke(Number(value));
        break;
      case 'disability':
        setDisability(Number(value));
        break;
    }
  };

  const handleNext = () => {
    update({
      heart_history: heartHistory,
      stroke: stroke,
      disability: disability,
    });
    next();
  };

  return (
    <div className="text-center max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
        Medical History
      </h2>
      <p className="text-gray-600 mb-6">Please select your medical history.</p>

      <div className="space-y-6">
        {/* Heart History */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Have you been diagnosed with heart disease before?</label>
          <select
            name="heart_history"
            value={heartHistory}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        {/* Stroke */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Have you ever had a stroke?</label>
          <select
            name="stroke"
            value={stroke}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        {/* Disability */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Do you have any form of disability?</label>
          <select
            name="disability"
            value={disability}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
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

export default MedicalHistoryStep;
