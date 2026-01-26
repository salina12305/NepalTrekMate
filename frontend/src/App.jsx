import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register'
import AdminPackages from './pages/AdminPackages';
import { Toaster } from "react-hot-toast";


function App(){
  return (
    <Router>
      <Toaster/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path = "register" element = {<Register/>}/>
      <Route path = "package" element = {<AdminPackages/>}/>
      </Routes>
    </Router>
  )
}
export default App


