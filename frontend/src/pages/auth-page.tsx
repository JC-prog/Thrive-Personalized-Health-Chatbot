const AuthPage = () => {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Hero Section */}
        <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-primary to-primary-dark text-white p-12 flex flex-col justify-center">
          <h1 className="text-3xl font-heading font-bold mb-4">HealthPredict</h1>
          <p className="text-xl mb-6">Personalized health risk assessment and recommendations</p>
          <ul className="space-y-3">
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              Assess your health risks
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              Get personalized nutrition plans
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              Custom workout recommendations
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              AI-powered food analysis
            </li>
          </ul>
        </div>
    
        {/* Auth Form */}
        <div className="w-full md:w-1/2 p-6 md:p-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold text-primary mb-2">HealthPredict</h1>
            <p className="text-slate-500">Personalized health risk assessment</p>
          </div>
    
          {/* Sign in Sign out tab */}
          <div className="tabs flex justify-center mb-8">
            <button className="tab tab-active px-4 py-2 w-1/2 text-white bg-primary hover:bg-primary-dark">Sign In</button>
            <button className="tab px-4 py-2 w-1/2 bg-gray-200 hover:bg-gray-300">Sign Up</button>
          </div>
    
          {/* Sign in form */}
          <div className="tab-content">
            <form className="space-y-6">
              <div className="form-item">
                <label htmlFor="username" className="text-sm text-slate-600">Username</label>
                <input type="text" id="username" placeholder="Enter your username" className="w-full p-3 border border-slate-300 rounded-md" />
              </div>
    
              <div className="form-item">
                <label htmlFor="password" className="text-sm text-slate-600">Password</label>
                <input type="password" id="password" placeholder="Enter your password" className="w-full p-3 border border-slate-300 rounded-md" />
              </div>
    
              <button type="submit" className="w-full py-3 text-white bg-primary rounded-md hover:bg-primary-dark">
                Sign In
              </button>
            </form>
          </div>
    
          {/* Sign up form */}
          <div className="tab-content hidden">
            <form className="space-y-6">
              <div className="form-item">
                <label htmlFor="name" className="text-sm text-slate-600">Name</label>
                <input type="text" id="name" placeholder="John Doe" className="w-full p-3 border border-slate-300 rounded-md" />
              </div>
    
              <div className="form-item">
                <label htmlFor="email" className="text-sm text-slate-600">Email</label>
                <input type="email" id="email" placeholder="john.doe@example.com" className="w-full p-3 border border-slate-300 rounded-md" />
              </div>
    
              <div className="form-item">
                <label htmlFor="username" className="text-sm text-slate-600">Username</label>
                <input type="text" id="username" placeholder="johndoe" className="w-full p-3 border border-slate-300 rounded-md" />
              </div>
    
              <div className="form-item">
                <label htmlFor="password" className="text-sm text-slate-600">Password</label>
                <input type="password" id="password" placeholder="Create a password" className="w-full p-3 border border-slate-300 rounded-md" />
              </div>
    
              <div className="form-item">
                <label htmlFor="confirmPassword" className="text-sm text-slate-600">Confirm Password</label>
                <input type="password" id="confirmPassword" placeholder="Confirm your password" className="w-full p-3 border border-slate-300 rounded-md" />
              </div>
    
              <button type="submit" className="w-full py-3 text-white bg-primary rounded-md hover:bg-primary-dark">
                Create Account
              </button>
            </form>
          </div>
    
          {/* Toggle Sign In / Sign Up */}
          <div className="mt-8 text-center text-sm text-slate-500">
            <p>Don't have an account? <a href="#" className="text-primary font-semibold hover:underline">Sign up</a></p>
            <p>Already have an account? <a href="#" className="text-primary font-semibold hover:underline">Sign in</a></p>
          </div>
        </div>
      </div>
    </div>
    
      );
    };
    
export default AuthPage;
    