import React from 'react';

const WelcomeStep = ({ next }: { next: () => void }) => (
  <div className="text-center max-w-3xl mx-auto px-4 py-6">
    <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
      Predict Your Chronic Disease Risk
    </h2>
    
    <p className="text-gray-600 text-lg mb-10 leading-relaxed">
      Our evidence-based assessment helps identify your risk factors for common chronic diseases 
      and provides personalized recommendations to improve your health.
    </p>

    <div className="bg-indigo-50 p-6 rounded-xl shadow-sm mb-10 border border-indigo-100">
      <h3 className="font-semibold text-indigo-800 mb-4 text-xl">How it works:</h3>
      <ol className="text-left text-indigo-700 space-y-4">
        <li className="flex items-start">
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white text-sm font-medium mr-4 shadow-sm flex-shrink-0 transform transition-transform duration-200 hover:scale-110">1</span>
          <span className="pt-1">Complete a short questionnaire about your health, lifestyle, and family history</span>
        </li>
        <li className="flex items-start">
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white text-sm font-medium mr-4 shadow-sm flex-shrink-0 transform transition-transform duration-200 hover:scale-110">2</span>
          <span className="pt-1">Receive a personalized risk assessment for common chronic diseases</span>
        </li>
        <li className="flex items-start">
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white text-sm font-medium mr-4 shadow-sm flex-shrink-0 transform transition-transform duration-200 hover:scale-110">3</span>
          <span className="pt-1">Get a customized treatment plan with actionable recommendations</span>
        </li>
        <li className="flex items-start">
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white text-sm font-medium mr-4 shadow-sm flex-shrink-0 transform transition-transform duration-200 hover:scale-110">4</span>
          <span className="pt-1">Access educational resources to help you make informed decisions</span>
        </li>
      </ol>
    </div>

    <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 mb-10 shadow-sm">
      <p className="text-gray-600">
        <span className="font-semibold text-gray-800 block mb-1">Medical Disclaimer:</span> 
        This tool provides general health information and is not a substitute for professional medical advice. 
        Always consult with a healthcare provider for personal medical concerns.
      </p>
    </div>

    <button 
      className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-medium rounded-xl shadow-md hover:bg-indigo-700 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
      onClick={next} 
    >
      Start Assessment
    </button>
  </div>
);

export default WelcomeStep;