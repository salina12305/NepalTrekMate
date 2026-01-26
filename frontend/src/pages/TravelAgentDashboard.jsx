
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TravelAgentSidebar from './components/TravelAgentSidebar';
import TravelAgentHeaderStatCard from './components/TravelAgentHeaderStatCard';
import TravelAgentNotificationHandler from './components/TravelAgentNotificationHandler';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { getUserById, getAllPackagesApi, getAllBookingsApi } from '../services/api';


const TravelAgentDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [tripStats, setTripStats] = useState({
    total: 0,
    confirmed: 0,
    processing: 0,
    canceled: 0
  });

  // --- Notification Specific States & Refs ---
  const [showNoti, setShowNoti] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]); 
  const dropdownRef = useRef(null);

  const handleOpenNotifications = () => {
    setShowNoti(!showNoti);
  };

  // Matching Admin's dynamic chart state structure
  const [dynamicChartData, setDynamicChartData] = useState([
    { name: 'Sun', rev: 0 }, { name: 'Mon', rev: 0 }, { name: 'Tue', rev: 0 },
    { name: 'Wed', rev: 0 }, { name: 'Thu', rev: 0 }, { name: 'Fri', rev: 0 }, { name: 'Sat', rev: 0 }
  ]);

 const fetchDashboardData = useCallback(async () => {
    try {
      const userId = localStorage.getItem('userId');
      const [userRes, pkgRes, bookingRes] = await Promise.all([
        userId ? getUserById(userId) : Promise.resolve({ data: null }),
        getAllPackagesApi(), 
        getAllBookingsApi()  
      ]);

      if (userRes?.data) setUserData(userRes.data);
      
      const allPackages = pkgRes.data?.packages || pkgRes.data || [];
      setPackages(allPackages);
      
      const allBookings = bookingRes.data?.data || bookingRes.data || [];
      const confirmedList = allBookings.filter(b => 
        String(b.status || "").toLowerCase().includes('confirm')
      );

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
        confirmed: confirmedList.length,
        processing: allBookings.filter(b => String(b.status || "").toLowerCase().includes('pend')).length,
        canceled: allBookings.filter(b => String(b.status || "").toLowerCase().includes('cancel')).length
      });

    } catch (err) { 
      console.error("Dashboard Sync Error:", err); 
    } finally { 
      setLoading(false); 
    }
  }, []);

  useEffect(()=> {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const getWidth = (count) => {
    if (tripStats.total === 0) return "0%";
    return `${(count / tripStats.total) * 100}%`;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <TravelAgentNotificationHandler />

      <TravelAgentSidebar type="agent" userData={userData} />
      <main className="flex-1 p-8">

        {/* --- NOTIFICATION BAR --- */}
        <div className="flex justify-end items-center mb-6 relative" ref={dropdownRef}>
          <div className="relative">
            <button 
              onClick={handleOpenNotifications}
              className="relative p-3 bg-white rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-all cursor-pointer z-50 focus:outline-none"
            >
              <span className="text-xl">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNoti && (
              <div className="absolute top-14 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[60] overflow-hidden">
                <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                  <h4 className="font-bold text-slate-800 m-0 text-sm">Agent Notifications</h4>
                </div>
                <div className="max-h-[350px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => { setShowNoti(false); navigate(n.link); }}
                        className="p-4 border-b border-slate-50 hover:bg-blue-50 transition-colors cursor-pointer flex gap-3"
                      >
                        <div className="text-xl">{n.icon}</div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 m-0">{n.title}</p>
                          <p className="text-[11px] text-slate-500 m-0">{n.desc}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center text-slate-400 text-xs">No notifications</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>


        <TravelAgentHeaderStatCard 
            title="Agent Intelligence"
            subtitle="Real-time system-wide performance"
            stats={{
                totalPackages: packages.length,
                totalBookings: tripStats.total,
                revenue: `Rs. ${totalRevenue.toLocaleString()}`,
                rating: "4.8",
                notifications: tripStats.processing
            }}
            loading={loading}
        />

        {/* --- REVENUE TRENDS --- */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm mb-8 mt-6">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <span className="w-1.5 h-5 bg-blue-600 rounded-full inline-block"></span>
              Revenue Trends
            </h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Last 7 Days</span>
          </div>
          
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dynamicChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} 
                    dy={10} 
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} 
                    tickFormatter={(v) => `Rs.${v}`} 
                />
                <Tooltip 
                    formatter={(value) => [`Rs. ${value}`, "Revenue"]}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} 
                />
                <Line 
                    type="monotone" 
                    dataKey="rev" 
                    stroke="#3b82f6" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 3 }} 
                    activeDot={{ r: 8, strokeWidth: 0 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- TRIP STATUS BAR --- */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex items-center gap-10">
          <div className="flex items-center gap-5 border-r border-slate-100 pr-10">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl">🏔️</div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total Trips</p>
              <h3 className="text-3xl font-black text-slate-800 m-0">{tripStats.total}</h3>
            </div>
          </div>
          <div className="flex-1">
            <div className="h-4 w-full bg-slate-100 rounded-full flex overflow-hidden mb-5">
              <div style={{ width: getWidth(tripStats.confirmed) }} className="bg-emerald-400 transition-all duration-700"></div>
              <div style={{ width: getWidth(tripStats.processing) }} className="bg-blue-400 transition-all duration-700"></div>
              <div style={{ width: getWidth(tripStats.canceled) }} className="bg-rose-400 transition-all duration-700"></div>
            </div>
            <div className="flex gap-8 text-[11px] font-bold text-slate-500 uppercase">
               <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> Confirmed {tripStats.confirmed}</span>
               <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-400"></div> Processing {tripStats.processing}</span>
               <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-400"></div> Canceled {tripStats.canceled}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TravelAgentDashboard;