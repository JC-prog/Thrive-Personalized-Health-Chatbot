export interface UserProfileData
{
    id: number;
    name: string;
    username: string;
    email: string;
    age: number;
    phone_number: string;
    gender: number;
    education: number;
    healthcare: number;
    income: number;
    height: number;
    weight: number;
    bmi: number;
    systolic_bp: number;
    diastolic_bp: number;
    glucose_level: number;
    cholesterol_total: number;
    smoking: number;
    alcohol: number;
    active_lifestyle: number;
    vegetables: number;
    fruits: number;
    heart_history: number;
    stroke: number;
    disability: number;
    generalHealth: number;
    mentalHealth: number;
    physicalHealth: number;
    assessment_done: number;
    assessment_done_at: Date;
}

export interface UserProfileUpdateData
{
    age: number;
    gender: number;
    education: number;
    healthcare: number;
    income: number;
    height: number;
    weight: number;
    systolic_bp: number;
    diastolic_bp: number;
    glucose_level: number;
    cholesterol_total: number;
    smoking: number;
    alcohol: number;
    active_lifestyle: number;
    vegetables: number;
    fruits: number;
    heart_history: number;
    stroke: number;
    disability: number;
    generalHealth: number;
    mentalHealth: number;
    physicalHealth: number;
}
