
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminHeaderStatCard from './components/AdminHeaderStatCard';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  getAllUsersApi, 
  getUserById, 
  getPendingRequestsApi, 
  getAllBookingsApi 
} from '../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  
  // --- STATES ---
  const [users, setUsers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNoti, setShowNoti] = useState(false);
  
  // Badge logic: store the timestamp of when the user last opened the drawer
  const [lastViewedTime, setLastViewedTime] = useState(
    localStorage.getItem('adminNotiLastViewed') || new Date(0).toISOString()
  );

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [tripStats, setTripStats] = useState({
    total: 0, confirmed: 0, processing: 0, canceled: 0
  });

  const [dynamicChartData, setDynamicChartData] = useState([
    { name: 'Sun', rev: 0 }, { name: 'Mon', rev: 0 }, { name: 'Tue', rev: 0 },
    { name: 'Wed', rev: 0 }, { name: 'Thu', rev: 0 }, { name: 'Fri', rev: 0 }, { name: 'Sat', rev: 0 }
  ]);

  // --- HELPER: TIME AGO ---
  const formatTimeAgo = (date) => {
    if (!date) return "";
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  // Helper for status sync
  const isSuccessful = (status) => {
    const s = String(status || "").toLowerCase();
    return s.includes('confirm') || s.includes('complete') || s.includes('finish');
  };

  // --- FETCH LOGIC ---
  const fetchDashboardData = useCallback(async () => {
    try {
      const userId = localStorage.getItem('userId');
      const [profileRes, usersRes, pendingRes, bookingsRes] = await Promise.all([
        userId ? getUserById(userId) : Promise.resolve({ data: null }),
        getAllUsersApi(),
        getPendingRequestsApi(),
        getAllBookingsApi()
      ]);
  
      if (profileRes?.data) setUserData(profileRes.data);
      
      const allUsers = usersRes.data?.users || usersRes.data || [];
      setUsers(allUsers);
      const requests = pendingRes.data?.requests || pendingRes.data || [];
      setPendingRequests(requests);
  
      const allBookings = bookingsRes.data?.data || bookingsRes.data || [];

      const confirmedList = allBookings.filter(b => isSuccessful(b.status));
      
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const revenueMap = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
      
      confirmedList.forEach(booking => {
        const rawDate = booking.createdAt || booking.bookingDate;
        if (rawDate) {
          const dayName = days[new Date(rawDate).getDay()];
          revenueMap[dayName] += (Number(booking.totalPrice) || 0);
        }
      });
  
      setDynamicChartData(days.map(day => ({ name: day, rev: revenueMap[day] })));
      setTotalRevenue(confirmedList.reduce((acc, curr) => acc + (Number(curr.totalPrice) || 0), 0));
  
      setTripStats({
        total: allBookings.length,
        confirmed: confirmedList.length, // Now represents total successful trips
        processing: allBookings.filter(b => String(b.status || "").toLowerCase().includes('pend')).length,
        canceled: allBookings.filter(b => String(b.status || "").toLowerCase().includes('cancel')).length
      });
  
    } catch (error) {
      console.error("Dashboard Sync Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowNoti(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [fetchDashboardData]);

  // --- NOTIFICATION MIXER ---
  const allNotifications = [
    ...pendingRequests.map(req => ({
      id: req._id,
      time: req.createdAt,
      title: "Agent Approval Pending",
      desc: `${req.name || 'New Agent'} applied.`,
      icon: "💼",
      link: "/approveagents"
    })),
    ...users
      .filter(u => (new Date() - new Date(u.createdAt)) < 172800000) // Last 48h
      .map(u => ({
        id: u._id,
        time: u.createdAt,
        title: "New User Registered",
        desc: `${u.name || u.email} joined.`,
        icon: "✨",
        link: "/users"
      }))
  ].sort((a, b) => new Date(b.time) - new Date(a.time));

  // --- BADGE LOGIC ---
  // Count only notifications that are NEWER than the last time we opened the dropdown
  const unreadCount = allNotifications.filter(n => new Date(n.time) > new Date(lastViewedTime)).length;

  const handleOpenNotifications = () => {
    setShowNoti(!showNoti);
    if (!showNoti) {
      // User is opening the dropdown: Set the view time to "Now"
      const now = new Date().toISOString();
      setLastViewedTime(now);
      localStorage.setItem('adminNotiLastViewed', now);
      fetchDashboardData();
    }
  };

  const getWidth = (count) => {
    if (tripStats.total === 0) return "0%";
    return `${(count / tripStats.total) * 100}%`;
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <AdminSidebar userData={userData} />
      
      <main className="flex-1 p-8 overflow-y-auto relative">

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm">Welcome back! Here is your real-time overview.</p>
        </div>
        
        {/* --- NOTIFICATION BUTTON --- */}
        <div className="relative" ref={dropdownRef}>
            <button 
              onClick={handleOpenNotifications}
              className="relative p-3 bg-white rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-blue-300 transition-all focus:outline-none group"            >
              <span className="text-xl group-hover:scale-110 transition-transform inline-block">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* DROPDOWN MENU */}
            {showNoti && (
              <div className="absolute top-14 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[60] overflow-hidden">
                <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                  <h4 className="font-bold text-slate-800 m-0 text-sm">Notifications</h4>
                  <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase">
                    {allNotifications.length} Total
                  </span>
                </div>
                
                <div className="max-h-[350px] overflow-y-auto">
                  {allNotifications.length > 0 ? (
                    allNotifications.map((noti, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => { setShowNoti(false); navigate(noti.link); }}
                        className="p-4 border-b border-slate-50 hover:bg-blue-50/50 transition-colors cursor-pointer flex gap-3 items-start"
                      >
                        <div className="w-9 h-9 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-lg shadow-sm">{noti.icon}</div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                             <p className="text-sm font-bold text-slate-800 m-0">{noti.title}</p>
                             <span className="text-[9px] text-slate-400">{formatTimeAgo(noti.time)}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 m-0 leading-tight mt-0.5">{noti.desc}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center">
                      <p className="text-slate-400 text-xs m-0">No recent notifications</p>
                    </div>
                  )}
                </div>
                
                <div className="p-2 border-t border-slate-50">
                  <button 
                    onClick={() => { setShowNoti(false); navigate('/approveagents'); }}
                    className="w-full py-2 text-center text-[11px] font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Manage All Requests
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <AdminHeaderStatCard 
          loading={loading}
          stats={{
            totalUsers: users.length, 
            activeAgents: users.filter(u => u.role === 'travelagent' && u.status === 'approved').length,
            pending: pendingRequests.length,
            revenue: `Rs. ${totalRevenue.toLocaleString()}`
          }}
        />

        {/* --- GRAPH --- */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8 mt-6">
          <h3 className="font-bold text-slate-800 m-0 mb-8 text-lg">Revenue Trends</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dynamicChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} tickFormatter={(v) => `Rs.${v}`} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="rev" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 3 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- TRIP STATUS --- */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-8">
          <div className="flex items-center gap-4 border-r border-slate-100 pr-8">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl">🏔️</div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total Trips</p>
              <h3 className="text-2xl font-black text-slate-800 m-0">{tripStats.total}</h3>
            </div>
          </div>
          <div className="flex-1">
            <div className="h-4 w-full bg-slate-100 rounded-full flex overflow-hidden mb-4">
              <div style={{ width: getWidth(tripStats.confirmed) }} className="bg-emerald-400 transition-all duration-700"></div>
              <div style={{ width: getWidth(tripStats.processing) }} className="bg-blue-400 transition-all duration-700"></div>
              <div style={{ width: getWidth(tripStats.canceled) }} className="bg-rose-400 transition-all duration-700"></div>
            </div>
            <div className="flex gap-8 text-[11px] font-extrabold text-slate-500 uppercase">
               <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div> Confirmed {tripStats.confirmed}</span>
               <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div> Processing {tripStats.processing}</span>
               <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div> Canceled {tripStats.canceled}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;