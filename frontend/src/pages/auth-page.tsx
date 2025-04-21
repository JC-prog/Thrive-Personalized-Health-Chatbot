import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import AuthToast from "../components/Toast/AuthToast";
import { FormData, ToastProps } from "../types/form";
import { login, register } from "../api/auth-api";
import { useAuth } from '../hooks/auth-context';
import { useLocation } from "wouter";

const AuthPage = () => {
  const { loginContext} = useAuth();
  const [location, setLocation] = useLocation();
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [toast, setToast] = useState<ToastProps>({
    message: "",
    type: "info",
    isVisible: false
  });

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type, isVisible: true });
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!formData.username || !formData.password) {
      showToast("Please fill in all required fields", "error");
      return;
    }
  
    if (!isSignIn && formData.password !== formData.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
  
    try {
      if (isSignIn) {
        const res = await login({
          username: formData.username,
          password: formData.password,
        });
        loginContext(res.access_token); 
        showToast("Successfully logged in", "success");
        setLocation("/");

      } else {
        await register({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        showToast("Account created successfully", "success");
        setIsSignIn(true);
      }
    } catch (err: any) {
      console.error("Error during authentication:", err);

      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.message || 
                          err.message || 
                          "Something went wrong";

      showToast(errorMessage, "error");
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6">
      {/* Toast Component */}
      <AuthToast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.isVisible} 
      />
      
      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        {/* Hero Section */}
        <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-12 flex flex-col justify-center relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white"></div>
            <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-white"></div>
          </div>
          
          <div className="relative z-10">
            <h1 className="text-4xl font-heading font-bold mb-4">Thrive</h1>
            <p className="text-xl mb-8 text-indigo-100">Personalized health risk assessment and recommendations</p>
            <ul className="space-y-4">
              {[
                "Assess your health risks",
                "Get personalized nutrition plans",
                "Custom workout recommendations",
                "AI-powered food analysis",
              ].map((item, i) => (
                <li key={i} className="flex items-center text-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-indigo-200" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Auth Form */}
        <div className="w-full md:w-1/2 p-6 md:p-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold text-indigo-600 mb-2">Join Us</h1>
            <p className="text-slate-500">Personalized health risk assessment</p>
          </div>

          {/* Toggle */}
          <div className="tabs flex justify-center mb-8">
            <button
              className={`tab px-4 py-3 w-1/2 rounded-l-lg font-medium transition-all duration-200 ${
                isSignIn 
                  ? "bg-indigo-600 text-white shadow-md" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setIsSignIn(true)}
            >
              Sign In
            </button>
            <button
              className={`tab px-4 py-3 w-1/2 rounded-r-lg font-medium transition-all duration-200 ${
                !isSignIn 
                  ? "bg-indigo-600 text-white shadow-md" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setIsSignIn(false)}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isSignIn && (
              <>
                <div className="form-item">
                  <label htmlFor="name" className="text-sm font-medium text-slate-700 mb-1 block">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="John Doe" 
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 outline-none" 
                  />
                </div>
                <div className="form-item">
                  <label htmlFor="email" className="text-sm font-medium text-slate-700 mb-1 block">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="john@example.com" 
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 outline-none" 
                  />
                </div>
              </>
            )}
            <div className="form-item">
              <label htmlFor="username" className="text-sm font-medium text-slate-700 mb-1 block">Username</label>
              <input 
                type="text" 
                id="username" 
                value={formData.username} 
                onChange={handleChange} 
                placeholder="Enter your username" 
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 outline-none" 
              />
            </div>
            <div className="form-item">
              <label htmlFor="password" className="text-sm font-medium text-slate-700 mb-1 block">Password</label>
              <input 
                type="password" 
                id="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="Enter your password" 
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 outline-none" 
              />
            </div>
            {!isSignIn && (
              <div className="form-item">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700 mb-1 block">Confirm Password</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  placeholder="Confirm your password" 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 outline-none" 
                />
              </div>
            )}
            <button 
              type="submit" 
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-indigo-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-lg mt-6"
            >
              {isSignIn ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Toggle Link */}
          <div className="mt-8 text-center text-slate-600">
            {isSignIn ? (
              <p>
                Don't have an account?{' '}
                <button className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline transition-all duration-200" onClick={() => setIsSignIn(false)}>
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline transition-all duration-200" onClick={() => setIsSignIn(true)}>
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;