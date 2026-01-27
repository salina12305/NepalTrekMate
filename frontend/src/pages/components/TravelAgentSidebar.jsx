import React from 'react';
import { 
  LayoutDashboard, Users, UserCheck, Package, 
  BookOpen, Heart, LogOut 
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const TravelAgentSidebar = ({ type = 'admin' }) => {
  const isAdmin = type === 'admin'; 
  const backendUrl = import.meta.env.VITE_API_BASE_URL; 
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;
  
  const getProfileImageUrl = () => {
    if (!userData?.profileImage) return "/guide.png"; 
    if (userData.profileImage.startsWith('http')) return userData.profileImage;
    const cleanPath = userData.profileImage.startsWith('/') 
      ? userData.profileImage.substring(1) 
      : userData.profileImage;
    return `${backendUrl}/${cleanPath}`; 
    };

  const menuItems = isAdmin ? [
    { icon: <Users size={18}/>, label: "Users", active: true },
    { icon: <UserCheck size={18}/>, label: "Agents" },
    { icon: <Package size={18}/>, label: "Package" },
    { icon: <BookOpen size={18}/>, label: "Booking" },
  ] : [
    { icon: <LayoutDashboard size={18}/>, label: "Dashboard", path: "/travelagentdashboard" },
    { icon: <Package size={18}/>, label: "My Packages" },
    { icon: <BookOpen size={18}/>, label: "Booking" },
    { icon: <Users size={18}/>, label: "Guide" },
    { icon: <Heart size={18}/>, label: "Feedback" },
  ];

  return (
    <aside className="w-64 bg-[#E6F4F9] border-r border-cyan-100 p-6 flex flex-col h-screen sticky top-0">
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold mb-4">{isAdmin ? "Admin Panel" : "Travel Agent"}</h1>
        <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto mb-2 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
          <img 
            src={getProfileImageUrl()} 
            alt="Profile" 
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = "/ne.png"; }} 
          />
        </div>
        <h2 className="font-semibold text-sm">{userData?.fullName || (isAdmin ? "Admin User" : "Loading...")}</h2>
        <p className="text-[10px] text-slate-500 uppercase tracking-wider">
          {isAdmin ? "System Administrator" : "Senior Travel Agent"}
        </p>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {menuItems.map((item, index) => (
          <Link 
            key={index} 
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all no-underline ${
              isActive(item.path) 
                ? 'bg-white shadow-sm font-bold text-blue-600' 
                : 'hover:bg-white/40 text-slate-600'
            }`}
          >
            {item.icon}
            <span className="text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="pt-4 border-t border-cyan-200">
        <div 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-slate-600 cursor-pointer hover:text-red-500 transition-colors"
        >
          <LogOut size={18} />
          <span className="text-sm font-bold">Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default TravelAgentSidebar;