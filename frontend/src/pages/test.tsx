import { useState } from "react";

const TestPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || (!isLogin && !formData.confirmPassword)) {
      alert("Please fill in all fields.");
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Replace with your API logic
    if (isLogin) {
      console.log("Login", formData);
    } else {
      console.log("Register", formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-semibold text-center text-indigo-700 mb-6">
          {isLogin ? "Welcome Back" : "Create an Account"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          )}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="mt-4 text-sm text-center text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 font-medium hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
