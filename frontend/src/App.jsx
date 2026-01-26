import { BrowserRouter, Routes, Route } from "react-router-dom";
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminBooking from "./pages/AdminBooking";

import FeedbackPage from './pages/Feedback'; 

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
      
        <Route path="/feedback" element={<FeedbackPage />} />
        
        {/* Existing Routes */}
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/adminbooking" element={<AdminBooking />} />
       
      </Routes>
    </BrowserRouter>
  );
}