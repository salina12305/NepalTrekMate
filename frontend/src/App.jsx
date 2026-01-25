import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './protected/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import HomePage from './pages/HomePage';
import Register from './pages/Register'
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
function App(){
  return (
    <Router>
      <Toaster/>
      <Routes>
        <Route path="/home" element={<Home/>}/>
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
export default App;


