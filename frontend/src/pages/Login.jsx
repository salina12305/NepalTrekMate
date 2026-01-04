import React, { useState } from "react";

export default function Login() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    console.log(formData); 
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-6">

      {/* Navbar */}
      <nav className="w-full flex justify-between items-center py-4 px-6 bg-white shadow-sm">
        <div className="flex items-center gap-2 text-[26px] font-bold">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-[75px] w-auto"
          />
          <span>Nepal TrekMate</span>
        </div>

        <div className="flex items-center space-x-6">
          <a href="#" className="hover:text-blue-600">Home</a>
          <a href="#" className="hover:text-blue-600">About</a>
         
        </div>
      </nav>

      {/* Login Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white shadow-xl mt-10 p-8 rounded-2xl w-full max-w-lg border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Login to your account
        </p>

        <div className="space-y-4">

          {/* Email */}
          <div>
            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@gmail.com"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Passwords */}
          
            <div>
              <label className="block mb-2 font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••••"
              />
            </div>


          {/* Role */}
          <div>
            <label className="block mb-2 font-medium">Login As</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="travelagent">Travel Agent</option>
              <option value="guide">Guide</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold mt-6 hover:bg-blue-700 transition-all shadow-md active:scale-[0.98]"
        >
          Sign In
        </button>

        <p className="text-center mt-6 text-gray-600 text-sm">
          Don't have an account{" "}
          <a href="#" className="text-blue-600 font-semibold hover:underline">
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
}