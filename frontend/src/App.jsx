import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import HomePage from './pages/HomePage';
import Register from './pages/Register'
import Login from './pages/Login';
import About from './pages/About';
import { Toaster } from 'react-hot-toast';

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
      </Routes>
    </Router>
  )
}
export default App;


