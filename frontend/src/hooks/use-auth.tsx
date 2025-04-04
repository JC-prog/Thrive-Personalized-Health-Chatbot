import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      // Verify the token (you can make an API call here to check if it's valid)
      fetch("/api/verify-token", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data.user);
          setIsLoading(false);
        })
        .catch(() => {
          setUser(null);
          setIsLoading(false);
        });
    } else {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  return { user, isLoading };
}

// Login Function
export function loginUser(token: string) {
  localStorage.setItem("authToken", token);
  // Redirect to dashboard
}

// Logout Function
export function logoutUser() {
  localStorage.removeItem("authToken");
  // Redirect to login page
}