
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import { Toaster } from 'react-hot-toast';
import About from './pages/About';

function App(){
  return (
    <Router>
      <Toaster/>
      <Routes>
        <Route path="/home" element={<Home/>}/>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/about" element={<About/>}/>
      </Routes>
    </Router>
  )
}
export default App;


