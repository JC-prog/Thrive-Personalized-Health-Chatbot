export interface UserProfileData
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
}
