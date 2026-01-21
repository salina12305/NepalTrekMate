import React, { useState, useEffect } from 'react';
import TravelAgentSidebar from './components/TravelAgentSidebar';
import TravelAgentHeaderStatCard from './components/TravelAgentHeaderStatCard';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { getUserById, getAgentPackagesApi, getAllBookingsApi } from '../services/api';

const chartData = [
  { name: 'Sun', rev: 400 }, { name: 'Mon', rev: 320 }, 
  { name: 'Tue', rev: 480 }, { name: 'Wed', rev: 635 }, 
  { name: 'Thu', rev: 420 }, { name: 'Fri', rev: 550 }, 
  { name: 'Sat', rev: 520 },
];

const TravelAgentDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]); 

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const userRes = await getUserById(userId);
        setUserData(userRes.data);

        const pkgRes = await getAgentPackagesApi(userId);
        setPackages(pkgRes.data.packages || []);

        const bookingRes = await getAllBookingsApi();
        setBookings(bookingRes.data.data || []);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <TravelAgentSidebar type="agent" userData={userData} />
      <main className="flex-1 p-8">
        <TravelAgentHeaderStatCard 
            title="Agent Overview"
            subtitle="Real-time performance metrics"
            stats={{
                totalPackages: packages.length,
                totalBookings: bookings.filter(b => b.status === 'confirmed').length,
                revenue: bookings.filter(b => b.status === 'confirmed')
                                 .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0),
                rating: "4.8",
                notifications: bookings.filter(b => b.status === 'pending').length
            }}
            loading={loading}
        />

        {/* --- REVENUE CHART --- */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
          <h3 className="font-bold text-slate-800 mb-8">Revenue Overview</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} tickFormatter={(v) => `Rs.${v}`} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="rev" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- TRIP STATUS BAR --- */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-8">
            <div className="flex items-center gap-4 border-r border-slate-100 pr-8">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">🏔️</div>
                <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Trips</p>
                    <p className="text-xl font-bold text-slate-800">{bookings.length}</p> 
                </div>
            </div>
            <div className="flex-1">
                {/* Visual indicator of booking stats */}
                <div className="flex h-3 w-full rounded-full overflow-hidden bg-slate-100 mb-3">
                    <div className="bg-cyan-300" style={{ width: '60%' }}></div>
                    <div className="bg-blue-400" style={{ width: '25%' }}></div>
                    <div className="bg-blue-600" style={{ width: '15%' }}></div>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase">
                    <span>System Bookings: {bookings.length}</span>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default TravelAgentDashboard;