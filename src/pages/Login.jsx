import React, { useState } from 'react';

// A simple SVG logo that resembles the one in the screenshot
const SamuraiLogo = () => (
  <svg className="w-10 h-10 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15V3m0 12l-4-4m4 4l4-4M3 17h18v2H3zM5 15h14" />
  </svg>
);

// SVG icon for showing the password
const EyeIcon = ({...props}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

// SVG icon for hiding the password
const EyeOffIcon = ({...props}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
);


function Login() {
  // State to toggle between Sign In and Sign Up forms
  const [isSignUp, setIsSignUp] = useState(false);
  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    // Main container with a dark background and centered content
    <div className="bg-black text-gray-200 min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Background decorative elements for a futuristic feel */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-red-900/20 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-900/20 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-4000"></div>

      {/* The main login/signup card */}
      <div className="bg-[#1c1c1c] p-8 rounded-2xl shadow-2xl shadow-red-900/20 w-full max-w-md z-10 border border-gray-800">
        <div className="text-center mb-8">
            <div className="inline-block p-2 bg-gray-900 rounded-full mb-4 border border-gray-700">
               <SamuraiLogo />
            </div>
          <h1 className="text-4xl font-bold text-white">
            <span className="text-red-500">侍</span> Portal
          </h1>
          <p className="text-gray-400 mt-2">Honor your path, warrior</p>
        </div>

        {/* Toggle buttons for Sign In and Join Us */}
        <div className="flex bg-gray-900/50 p-1 rounded-lg mb-6 border border-gray-700">
          <button
            onClick={() => setIsSignUp(false)}
            className={`w-1/2 py-2 rounded-md transition-colors duration-300 font-semibold ${!isSignUp ? 'bg-red-600 text-white shadow-md shadow-red-500/20' : 'hover:bg-gray-700/50 text-gray-400'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`w-1/2 py-2 rounded-md transition-colors duration-300 font-semibold ${isSignUp ? 'bg-red-600 text-white shadow-md shadow-red-500/20' : 'hover:bg-gray-700/50 text-gray-400'}`}
          >
            Join Us
          </button>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          {/* Conditional rendering for the "Name" field in the Sign Up form */}
          {isSignUp && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="name">
                Name
              </label>
              <input
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                type="text"
                id="name"
                placeholder="Enter your warrior name"
              />
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              type="email"
              id="email"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder={isSignUp ? "Create a strong password" : "Enter your password"}
            />
             <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-400 hover:text-white">
                {showPassword ? <EyeOffIcon/> : <EyeIcon/>}
             </button>
          </div>

          {/* Conditional rendering for the "Confirm Password" field */}
          {isSignUp && (
            <div className="mb-6 relative">
              <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="confirm-password">
                Confirm Password
              </label>
              <input
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirm-password"
                placeholder="Confirm your password"
              />
               <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-400 hover:text-white">
                {showConfirmPassword ? <EyeOffIcon/> : <EyeIcon/>}
             </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-600/30"
          >
            {isSignUp ? 'Begin Training' : 'Enter the Dojo'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-8 italic">
          "The way of the warrior is found in honor" - Ancient Samurai Proverb
        </p>
      </div>
    </div>
  );
}

export default Login;
