import { useState } from "react";
import WelcomeStep from "@components/assessments/WelcomeStep";
import PersonalInfoStep from "@components/assessments/PersonalInfoStep";
import LifestyleStep from "@components/assessments/LifestyleStep";
import HealthMetricStep from "@components/assessments/HealthMetricsStep";
import CompleteStep from "@components/assessments/CompleteStep";
import { UserProfileUpdateData } from "src/types/user";
import MedicalHistoryStep from "@components/assessments/MedicalHistoryStep";
import HealthScoreStep from "@components/assessments/HealthScoreStep";

const AssessmentPage = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<UserProfileUpdateData>({
    "age": 30,
    "gender": 1,
    "education": 1,
    "healthcare": 0,
    "income": 1,
    "smoking": 0,
    "alcohol": 1,
    "active_lifestyle": 1,
    "vegetables": 1,
    "fruits": 0,
    "height": 170.5,
    "weight": 70.2,
    "systolic_bp": 100,
    "diastolic_bp": 60,
    "glucose_level": 1,
    "cholesterol_total": 100,
    "heart_history": 1,
    "stroke": 0,
    "disability": 1,
    "generalHealth": 2,
    "mentalHealth": 2,
    "physicalHealth": 2
  });

  const next = () => setStep((prev) => Math.min(prev + 1, steps.length - 1)); // Ensure step is within bounds
  const prev = () => setStep((prev) => Math.max(prev - 1, 0)); // Prevent going below 0

  const updateForm = (newData: Partial<UserProfileUpdateData>) =>
    setFormData((prev) => ({ ...prev, ...newData }));

  const steps = [
    <WelcomeStep next={next} />,
    <PersonalInfoStep next={next} prev={prev} data={formData} update={updateForm} />,
    <LifestyleStep next={next} prev={prev} data={formData} update={updateForm} />,
    <MedicalHistoryStep next={next} prev={prev} data={formData} update={updateForm} />,
    <HealthMetricStep next={next} prev={prev} data={formData} update={updateForm} />,
    <HealthScoreStep next={next} prev={prev} data={formData} update={updateForm} />,
    <CompleteStep next={next} prev={prev} data={formData} update={updateForm} />
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6">
      {/* Toast Component */}

      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        {steps[step]}
      </div>
    </div>
  );
};

export default AssessmentPage;
