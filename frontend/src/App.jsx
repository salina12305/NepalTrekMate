import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './protected/ProtectedRoute';

import Home from './pages/Home';
import HomePage from './pages/HomePage';
import Register from './pages/Register'
import Login from './pages/Login';
import About from './pages/About';
import ProfileUpload from './pages/ProfileUpload';
import { Toaster } from 'react-hot-toast';
import ApproveAgents from './pages/ApproveAgents';
import AdminDashboard from './pages/AdminDashboard';

function App(){
  return (
    <Router>
      <Toaster/>
      <Routes>
        <Route path="/home" element={<Home/>}/>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path = "register" element = {<Register/>}/>
        <Route path = "uploadimage" element = {<ProfileUpload/>}/>
        <Route path = "approveagent" element = {<ApproveAgents/>}/>
        <Route path="/admindashboard" element={
          <ProtectedRoute allowedRoles={['admin']} element={<AdminDashboard/>}/>}/>
      </Routes>
    </Router>
  )
}
export default App;


