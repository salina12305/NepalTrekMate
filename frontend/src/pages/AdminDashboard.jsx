import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminHeaderStatCard from './components/AdminHeaderStatCard';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer
}from 'recharts';
import { getAllUsersApi, getUserById, getPendingRequestsApi,getAllBookings } from '../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

 const [totalRevenue, setTotalRevenue] = useState(0);
  const [tripStats, setTripStats] = useState({
    total: 0, confirmed: 0, processing: 0, canceled: 0
  });

  const [dynamicChartData, setDynamicChartData] = useState([
    { name: 'Sun', rev: 0 }, { name: 'Mon', rev: 0 }, { name: 'Tue', rev: 0 },
    { name: 'Wed', rev: 0 }, { name: 'Thu', rev: 0 }, { name: 'Fri', rev: 0 }, { name: 'Sat', rev: 0 }
  ]);

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
      const confirmedList = allBookings.filter(b => b.status?.toLowerCase().includes('confirm'));
      
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const revenueMap = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
      
      confirmedList.forEach(booking => {
        if (booking.createdAt) {
          const dayName = days[new Date(booking.createdAt).getDay()];
          revenueMap[dayName] += (booking.totalPrice || 0);
        }
      });

      setDynamicChartData(days.map(day => ({ name: day, rev: revenueMap[day] })));
      setTotalRevenue(confirmedList.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0));
      setTripStats({
        total: allBookings.length,
        confirmed: confirmedList.length,
        processing: allBookings.filter(b => b.status?.toLowerCase().includes('pend')).length,
        canceled: allBookings.filter(b => b.status?.toLowerCase().includes('cancel')).length
      });

    } catch (error) {
      console.error("Dashboard Sync Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const getWidth = (count) => {
    if (tripStats.total === 0) return "0%";
    return `${(count / tripStats.total) * 100}%`;
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <AdminSidebar userData={userData} />
      
      <main className="flex-1 p-8 overflow-y-auto relative">
        
        {/* Spacer for top alignment since Notification button is removed */}
        <div className="mb-6 h-4" />

        <AdminHeaderStatCard 
          title="Admin Dashboard"
          subtitle="Welcome back! Here is your real-time overview."
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