import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import AdminSidebar from './components/AdminSidebar';
import AdminHeaderStatCard from './components/AdminHeaderStatCard';
import { Search, Calendar, User, MapPin, CheckCircle2 } from 'lucide-react';
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

  // --- STATE MANAGEMENT ---
  const [bookings, setBookings] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNoti, setShowNoti] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [allUsersList, setAllUsersList] = useState([]);
  // Track last notification check to highlight "new" items
  const [lastViewedTime, setLastViewedTime] = useState(
    localStorage.getItem('adminNotiLastViewed') || new Date(0).toISOString()
  );

  const [globalStats, setGlobalStats] = useState({
    totalPackages: 0,
    activeAgents: 0,
    pending: 0,
    revenue: 0
  });

 /**
   * Helper: Business Logic to filter successful transactions.
   * Only 'confirmed' or 'completed' bookings affect the financial ledger.
   */
  const isSuccessful = (status) => {
    const s = String(status || "").toLowerCase();
    return s.includes('confirm') || s.includes('complete') || s.includes('finish');
  };
  
  /**
   * DATA SYNCHRONIZATION
   * Fetches data from 5 different endpoints simultaneously to build the dashboard state.
   * @param {boolean} isAuto - If true, suppresses the loading spinner for background refreshes.
   */
  const fetchAllAdminData = useCallback(async (isAuto = false) => {
    if (!isAuto) setLoading(true);
    const userId = localStorage.getItem('userId');
    
    try {
      // Execute all API calls in parallel for better performance
      const [bookingsRes, userRes, pkgRes, usersRes, pendingRes] = await Promise.all([
        getAllBookingsApi(),
        userId ? getUserById(userId) : Promise.resolve({ data: null }),
        getAllPackagesApi(),
        getAllUsersApi(),
        getPendingRequestsApi()
      ]);

      if (userRes?.data) setUserData(userRes.data);
      // --- 1. Process Bookings ---
      const allBookings = bookingsRes?.data?.data || bookingsRes?.data?.bookings || bookingsRes?.data || [];    
      // Filter for Confirmed, Completed, and Finished
      const successfulList = Array.isArray(allBookings) 
        ? allBookings.filter(b => isSuccessful(b?.status))
        : [];
      
      setBookings(successfulList);

      // --- 2. Calculate Revenue & User Stats ---
      const totalRevenue = successfulList.reduce((acc, curr) => acc + (Number(curr?.totalPrice) || 0), 0);
      const allUsers = usersRes?.data?.users || usersRes?.data || [];
      setAllUsersList(allUsers);

      const allPkgs = pkgRes?.data?.packages || pkgRes?.data || [];
      const allPending = pendingRes?.data?.requests || pendingRes?.data || [];
      setPendingRequests(allPending);

      // --- 3. Set Global Stats for Header Cards ---
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

  // --- LIFECYCLE EFFECTS ---
  useEffect(() => {
    fetchAllAdminData();
    // Auto-refresh data every 30 seconds to keep the "Ledger" live
    const interval = setInterval(() => fetchAllAdminData(true), 30000);
    // UI: Close notification dropdown when clicking outside
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowNoti(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fetchAllAdminData]);

  /**
   * NOTIFICATION LOGIC
   * Merges pending agent requests and new user signups (last 48 hours) into one feed.
   */
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
      .filter(u => (new Date() - new Date(u.createdAt)) < 172800000)
      .map(u => ({
        id: u._id,
        time: u.createdAt,
        title: "New User Registered",
        desc: `${u.name || u.email} joined.`,
        icon: "✨",
        link: "/users"
      }))
  ].sort((a, b) => new Date(b.time) - new Date(a.time));// Sort by newest first

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

  // --- FILTERING ---
  const filteredBookings = bookings.filter(b => 
    b?.Package?.packageName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b?.User?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <AdminSidebar userData={userData} />
      <main className="flex-1 p-8">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Global Booking Ledger</h1>
            <p className="text-slate-500 text-sm">System-wide transaction oversight and history</p>
          </div>

          {/* Notification Bell with Unread Badge */}
          <div className="relative" ref={dropdownRef}>
            <button onClick={handleOpenNotifications} className="relative p-3 bg-white rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-all z-50">
              <span className="text-xl">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Menu */}
            {showNoti && (
              <div className="absolute top-14 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[60] overflow-hidden">
                <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                  <h4 className="font-bold text-slate-800 text-sm">Notifications</h4>
                  <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase">{notifications.length} Total</span>
                </div>
                <div className="max-h-[350px] overflow-y-auto">
                  {notifications.map((noti, idx) => (
                    <div key={idx} onClick={() => { setShowNoti(false); navigate(noti.link); }} className="p-4 border-b border-slate-50 hover:bg-blue-50/50 transition-colors cursor-pointer flex gap-3">
                      <div className="w-9 h-9 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-lg">{noti.icon}</div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 m-0">{noti.title}</p>
                        <p className="text-[11px] text-slate-500 m-0 leading-tight">{noti.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Global Statistics Cards */}
        <AdminHeaderStatCard
         loading={loading}
         firstCardLabel="Total Bookings" 
         stats={{
          totalBookings: bookings.length, 
          activeAgents: globalStats.activeAgents,
          pending: globalStats.pending,
          revenue: globalStats.revenue 
         }}
       />
       {/* Transaction History Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
          <div className="p-4 bg-slate-50 flex justify-between items-center border-b">
            <h3 className="font-bold text-slate-800">Transaction History</h3>
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
              <thead className="bg-slate-50 border-b">
                <tr className="text-[11px] uppercase text-slate-400 font-bold">
                  <th className="px-6 py-4">Trek/Package</th>
                  <th className="px-6 py-4">Traveler</th>
                  <th className="px-6 py-4">Travel Date</th>
                  <th className="px-6 py-4">Total Price</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan="5" className="p-10 text-center text-slate-400">Synchronizing Ledger...</td></tr>
                ) : filteredBookings.length === 0 ? (
                  <tr><td colSpan="5" className="p-10 text-center text-slate-400">No confirmed transactions found.</td></tr>
                ) : (
                  filteredBookings.map((booking) => {
                    const status = String(booking?.status || "").toLowerCase();
                    const isPast = status.includes('finish') || status.includes('complete');
                    
                    return (
                      <tr key={booking?._id || booking?.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isPast ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                              <MapPin size={16} />
                            </div>
                            <div>
                              <div className="font-bold text-sm text-slate-800">{booking?.Package?.packageName || "Deleted Package"}</div>
                              <div className="text-[10px] text-slate-400 font-bold uppercase">ID: #{booking?._id?.toString().slice(-5)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-700">
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-slate-400" /> {booking?.User?.fullName || "Guest"}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                          <Calendar size={14} className="inline mr-2" /> {booking?.bookingDate || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-800">
                          Rs. {(booking?.totalPrice || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center w-fit gap-1 ${
                            isPast ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {isPast && <CheckCircle2 size={10} />}
                            {booking?.status || "Confirmed"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
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