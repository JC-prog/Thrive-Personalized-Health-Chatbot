import React from 'react';
import { UserProfileUpdateData } from "src/types/user";
import { motion } from "framer-motion";

type Props = {
  next: () => void;
  prev: () => void;
  data: UserProfileUpdateData;
  update: (newData: Partial<UserProfileUpdateData>) => void;
};

const PersonalInfoStep = ({ next, prev, data, update }: Props) => (
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
          <div className={`h-1 rounded-full ${idx === 0 ? 'bg-indigo-600' : 'bg-gray-300'}`} />
          <p className={`mt-1 text-sm ${idx === 0 ? 'text-indigo-600 font-semibold' : 'text-gray-400'}`}>{step}</p>
        </div>
      ))}
    </div>

    {/* Title */}
    <h2 className="text-3xl font-bold text-center text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text mb-6">
      Personal Information
    </h2>

    {/* Form card */}
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      {/* Age */}
      <div>
        <label className="block mb-1 text-gray-700 font-medium">Age</label>
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
        <label className="block mb-1 text-gray-700 font-medium">Gender</label>
        <select
          value={data.gender}
          onChange={(e) => update({ gender: parseInt(e.target.value) })}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
        >
          <option value="1">Male</option>
          <option value="0">Female</option>
        </select>
      </div>

      {/* Education */}
      <div>
        <label className="block mb-1 text-gray-700 font-medium">Education</label>
        <select
          value={data.education}
          onChange={(e) => update({ education: parseInt(e.target.value) })}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
        >
          <option value="1">Never attended school</option>
          <option value="2">Primary School</option>
          <option value="3">Secondary School</option>
          <option value="4">Junior College</option>
          <option value="5">Polytechnic</option>
          <option value="6">Graduated from University</option>
        </select>
      </div>

      {/* Insurance */}
      <div>
        <label className="block mb-2 text-gray-700 font-medium">Do you have insurance?</label>
        <div className="flex gap-4">
          {[{ label: "Yes", value: 1 }, { label: "No", value: 0 }].map((option) => (
            <button
              key={option.value}
              className={`flex-1 py-2 rounded-xl border ${
                data.healthcare === option.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 border-gray-300'
              } hover:shadow-md transition cursor-pointer`}
              onClick={() => update({ healthcare: option.value })}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Income */}
      <div>
        <label className="block mb-2 text-gray-700 font-medium">What’s your income level?</label>
        <div className="space-y-2">
          {[
            "Less than $10,000",
            "$10,000 to less than $15,000",
            "$15,000 to less than $20,000",
            "$20,000 to less than $25,000",
            "$35,000 to less than $50,000",
            "$50,000 to less than $75,000",
            "$75,000 or more",
          ].map((label, idx) => (
            <label key={idx} className="flex items-center space-x-3">
              <input
                type="radio"
                name="income"
                value={idx + 1}
                checked={data.income === idx + 1}
                onChange={(e) => update({ income: parseInt(e.target.value) })}
                className="form-radio h-4 w-4 text-indigo-600"
              />
              <span className="text-gray-700">{label}</span>
            </label>
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
        onClick={next}
      >
        Next
      </button>
    </div>
  </motion.div>
);

export default PersonalInfoStep;
