import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Package, 
  BookOpen, 
  LogOut 
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminSidebar = () => {
  const location = useLocation(); 
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_API_BASE_URL;

  const getProfileImageUrl = () => {
    if (!userData?.profileImage) return "/ne.png";
    if (userData.profileImage.startsWith('http')) return userData.profileImage;
    const cleanPath = userData.profileImage.startsWith('/') ? userData.profileImage.substring(1) : userData.profileImage;
    return `${backendUrl}/${cleanPath}`; 
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token-37c");
      localStorage.removeItem("userId");
      toast.success("Logged out successfully", { icon: '👋' });
      navigate("/");
    }
  };

  const menuItems = [
    { icon: <LayoutDashboard size={18}/>, label: "Dashboard", path: "/admindashboard" },
    { icon: <Users size={18}/>, label: "Users", path: "/adminusers"},
    { icon: <UserCheck size={18}/>, label: "Agents", path: "/approveagents" },
    { icon: <Package size={18}/>, label: "Package", path: "/adminpackages" },
    { icon: <BookOpen size={18}/>, label: "Booking", path: "/adminbookings" },
  ];

  return (
    <aside className="w-64 bg-[#EAF7FC] border-r border-[#D1E9F2] p-6 flex flex-col h-screen sticky top-0">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold mb-6 text-slate-800 tracking-tight">Admin Panel</h2>
        <div className="w-16 h-16 bg-white rounded-full mx-auto mb-3 flex items-center justify-center shadow-sm border overflow-hidden">
          <img 
            src={getProfileImageUrl()} 
            alt="Admin" 
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = "/ne.png"; }}
          />
        </div>
        <h3 className="font-bold text-base text-slate-800">{userData?.fullName || "Loading..."}</h3>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {menuItems.map((item, index) => (
          <Link key={index} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === item.path ? 'bg-white shadow-sm text-cyan-600 font-bold' : 'text-slate-600 hover:bg-white/50'}`}>
            {item.icon} <span className="text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>


      <div className="pt-4 border-t border-cyan-200/60">
      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-red-500 transition-colors group font-bold text-sm">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;