import React from 'react';
import { LayoutDashboard, History, LogOut, Star, ShieldCheck, MessageSquare } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const GuideSidebar = ({ userData, averageRating, totalReviews }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const backendUrl = "http://localhost:3000";

  // Profile Image
  const getProfileImageUrl = () => {
    if (!userData?.profileImage) return "/ne.png";
    if (userData.profileImage.startsWith('http')) return userData.profileImage;
    const cleanPath = userData.profileImage.startsWith('/') ? userData.profileImage.substring(1) : userData.profileImage;
    return `${backendUrl}/${cleanPath}`; 
  };

  const handleLogout = () => {
    toast((t) => (
      <div className="bg-white p-4 rounded-2xl shadow-2xl border border-slate-100">
        <p className="text-slate-800 font-bold mb-3">Leaving Basecamp?</p>
        <div className="flex gap-2">
          <button onClick={() => toast.dismiss(t.id)} className="bg-slate-100 px-4 py-2 rounded-xl text-sm font-bold">Stay</button>
          <button onClick={() => { localStorage.clear(); navigate("/"); toast.dismiss(t.id); }} className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-bold">Logout</button>
        </div>
      </div>
    ));
  };

  return (
    <aside className="w-72 bg-white border-r border-slate-100 p-8 flex flex-col h-screen sticky top-0">
      <div className="mb-10 text-center">
        <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="absolute inset-0 bg-cyan-200 rounded-full animate-pulse blur-md opacity-50"></div>
            <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-100">
                <img src={getProfileImageUrl()} alt="Profile" className="w-full h-full object-cover" onError={(e)=>e.target.src="/ne.png"}/>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-white p-1.5 rounded-full border-2 border-white">
                <ShieldCheck size={14} />
            </div>
        </div>
        <h3 className="font-black text-slate-800 text-lg leading-tight mb-1">{userData?.fullName || "Guide"}</h3>
        <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-amber-50 rounded-full w-fit mx-auto border border-amber-100">
          <Star size={14} className="text-amber-500 fill-amber-500" />
          <span className="text-xs font-black text-amber-700">
            {totalReviews > 0 ? `${averageRating} (${totalReviews})` : "Verified Guide"}
          </span>
        </div>
      </div>

      <nav className="space-y-2 flex-1">
        {[
          { icon: <LayoutDashboard size={20}/>, label: "Mission Control", path: "/guidedashboard" },
          { icon: <History size={20}/>, label: "Past Treks", path: "/guide/history" },
          { icon: <MessageSquare size={20}/>, label: "Guest Reviews", path: "/guide/feedback" },
        ].map((item) => (
          <Link key={item.path} to={item.path} className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-sm ${
            location.pathname === item.path ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
          }`}>
            {item.icon} {item.label}
          </Link>
        ))}
      </nav>

      <button onClick={handleLogout} className="mt-auto flex items-center gap-4 px-5 py-4 text-slate-400 hover:text-red-500 transition-colors font-bold text-sm">
        <LogOut size={20} /> Sign Out
      </button>
    </aside>
  );
};

export default GuideSidebar;