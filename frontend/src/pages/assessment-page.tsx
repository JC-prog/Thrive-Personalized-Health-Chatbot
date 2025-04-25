import { useState } from "react";
import WelcomeStep from "@components/assessments/WelcomeStep";
import PersonalInfoStep from "@components/assessments/PersonalInfoStep";
import LifestyleStep from "@components/assessments/LifestyleStep";
import HealthMetricStep from "@components/assessments/HealthMetricsStep";
import CompleteStep from "@components/assessments/CompleteStep"

export type FormData = {
  name: string;
  age: number;
  gender: string;
  smokes: boolean;
  exercises: boolean;
  bloodPressure: string;
  glucoseLevel: string;
  cholesterol?: string;
  bloodSugar?: string;
  lifestyle?: {
    smokes: string;
    alcohol: string;
    exercise: string;
    diet: string;
  };
};


const initialFormData: FormData = {
  name: "",
  age: 0,
  gender: "",
  smokes: false,
  exercises: false,
  bloodPressure: "",
  glucoseLevel: "",
};

const AssessmentPage = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const next = () => setStep((prev) => prev + 1);
  const prev = () => setStep((prev) => prev - 1);

  const updateForm = (newData: Partial<FormData>) =>
    setFormData((prev) => ({ ...prev, ...newData }));

  const steps = [
    <WelcomeStep next={next} />,
    <PersonalInfoStep next={next} prev={prev} data={formData} update={updateForm} />,
    <LifestyleStep next={next} prev={prev} data={formData} update={updateForm} />,
    <HealthMetricStep next={next} prev={prev} data={formData} update={updateForm} />,
    <CompleteStep  next={next} prev={prev} data={formData} update={updateForm} />
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6">
      {/* Toast Component */}

      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        {steps[step]}
      </div>
    </div>
  )
};

export default AssessmentPage;
