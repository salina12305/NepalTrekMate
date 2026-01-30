import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById } from '../services/api';
import AdminSidebar from './components/AdminSidebar';
import { 
  ArrowLeft, Mail, Calendar, Shield, 
  MapPin, Sparkles, Target, 
  Activity, Fingerprint, Phone 
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // States
  const [user, setUser] = useState(null); // The person being viewed
  const [adminData, setAdminData] = useState(null); // The logged-in admin for sidebar
  const [loading, setLoading] = useState(true);

  // --- FETCH ADMIN DATA (For Sidebar) ---
  const fetchAdminProfile = useCallback(async () => {
    const adminId = localStorage.getItem('userId');
    if (adminId) {
      try {
        const res = await getUserById(adminId);
        // Set adminData specifically for the Sidebar
        setAdminData(res.data.user || res.data);
      } catch (err) {
        console.error("Admin Sidebar Fetch Error:", err);
      }
    }
  }, []);

  // --- FETCH VIEWED USER DATA ---
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        // Run both fetches: Admin for sidebar and ID for details
        const [userRes] = await Promise.all([
          getUserById(id),
          fetchAdminProfile()
        ]);
        
        setUser(userRes.data.user || userRes.data);
      } catch (err) {
        toast.error("User not found or connection error");
        navigate('/adminusers');
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [id, navigate, fetchAdminProfile]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        <p className="text-slate-500 font-bold animate-pulse text-xs uppercase tracking-widest">Fetching Profile...</p>
      </div>
    </div>
  );

  return (
    <div className="flex bg-slate-50 min-h-screen">
      {/* 1. PASS ADMIN DATA TO SIDEBAR */}
      <AdminSidebar userData={adminData} />
      
      <main className="flex-1 p-8">
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center gap-2 text-slate-400 hover:text-slate-800 mb-8 font-bold transition-all"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          BACK TO DIRECTORY
        </button>

        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* --- PACKAGE 1: THE IDENTITY CARD --- */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
            <div className="h-44 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600"></div>
            <div className="px-10 pb-10">
              <div className="relative flex justify-between items-end -mt-20 mb-8">
                
                {/* 2. FETCH VIEWED USER IMAGE */}
                <div className="p-2 bg-white rounded-[2.5rem] shadow-2xl">
                  <img 
                    src={user?.profileImage 
                        ? `http://localhost:3000${user.profileImage}` 
                        : "/ne.png"
                    } 
                    className="w-44 h-44 rounded-[2rem] object-cover border-4 border-white"
                    alt="Profile"
                    onError={(e) => { e.target.src = "/ne.png"; }}
                  />
                </div>

                <div className="flex gap-3 pb-4">
                  <div className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl text-xs font-black tracking-widest uppercase shadow-lg">
                    {user?.role || 'Guest'}
                  </div>
                  <div className={`px-6 py-2.5 rounded-2xl text-xs font-black tracking-widest uppercase shadow-md ${
                    user?.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {user?.status || 'Pending'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                  <h1 className="text-5xl font-black text-slate-800 mb-2 tracking-tight">{user?.fullName}</h1>
                  <div className="flex flex-wrap gap-4 text-slate-500 mb-8">
                    <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl text-sm font-bold border border-slate-100">
                      <Mail size={14} className="text-cyan-500"/> {user?.email}
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl text-sm font-bold border border-slate-100">
                      <Fingerprint size={14} className="text-indigo-500"/> ID: {user?._id?.slice(-8)}
                    </span>
                  </div>
                  
                  {/* Creative "Context" section */}
                  <div className="p-6 bg-cyan-50/30 rounded-[2rem] border border-cyan-100">
                    <h4 className="flex items-center gap-2 text-cyan-600 font-black text-xs uppercase tracking-widest mb-3">
                      <Sparkles size={16} /> User Narrative
                    </h4>
                    <p className="text-slate-600 leading-relaxed italic">
                      {user?.fullName} is currently registered as a {user?.role}. Since joining, they have engaged with our platform features {user?.bookings?.length > 0 ? `including ${user.bookings.length} successful bookings.` : 'to explore upcoming travel opportunities.'}
                    </p>
                  </div>
                </div>

                {/* Vertical Data Stats */}
                <div className="space-y-4">
                  <StatRow icon={<Calendar className="text-purple-500"/>} label="Member Since" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' }) : "N/A"} />
                  <StatRow icon={<Phone className="text-rose-500"/>} label="Phone Number" value={user?.phoneNumber || "Not Provided"} />
                  <StatRow icon={<MapPin className="text-emerald-500"/>} label="User Location" value={user?.address || "Global Traveler"} />
                </div>
              </div>
            </div>
          </div>

          {/* --- PACKAGE 2: INTERACTION GRID --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                <Target className="text-orange-500" /> Platform Metrics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-slate-50 rounded-3xl text-center border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Bookings</p>
                  <p className="text-4xl font-black text-slate-800">{user?.bookings?.length || "0"}</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl text-center border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Revenue</p>
                  <p className="text-4xl font-black text-slate-800">0</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white">
              <h3 className="text-xl font-black mb-6">Security & Management</h3>
              <div className="flex flex-col gap-3">
                <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
                  <Shield size={18} className="text-cyan-400" /> Adjust Permissions
                </button>
                <button className="w-full py-4 bg-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl font-bold transition-all border border-rose-500/30">
                  Suspend User Account
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

// Reusable Stat Component
const StatRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all cursor-default">
    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
      {icon}
    </div>
    <div className="overflow-hidden">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="font-bold text-slate-700 truncate">{value}</p>
    </div>
  </div>
);

export default AdminUserDetails;