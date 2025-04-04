import React from 'react';
import { FormData } from '@pages/assessment-page';
import { useLocation } from 'wouter';

type Props = {
  next: () => void;
  prev: () => void;
  data: FormData;
  update: (newData: Partial<FormData>) => void;
};

const CompleteStep = ({ next, prev, data, update }: Props) => {
  const [, navigate] = useLocation();

  const handleComplete = () => {
    // You could also send formData to backend here if needed
    navigate('/');
  };

  return (
    <div className="text-center max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
        Summary
      </h2>

      <div className="bg-indigo-50 p-6 rounded-xl shadow-sm mb-10 border border-indigo-100">
        <h3 className="font-semibold text-indigo-800 mb-4 text-xl">Personal Information:</h3>
      </div>
      
      <div className="bg-indigo-50 p-6 rounded-xl shadow-sm mb-10 border border-indigo-100">
        <h3 className="font-semibold text-indigo-800 mb-4 text-xl">Lifestyle Factors:</h3>
      </div>

      <div className="bg-indigo-50 p-6 rounded-xl shadow-sm mb-10 border border-indigo-100">
        <h3 className="font-semibold text-indigo-800 mb-4 text-xl">Health Metrics:</h3>
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
          onClick={handleComplete}
          className="px-8 py-4 bg-indigo-600 text-white font-medium rounded-xl shadow-md hover:bg-indigo-700 transition-all"
        >
          Complete Assessment
        </button>
      </div>
    </div>
  );
};

export default CompleteStep;
