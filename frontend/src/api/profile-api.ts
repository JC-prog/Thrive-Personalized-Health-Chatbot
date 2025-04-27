import { UserProfileData } from "src/types/user";

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
export const updateProfile = async (data: UserProfileData) => {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const options: RequestInit = {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  };

  return await fetchUserData(`${API_URL}/updateUser`, options);
};
