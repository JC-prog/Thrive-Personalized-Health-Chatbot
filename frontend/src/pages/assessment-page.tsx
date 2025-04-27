import { useState } from "react";
import WelcomeStep from "@components/assessments/WelcomeStep";
import PersonalInfoStep from "@components/assessments/PersonalInfoStep";
import LifestyleStep from "@components/assessments/LifestyleStep";
import HealthMetricStep from "@components/assessments/HealthMetricsStep";
import CompleteStep from "@components/assessments/CompleteStep"
import { UserProfileData } from "src/types/user";
import MedicalHistoryStep from "@components/assessments/MedicalHistoryStep";

const AssessmentPage = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<UserProfileData>({
    id: 0,
    name: "",
    username: "",
    email: "",
    general_data: {
      age: 0,
      phone_number: "",
      gender: "",
      education: 0,
      healthcare: 0,
      income: 0,
    },
    clinical_measurement: {
      height: 0,
      weight: 0,
      bmi: 0,
      systolic_bp: 0,
      diastolic_bp: 0,
      glucose_level: 0,
      cholesterol_total: 0,
    },
    lifestyle: {
      smoking: 0,
      alcohol: 0,
      exercise: 0,
      vegetable: 0,
      fruits: 0,
    },
    medical_history: {
      heart_history: 0,
      stroke: 0,
      disability: 0
    }
  });
  
  const next = () => setStep((prev) => prev + 1);
  const prev = () => setStep((prev) => prev - 1);

  const updateForm = (newData: Partial<UserProfileData>) =>
    setFormData((prev) => ({ ...prev, ...newData }));
  
  const steps = [
    <WelcomeStep next={next} />,
    <PersonalInfoStep next={next} prev={prev} data={formData} update={updateForm} />,
    <LifestyleStep next={next} prev={prev} data={formData} update={updateForm} />,
    <MedicalHistoryStep next={next} prev={prev} data={formData} update={updateForm} />,
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
