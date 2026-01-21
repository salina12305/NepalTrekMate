import React, { useState } from "react";
import { Link } from 'react-router-dom'; 

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reset link sent to:", email);
    
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col font-sans">
      
      <nav className="w-full flex items-center p-6">
        <div className="flex items-center gap-2">
          <img src="/logo.png" 
            alt="Logo" 
            className="h-12 w-auto" 
          />
          <span className="text-2xl font-bold text-gray-800 tracking-tight">
            Nepal TrekMate
          </span>
        </div>
      </nav>

      <div className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border border-gray-100 shadow-2xl rounded-3xl p-10">
 
          <div className="text-center mb-8">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg 
                className="w-8 h-8 text-blue-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" 
                />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">Forgot Password?</h2>
            <p className="text-gray-500 mt-2 text-sm">
              No worries! Enter the email address associated with your account and we'll send a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md active:scale-[0.98] focus:ring-4 focus:ring-blue-200"
            >
              Send Reset Link
            </button>
          </form>

          <div className="mt-8 text-center">

            <Link 
              to="/login" 
              className="text-sm font-bold text-blue-600 hover:text-blue-800 transition flex items-center justify-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}