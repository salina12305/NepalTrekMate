import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import AdminSidebar from './components/AdminSidebar';
import AdminHeaderStatCard from './components/AdminHeaderStatCard';
import { Search, Eye, Calendar, User, MapPin } from 'lucide-react';
import { 
  getAllBookingsApi, 
  getUserById, 
  getAllPackagesApi, 
  getAllUsersApi, 
  getPendingRequestsApi 
} from '../services/api';
import toast from 'react-hot-toast';

const AdminBooking = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [bookings, setBookings] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Notification States
  const [showNoti, setShowNoti] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [allUsersList, setAllUsersList] = useState([]);
  const [lastViewedTime, setLastViewedTime] = useState(
    localStorage.getItem('adminNotiLastViewed') || new Date(0).toISOString()
  );

  // Unified Stats State
  const [globalStats, setGlobalStats] = useState({
    totalPackages: 0,
    activeAgents: 0,
    pending: 0,
    revenue: 0
  });

  // --- REUSABLE FETCH LOGIC ---
  const fetchAllAdminData = useCallback(async (isAuto = false) => {
    if (!isAuto) setLoading(true);
    const userId = localStorage.getItem('userId');
    
    try {
      const [bookingsRes, userRes, pkgRes, usersRes, pendingRes] = await Promise.all([
        getAllBookingsApi(),
        userId ? getUserById(userId) : Promise.resolve({ data: null }),
        getAllPackagesApi(),
        getAllUsersApi(),
        getPendingRequestsApi()
      ]);

      if (userRes?.data) setUserData(userRes.data);

      const allBookings = bookingsRes?.data?.data || bookingsRes?.data || [];
      const confirmed = Array.isArray(allBookings) 
        ? allBookings.filter(b => b?.status?.toLowerCase() === 'confirmed')
        : [];
      setBookings(confirmed);

      const totalRevenue = confirmed.reduce((acc, curr) => acc + (curr?.totalPrice || 0), 0);

      const allUsers = usersRes?.data?.users || usersRes?.data || [];
      setAllUsersList(allUsers); // Store for notifications

      const allPkgs = pkgRes?.data?.packages || pkgRes?.data || [];
      const allPending = pendingRes?.data?.requests || pendingRes?.data || [];
      setPendingRequests(allPending); // Store for notifications

      setGlobalStats({
        totalPackages: allPkgs.length,
        activeAgents: allUsers.filter(u => u?.role === 'travelagent' && u?.status === 'approved').length,
        pending: allPending.length,
        revenue: totalRevenue
      });

    } catch (err) {
      console.error("Data Fetch Error:", err);
      if (!isAuto) toast.error("Failed to sync administration records");
    } finally {
      setLoading(false);
    }
  }, []);

  // --- EFFECTS ---
  useEffect(() => {
    fetchAllAdminData();

    // Auto-Refresh Pattern: 30 Seconds
    const interval = setInterval(() => {
      fetchAllAdminData(true);
    }, 30000);

    // Close dropdown on outside click
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowNoti(false);
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fetchAllAdminData]);

  // --- NOTIFICATION MIXER ---
  const notifications = [
    ...pendingRequests.map(req => ({
      id: req._id,
      time: req.createdAt,
      title: "Agent Approval Pending",
      desc: `${req.name || 'New Agent'} applied.`,
      icon: "💼",
      link: "/approveagents"
    })),
    ...allUsersList
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

  const unreadCount = notifications.filter(n => new Date(n.time) > new Date(lastViewedTime)).length;

  const handleOpenNotifications = () => {
    setShowNoti(!showNoti);
    if (!showNoti) {
      const now = new Date().toISOString();
      setLastViewedTime(now);
      localStorage.setItem('adminNotiLastViewed', now);
      fetchAllAdminData(true);
    }
  };

  const filteredBookings = bookings.filter(b => 
    b?.Package?.packageName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b?.User?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <AdminSidebar userData={userData} />

      <main className="flex-1 p-8">
        {/* --- NOTIFICATION HEADER PATTERN --- */}
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
              <div className="absolute top-14 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                  <h4 className="font-bold text-slate-800 m-0 text-sm">Notifications</h4>
                  <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase">
                    {notifications.length} Total
                  </span>
                </div>
                
                <div className="max-h-[350px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((noti, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => { setShowNoti(false); navigate(noti.link); }}
                        className="p-4 border-b border-slate-50 hover:bg-blue-50/50 transition-colors cursor-pointer flex gap-3 items-start"
                      >
                        <div className="w-9 h-9 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-lg shadow-sm">{noti.icon}</div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-800 m-0">{noti.title}</p>
                          <p className="text-[11px] text-slate-500 m-0 leading-tight mt-0.5">{noti.desc}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center text-slate-400 text-xs">No recent updates</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <AdminHeaderStatCard
          title="Booking Ledger"
          subtitle="Real-time financial synchronization across all modules"
          loading={loading}
          stats={{
            totalPackages: globalStats.totalPackages,
            activeAgents: globalStats.activeAgents,
            pending: globalStats.pending,
            revenue: `Rs. ${globalStats.revenue.toLocaleString()}`
          }}
        />

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
          <div className="p-4 bg-[#E6F4F9]/30 flex justify-between items-center border-b">
            <h3 className="font-bold text-slate-800">Confirmed Expeditions</h3>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search traveler or trek..." 
                className="pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 outline-none w-64 focus:ring-2 focus:ring-blue-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              {/* ... Table Header ... */}
              <thead className="bg-slate-50 border-b">
                <tr className="text-[11px] uppercase text-slate-400 font-bold">
                  <th className="px-6 py-4">Trek/Package</th>
                  <th className="px-6 py-4">Traveler</th>
                  <th className="px-6 py-4">Travel Date</th>
                  <th className="px-6 py-4">Total Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan="6" className="p-10 text-center text-slate-400 font-medium">Synchronizing Ledger...</td></tr>
                ) : filteredBookings.length === 0 ? (
                  <tr><td colSpan="6" className="p-10 text-center text-slate-400">No confirmed bookings match your search.</td></tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking?._id || booking?.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <MapPin size={16} />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-slate-800">
                                {booking?.Package?.packageName || "Deleted Package"}
                            </div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase">
                                ID: #{booking?._id?.toString().slice(-5) || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                            <User size={14} />
                          </div>
                          <span className="text-sm font-medium text-slate-700">
                            {booking?.User?.fullName || "Unknown User"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                          <Calendar size={14} />
                          {booking?.bookingDate || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-800">
                        Rs. {(booking?.totalPrice || 0).toLocaleString()}
                        <div className="text-[10px] text-slate-400 font-normal">
                            {booking?.numberOfPeople || 0} Pax
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">
                          {booking?.status || "Confirmed"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors">
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminBooking;