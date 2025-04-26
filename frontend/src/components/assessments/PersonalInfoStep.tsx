import React from 'react';
import { FormData } from '@pages/assessment-page';

type Props = {
  next: () => void;
  prev: () => void;
  data: FormData;
  update: (newData: Partial<FormData>) => void;
};

const PersonalInfoStep = ({ next, prev, data, update }: Props) => (
  <div className="text-center max-w-3xl mx-auto px-4 py-6">
    <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
      Personal Information
    </h2>

    <div className="space-y-6 mb-10 text-left">
      {/* Age */}
      <div>
        <label className="block mb-2 text-gray-700 font-medium">Age</label>
        <input
          type="number"
          value={data.age}
          onChange={(e) => update({ age: parseInt(e.target.value) })}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
          placeholder="Enter your age"
          min={0}
        />
      </div>

      {/* Gender */}
      <div>
        <label className="block mb-2 text-gray-700 font-medium">Gender</label>
        <select
          value={data.gender}
          onChange={(e) => update({ gender: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      {/* Education */}
      <div>
        <label className="block mb-2 text-gray-700 font-medium">Education</label>
        <select
          value={data.gender}
          onChange={(e) => update({ gender: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
        >
          <option value="">Select Education</option>
          <option value="male">Never attended school</option>
          <option value="female">Primary School</option>
          <option value="non-binary">Secondary School</option>
          <option value="female">Junior College</option>
          <option value="non-binary">Polytechnic</option>
          <option value="prefer-not-to-say">Graduated from University</option>
        </select>
      </div>


    {/* Insurance */}
      <div>
        <label className="block mb-2 text-gray-700 font-medium">Do you have insurance?</label>
        <select
          value={data.gender}
          onChange={(e) => update({ gender: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
        >
          <option value="">Select gender</option>
          <option value="male">Yes</option>
          <option value="female">No</option>
        </select>
      </div>

      {/* Income */}
      <div>
        <label className="block mb-2 text-gray-700 font-medium">What’s your income level?</label>
        <div className="space-y-2">
        {[
          "Less than $10,000",
          "Less than $15,000 ($10,000 to less than $15,000)",
          "Less than $20,000 ($15,000 to less than $20,000)",
          "Less than $25,000 ($20,000 to less than $25,000)",
          "Less than $50,000 ($35,000 to less than $50,000)",
          "Less than $75,000 ($50,000 to less than $75,000)",
          "$75,000 or more",
        ].map((label, idx) => (
          <label key={idx} className="flex items-center space-x-3">
            <input
              type="radio"
              name="income"
              value={idx + 1}
              checked={data.general_data?.income === idx + 1}
              onChange={(e) => update({ income: parseInt(e.target.value) })}
              className="form-radio h-4 w-4 text-indigo-600"
            />
            <span className="text-gray-700">{label}</span>
          </label>
        ))}
      </div>
      </div>

    </div>

    <div className="flex justify-between">
      <button
        className="px-6 py-3 bg-gray-300 text-gray-800 font-medium rounded-xl hover:bg-gray-400 transition-all"
        onClick={prev}
      >
        Back
      </button>

      <button
        className="px-8 py-4 bg-indigo-600 text-white font-medium rounded-xl shadow-md hover:bg-indigo-700 transition-all"
        onClick={next}
      >
        Next
      </button>
    </div>
  </div>
);

export default PersonalInfoStep;
