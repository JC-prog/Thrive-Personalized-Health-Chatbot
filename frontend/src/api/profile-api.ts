import { UserProfileUpdateData } from "src/types/user";

const API_URL = "http://localhost:8000";

// Get profile info
export const getProfile = async () => {
    const token = getToken();
    if (!token) throw new Error("No token found");
  
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    };
  
    return await fetchUserData(`${API_URL}/me`, options);
  };
  
  const fetchUserData = async (url: string, options: RequestInit) => {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Something went wrong");
    }
    return response.json();
  };

export const getToken = (): string | null => {
return localStorage.getItem("token");
};

// Update Profile
export const updateProfile = async (data: UserProfileUpdateData) => {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const formattedData = {
    age: data.age,
    gender: data.gender,
    education: data.education,
    healthcare: data.healthcare,
    income: data.income,
    smoking: data.smoking,
    alcohol: data.alcohol,
    active_lifestyle: data.active_lifestyle,
    vegetables: data.vegetables,
    fruits: data.fruits,
    height: data.height,
    weight: data.weight,
    systolic_bp: data.systolic_bp,
    diastolic_bp: data.diastolic_bp,
    glucose_level: data.glucose_level,
    cholesterol_total: data.cholesterol_total,
    heart_history: data.heart_history,
    stroke: data.stroke,
    disability: data.disability,
    generalHealth: data.generalHealth,
    mentalHealth: data.mentalHealth,
    physicalHealth: data.physicalHealth,
  };

  const options: RequestInit = {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formattedData),
  };

  return await fetchUserData(`${API_URL}/updateUser`, options);
};
