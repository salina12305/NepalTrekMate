
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import { Toaster } from 'react-hot-toast';
import EditUser from "./pages/EditUser";

function App(){
  return (
    <Router>
      <Toaster/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        
      </Routes>
    </Router>
  )
}
export default App


