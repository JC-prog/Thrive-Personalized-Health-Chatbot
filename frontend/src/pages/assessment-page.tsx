import { useState } from "react";
import WelcomeStep from "@components/assessments/WelcomeStep";
import PersonalInfoStep from "@components/assessments/PersonalInfoStep";
import LifestyleStep from "@components/assessments/LifestyleStep";
import HealthMetricStep from "@components/assessments/HealthMetricsStep";
import CompleteStep from "@components/assessments/CompleteStep"

export interface FormData
{
    id: number;
    name: string;
    username: string;
    email: string;
    general_data: {
      age: number;
      phone_number: string;
      gender: string;
      income: number;
    };
    clinical_measurement: {
        height: number;
        weight: number;
        bmi: number;
        systolic_bp: number;
        diastolic_bp: number;
        glucose_level: number;
        cholesterol_total: number;
    };
    lifestyle: {
      smoking: number;
      alcohol: number;
      exercise: number;
      vegetable: number;
      fruits: number;
    }
};


const initialFormData: FormData = {
  name: ""
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
