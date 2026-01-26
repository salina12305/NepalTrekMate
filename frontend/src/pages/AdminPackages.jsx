import React, { useState, useEffect, useCallback, useRef } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminHeaderStatCard from './components/AdminHeaderStatCard'; 
import { Search, Eye } from 'lucide-react'; // Removed Trash2
import { useNavigate } from 'react-router-dom';
import { 
  getUserById, 
  getAllPackagesApi, 
  getAllUsersApi, 
  getAllBookingsApi,
  getPendingRequestsApi 
} from '../services/api'; // Removed deletePackageApi
import toast from 'react-hot-toast';

const AdminPackages = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // --- STATES ---
  const [packages, setPackages] = useState([]);
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userData, setUserData] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // --- NOTIFICATION STATES ---
  const [showNoti, setShowNoti] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [lastViewedTime, setLastViewedTime] = useState(
    localStorage.getItem('adminNotiLastViewed') || new Date(0).toISOString()
  );

  // --- DATA FETCHING ---
  const fetchData = useCallback(async (isAuto = false) => {
    if (!isAuto) setLoading(true);
    const storedUserId = localStorage.getItem('userId'); 

    try {
      const [packagesRes, allUsersRes, userProfileRes, bookingsRes, pendingRes] = await Promise.all([
        getAllPackagesApi(),
        getAllUsersApi(),
        storedUserId ? getUserById(storedUserId) : Promise.resolve({ data: null }),
        getAllBookingsApi(),
        getPendingRequestsApi() 
      ]);

      if (userProfileRes?.data) setUserData(userProfileRes.data);

      const allPkgs = packagesRes.data.packages || packagesRes.data || [];
      setPackages(Array.isArray(allPkgs) ? allPkgs : []);

      const allUsers = allUsersRes.data.users || allUsersRes.data || [];
      setUsers(Array.isArray(allUsers) ? allUsers : []);

      const requests = pendingRes.data.requests || pendingRes.data || [];
      setPendingRequests(requests);

      const allBookings = bookingsRes.data?.data || bookingsRes.data || [];
      const confirmed = allBookings.filter(b => b.status?.toLowerCase().includes('confirm'));
      const calculatedRevenue = confirmed.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
      setTotalRevenue(calculatedRevenue);

    } catch (err) {
      console.error("Fetch error:", err);
      if (!isAuto) toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false); 
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 30000);
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowNoti(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fetchData]);

  // --- NOTIFICATION MIXER ---
  const notifications = [
    ...pendingRequests.map(req => ({
      id: req._id,
      time: req.createdAt,
      title: "Agent Approval",
      desc: `${req.name || 'New Agent'} is pending.`,
      icon: "💼",
      link: "/approveagents"
    })),
    ...users
      .filter(u => (new Date() - new Date(u.createdAt)) < 172800000)
      .map(u => ({
        id: u._id,
        time: u.createdAt,
        title: "New User",
        desc: `${u.name || u.email} registered.`,
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
      fetchData(true);
    }
  };

  const filteredPackages = packages.filter(pkg => 
    pkg.packageName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.destination?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <AdminSidebar userData={userData} />
      
      <main className="flex-1 p-8 relative">
        
        {/* --- NOTIFICATION HEADER --- */}
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
                        <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center text-lg">{noti.icon}</div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-800 m-0">{noti.title}</p>
                          <p className="text-[11px] text-slate-500 m-0 leading-tight mt-0.5">{noti.desc}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center text-slate-400 text-xs">No new updates</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <AdminHeaderStatCard
           title="Package Management"
           subtitle="Overview of all trekking and tour experiences"
           loading={loading}
           firstCardLabel="Total Packages"
           stats={{
             totalPackages: packages.length,
             activeAgents: users.filter(u => 
             (u.role === 'agent' || u.role === 'travelagent') && 
             u.status === 'approved').length,
             pending: pendingRequests.length,
             revenue: `Rs. ${totalRevenue.toLocaleString()}`
           }}
         />

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
          <div className="p-4 bg-[#E6F4F9]/30 flex justify-between items-center border-b">
            <h3 className="font-bold text-slate-800">Package Directory</h3>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search package or destination..." 
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
                  <th className="px-6 py-4">Package</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan="5" className="p-10 text-center text-slate-400">Loading...</td></tr>
                ) : filteredPackages.length === 0 ? (
                    <tr><td colSpan="5" className="p-10 text-center text-slate-400">No packages found.</td></tr>
                ) : filteredPackages.map((pkg) => (
                  <tr key={pkg._id || pkg.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-12 h-10 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                        <img 
                          src={pkg.packageImage ? `${import.meta.env.VITE_API_BASE_URL}/public/uploads/${pkg.packageImage}` : "/placeholder.png"} 
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = "/placeholder.png"; }} 
                        />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-800">{pkg.packageName}</div>
                        <div className="text-[11px] text-slate-400">{pkg.destination}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-700">Rs. {pkg.price}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{pkg.durationDays} Days</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${pkg.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {pkg.availability ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => navigate(`/admin/view-package/${pkg._id || pkg.id}`)} 
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPackages;