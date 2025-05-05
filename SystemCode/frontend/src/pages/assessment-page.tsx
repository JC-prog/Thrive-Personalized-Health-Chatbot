import { useState } from "react";
import WelcomeStep from "@components/assessments/WelcomeStep";
import PersonalInfoStep from "@components/assessments/PersonalInfoStep";
import LifestyleStep from "@components/assessments/LifestyleStep";
import HealthMetricStep from "@components/assessments/HealthMetricsStep";
import CompleteStep from "@components/assessments/CompleteStep";
import MedicalHistoryStep from "@components/assessments/MedicalHistoryStep";
import HealthScoreStep from "@components/assessments/HealthScoreStep";
import { UserProfileUpdateData } from "src/types/user";

const AssessmentPage = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<UserProfileUpdateData>({
    age: 30,
    gender: 1,
    education: 1,
    healthcare: 0,
    income: 1,
    smoking: 0,
    alcohol: 0,
    active_lifestyle: 0,
    vegetables: 0,
    fruits: 0,
    height: 170.5,
    weight: 70.2,
    systolic_bp: 100,
    diastolic_bp: 60,
    glucose_level: 1,
    cholesterol_total: 100,
    heart_history: 0,
    stroke: 0,
    disability: 0,
    generalHealth: 5,
    mentalHealth: 1,
    physicalHealth: 1,
  });

  const next = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prev = () => setStep((prev) => Math.max(prev - 1, 0));
  const updateForm = (newData: Partial<UserProfileUpdateData>) =>
    setFormData((prev) => ({ ...prev, ...newData }));

  const stepLabels = [
    "Welcome",
    "Personal Info",
    "Lifestyle",
    "Medical History",
    "Health Metrics",
    "Health Score",
    "Complete",
  ];

  const steps = [
    <WelcomeStep next={next} />,
    <PersonalInfoStep next={next} prev={prev} data={formData} update={updateForm} />,
    <LifestyleStep next={next} prev={prev} data={formData} update={updateForm} />,
    <MedicalHistoryStep next={next} prev={prev} data={formData} update={updateForm} />,
    <HealthMetricStep next={next} prev={prev} data={formData} update={updateForm} />,
    <HealthScoreStep next={next} prev={prev} data={formData} update={updateForm} />,
    <CompleteStep next={next} prev={prev} data={formData} update={updateForm} />,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-12">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-indigo-600 text-white py-10 px-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Assessment</h2>
            <ul className="space-y-4">
              {stepLabels.map((label, i) => (
                <li
                  key={label}
                  className={`text-sm font-medium transition-colors ${
                    step === i ? "text-white" : "text-indigo-200"
                  }`}
                >
                  {i + 1}. {label}
                </li>
              ))}
            </ul>
          </div>
          <div className="text-xs text-indigo-200">&copy; 2025 Thrive</div>
        </div>

        {/* Main Form */}
        <div className="flex-1 p-12 transition-all duration-300">{steps[step]}</div>
      </div>
    </div>
  );
};

export default AssessmentPage;
