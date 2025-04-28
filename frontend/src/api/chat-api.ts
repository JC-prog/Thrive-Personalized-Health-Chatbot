const API_URL = "http://localhost:8000";

// Utility function to handle fetch requests
const fetchData = async (url: string, options: RequestInit) => {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Something went wrong");
    }
    return response.json();
  };

export const sendMessage = async (message: string): Promise<{ response: string }> => {
    const token = getToken();
    if (!token) {
      throw new Error("No token available");
    }
  
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    };
  
    return await fetchData(`${API_URL}/chat`, options);
  };
  
  // Get token from localStorage
export const getToken = (): string | null => {
    return localStorage.getItem("token");
  };