import React, { useState, useEffect, useCallback, useRef } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminHeaderStatCard from './components/AdminHeaderStatCard'; 
import { Search, Eye, Trash2 } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import { 
  getUserById, 
  getAllPackagesApi, 
  deletePackageApi, 
  getAllUsersApi, 
  getAllBookingsApi,
  getPendingRequestsApi 
} from '../services/api'; 
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

  // Helper for status filtering (Admin sees global success)
  const isSuccessful = (status) => {
    const s = String(status || "").toLowerCase();
    return s.includes('confirm') || s.includes('complete') || s.includes('finish');
  };

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

      const allBookings = bookingsRes.data?.data || bookingsRes.data?.bookings || bookingsRes.data || [];
      
      const successfulBookings = allBookings.filter(b => isSuccessful(b.status));
      
      const calculatedRevenue = successfulBookings.reduce((acc, curr) => 
        acc + (Number(curr.totalPrice) || 0), 0
      );
      
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

    // --- ACTION HANDLERS ---
  const handleDelete = (id) => {
    // Stage 1: The UI Confirmation Toast
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold text-slate-800">Remove this package?</p>
        <p className="text-[11px] text-slate-500 leading-tight">
          This will hide the tour from users. Ensure no active bookings exist.
        </p>
        <div className="flex gap-2 mt-2 justify-end">
          <button 
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              await executePackageDelete(id); // Move to the actual deletion logic
            }}
            className="px-3 py-1.5 bg-rose-500 text-white text-[10px] font-black uppercase rounded-lg shadow-sm hover:bg-rose-600 transition-all"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    ), { 
      duration: 6000,
      position: 'top-center',
    });
  };

  // Stage 2: The API Logic
  const executePackageDelete = async (id) => {
    const loadingToast = toast.loading("Updating records...");
    try {
      const response = await deletePackageApi(id);
      // Check for success (adjust based on your API response structure)
      if (response.data.success || response.status === 200) {
        setPackages(prev => prev.filter(pkg => (pkg._id || pkg.id) !== id));
        toast.success("Package successfully removed", { id: loadingToast });
      } else {
        throw new Error("Deletion failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error: Could not delete package.", { id: loadingToast });
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
        
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Package Management</h1>
          <p className="text-slate-500 text-sm">Overview of all trekking and tour experiences</p>
        </div>
        {/* --- NOTIFICATION HEADER --- */}
        <div className="relative" ref={dropdownRef}>
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
                        <button onClick={() => handleDelete(pkg._id || pkg.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={18} />
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