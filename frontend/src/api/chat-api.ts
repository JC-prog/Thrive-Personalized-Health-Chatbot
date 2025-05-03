const API_URL = "http://localhost:8000";

// Utility function to handle fetch requests
const fetchData = async (url: string, options: RequestInit) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
        if (response.status === 401) {
            // Token is invalid or expired
            alert("Your session has expired. Please log in again.");
            localStorage.removeItem("token"); // Clear the invalid token
            window.location.href = "/auth"; // Redirect to login page
        }
        const errorData = await response.json();
        throw new Error(errorData.detail || "Something went wrong");
    }
    return response.json();
} catch (error: any) {
    if (error.name === "TypeError" && error.message === "Ooops! Something went wrong, plese try again.") {
        // Handle network errors or backend disconnection
        alert("Unable to connect to the server. Please check your internet connection or try again later.");
    } else {
        console.error("An unexpected error occurred:", error);
        alert("An unexpected error occurred. Please try again later.");
    }
    throw error; // Re-throw the error to propagate it if needed
}
};

// export const sendMessage = async (message: string): Promise<{ response: string }> => {
//     const token = getToken();
//     if (!token) {
//         // Redirect to login or show an error message
//         alert("You are not logged in. Please log in to continue.");
//         window.location.href = "/auth"; // Redirect to login page
//         throw new Error("No token available");
//     }

//     const options: RequestInit = {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`,
//         },
//         body: JSON.stringify({ message }),
//     };

//     const response = await fetchData(`${API_URL}/chat`, options);
//     return response; // Return JSON response
// };

// Inline definition of sendMessage (commented out in the provided code)
export const sendMessage = async (message: string) => {
    const token = getToken();
    if (!token) {
        // Redirect to login or show an error message
        alert("You are not logged in. Please log in to continue.");
        window.location.href = "/auth"; // Redirect to login page
        throw new Error("No token available, user logged out.");
    }
    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch response from the server.");
    }
    
    return response.json(); // Return JSON response
  };

// Get token from localStorage
export const getToken = (): string | null => {
    return localStorage.getItem("token");
};