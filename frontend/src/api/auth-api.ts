const API_URL = "http://localhost:8000";

interface LoginData {
  username_or_email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  username: string;
  password: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
}

// Utility function to handle fetch requests
const fetchData = async (url: string, options: RequestInit) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Something went wrong");
  }
  return response.json();
};

// Register function
export const register = async (data: RegisterData): Promise<TokenResponse> => {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  return await fetchData(`${API_URL}/register`, options);
};

// Login function
export const login = async (data: LoginData): Promise<TokenResponse> => {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  return await fetchData(`${API_URL}/login`, options);
};

// Logout function (optional)
export const logout = (): void => {
  localStorage.removeItem("token"); // Clear token from localStorage
  // Optionally, you can redirect the user to the login page
  window.location.href = "/login";
};

// Get token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

// Set token in localStorage
export const setToken = (token: string): void => {
  localStorage.setItem("token", token);
};
