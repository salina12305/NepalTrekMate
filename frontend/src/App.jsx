import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// --- Components & Handlers ---
import NotificationHandler from './pages/components/NotificationHandler';
import TravelAgentNotificationHandler from './pages/components/TravelAgentNotificationHandler';
import ProtectedRoute from './protected/ProtectedRoute';

// --- Pages ---
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import Login from './pages/Login';
import About from './pages/About';
import ProfileUpload from './pages/ProfileUpload';
import ApproveAgents from './pages/ApproveAgents';
import AdminUsers from './pages/AdminUsers';
import AdminDashboard from './pages/AdminDashboard';
import TravelAgentDashboard from './pages/TravelAgentDashboard';
import TravelAgentPackages from './pages/TravelAgentPackages';
import AdminBooking from './pages/AdminBooking';
import AddPackageForm from './pages/AddPackageForm';


import FeedbackPage from './pages/Feedback'; 

export default function App() {
  return (
    <Router>
      <Toaster/>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/register" element = {<Register/>}/>
        <Route path= "/uploadimage" element = {<ProfileUpload/>}/>
        <Route path="/approveagents" element={<ApproveAgents />} />
        <Route path="/adminusers" element={<AdminUsers/>}/>
        <Route path="/adminbookings" element={<AdminBooking />} />
        <Route path="/admindashboard" element={
          <ProtectedRoute allowedRoles={['admin']} element={<AdminDashboard/>}/>}/>
      <Route path="/forgotpassword" element={<ForgotPassword/>}/>
      <Route path="/resetpassword" element={<ResetPassword/>}/>
      <Route path="/travelagentdashboard" element={<TravelAgentDashboard/>}/> 
      <Route path="/agentapackage" element={<AddPackageForm />} />
      <Route path="/agentpackages" element={<TravelAgentPackages/>}/>
      </Routes>
    </Router>
  )
}


