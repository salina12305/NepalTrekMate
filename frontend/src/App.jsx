import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// --- Components & Handlers ---
import NotificationHandler from './pages/components/NotificationHandler';
import TravelAgentNotificationHandler from './pages/components/TravelAgentNotificationHandler';
import ProtectedRoute from './protected/ProtectedRoute';

// --- Pages ---
import Homepage from './pages/Homepage';
import About from './pages/About';
import UploadImage from './pages/ProfileUpload';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import ApproveAgents from './pages/ApproveAgents';
import ActivePartners from './pages/ActivePartners';
import AdminBooking from './pages/AdminBooking';
import AdminPackages from './pages/AdminPackages';
import AdminViewPackage from './pages/AdminViewPackage';

// Travel Agent Pages
import TravelAgentDashboard from './pages/TravelAgentDashboard';
import TravelAgentGuide from './pages/TravelAgentGuide';
import TravelAgentPackages from './pages/TravelAgentPackages';
import TravelAgentFeedback from './pages/TravelAgentFeedback';
import AddPackageForm from './pages/AddPackageForm';
import EditPackage from './pages/EditPackg';
import AgentBooking from './pages/AgentBooking';

// User & Guide Pages
import GuideDashboard from './pages/GuideDashboard';
import GuideTripDetails from './pages/GuideTripDetails';
import UserDashboard from './pages/UserDashboard';
import UserBooking from './pages/UserBooking';
import BookingPage from './pages/BookingPage';
import ViewPackageDetails from './pages/ViewPackageDetails';
import ViewPackage from './pages/ViewPackage';
import PastTreks from './pages/PastTreks';
import GuideMissions from './pages/GuideMissions';

function App() {
  // Get the user role from localStorage to decide which background handler to run
  const userRole = localStorage.getItem('role');

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    {/* 1. Global Toaster UI for all notifications */}
    <Toaster 
      position="top-right" 
      reverseOrder={false} 
      toastOptions={{
        style: {
          borderRadius: '12px',
          background: '#fff',
          color: '#333',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        },
      }}
    />
    
    {/* 2. Conditional Notification Handlers based on Role */}
    {userRole === 'admin' && <NotificationHandler />}
    {userRole === 'travelagent' && <TravelAgentNotificationHandler />}

      <Routes>

        {/* --- Public Routes --- */}
        <Route path="/" element={<Homepage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/uploadimage" element={<UploadImage />} /> 

        {/* --- Admin Protected Routes --- */}
        <Route path="/admindashboard" element={
          <ProtectedRoute allowedRoles={['admin']} element={<AdminDashboard />} />
        } />
        <Route path="/adminusers" element={<AdminUsers />} />
        <Route path="/approveagents" element={<ApproveAgents />} />
        <Route path="/activepartners" element={<ActivePartners />} />
        <Route path="/adminbookings" element={<AdminBooking />} />
        <Route path="/adminpackages" element={<AdminPackages />} />
        <Route path="/admin/view-package/:id" element={<AdminViewPackage />} />

        {/* --- Travel Agent Protected Routes --- */}
        <Route path="/travelagentdashboard" element={
          <ProtectedRoute allowedRoles={['travelagent']} element={<TravelAgentDashboard />} />
        } />
        <Route path="/agentguide" element={<TravelAgentGuide />} /> 
        <Route path="/agentpackages" element={<TravelAgentPackages />} />
        <Route path="/agentfeedback" element={<TravelAgentFeedback />} />
        <Route path="/agentapackage" element={<AddPackageForm />} />
        <Route path="/agentbookings" element={<AgentBooking />} />
        <Route path="/agent/edit-package/:id" element={<EditPackage />} />


        {/* --- User/Guide Shared Routes --- */}
        <Route path="/guidedashboard" element={<GuideDashboard />} />
        <Route path="/guide/trip-details/:id" element={<GuideTripDetails />} />
        <Route path="/userdashboard" element={<UserDashboard />} /> 
        <Route path="/userbooking" element={<UserBooking />} />
        <Route path="/booking" element={<BookingPage />} />

        {/* --- User Package View (The details page) --- */}
         <Route path="/agent/package-details/:id" element={<ViewPackageDetails />} />
        <Route path="/view-package/:id" element={<ViewPackage />} />
        <Route path="/guide/past-treks" element={<PastTreks />} />
        <Route path="/guide/tours" element={<GuideMissions />} />
      </Routes>
    </Router>
  )
}

export default App;