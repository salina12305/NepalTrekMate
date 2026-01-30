


import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminHeaderStatCard from './components/AdminHeaderStatCard'; 
import { Search, Eye } from 'lucide-react';
import { 
  getAllUsersApi, 
  deleteUsersById, 
  getUserById,
  getAllBookingsApi, 
  getPendingRequestsApi
} from '../services/api'; 
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

   // --- STATES ---
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

    // --- HELPER FOR REVENUE SYNC ---
  const isSuccessful = (status) => {
    const s = String(status || "").toLowerCase();
    return s.includes('confirm') || s.includes('complete') || s.includes('finish');
  };

      // --- REUSABLE FETCH LOGIC ---
  const fetchAllData = useCallback(async (isAuto = false) => {
    if (!isAuto) setLoading(true);
    const userId = localStorage.getItem('userId'); 

    try {
      const [userProfileRes, usersRes, bookingsRes, pendingRes] = await Promise.all([
        userId ? getUserById(userId) : Promise.resolve({ data: null }),
        getAllUsersApi(),
        getAllBookingsApi(),
        getPendingRequestsApi()
      ]);

      // 1. Admin Profile
      if (userProfileRes?.data) setUserData(userProfileRes.data);

      // 2. Users List
      const allUsers = usersRes.data.users || usersRes.data;
      if (Array.isArray(allUsers)) setUsers(allUsers);

      // 3. Pending Requests for Notifications
      const allRequests = pendingRes.data.requests || pendingRes.data;
      if (Array.isArray(allRequests)) setPendingRequests(allRequests);

      // 4. Revenue calculation
      const allBookings = bookingsRes.data?.data || bookingsRes.data?.bookings || bookingsRes.data || [];
      const successfulBookings = allBookings.filter(b => isSuccessful(b.status));
      
      const calculatedRevenue = successfulBookings.reduce((acc, curr) => 
        acc + (Number(curr.totalPrice) || 0), 0
      );
      setTotalRevenue(calculatedRevenue);

    } catch (err) {
      console.error("Fetch error:", err);
      if (!isAuto) toast.error("Failed to connect to the server.");
    } finally {
      setLoading(false); 
    }
  }, []);

   // --- EFFECTS ---
   useEffect(() => {
    fetchAllData();
    const interval = setInterval(() => fetchAllData(true), 30000);
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowNoti(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fetchAllData]);

  // --- NOTIFICATION MIXER ---
  const notifications = [
    ...pendingRequests.map(req => ({
      id: req._id,
      time: req.createdAt,
      title: "Agent Approval",
      desc: `${req.fullName || 'New Agent'} applied.`,
      icon: "💼",
      link: "/approveagents"
    })),
    ...users
      .filter(u => (new Date() - new Date(u.createdAt)) < 172800000) // Last 48h
      .map(u => ({
        id: u._id,
        time: u.createdAt,
        title: "New User",
        desc: `${u.fullName || u.email} joined.`,
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
      fetchAllData(true); // Sync data when opening
    }
  };

  const handleDelete = (id) => {
    // Use a custom toast with "Confirm" and "Cancel" buttons
    toast((t) => (
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-slate-800">
          Are you sure you want to <b>delete</b> this user?
        </span>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-bold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id); // Close confirmation toast
              await executeDeletion(id); // Run actual API call
            }}
            className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-all shadow-sm"
          >
            Delete User
          </button>
        </div>
      </div>
    ), {
      duration: 6000, // Give user time to decide
      position: 'top-center',
      style: {
        padding: '16px',
        borderRadius: '16px',
        border: '1px solid #fee2e2'
      }
    });
  };
  
  // Separate the API logic for cleaner code
  const executeDeletion = async (id) => {
    const loadingToast = toast.loading("Processing deletion...");
    try {
      const response = await deleteUsersById(id);
      if (response?.status === 200 || response?.data?.success) {
        setUsers(prev => prev.filter(u => (u._id || u.id) !== id));
        toast.success("User removed from database", { id: loadingToast });
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      toast.error("Could not delete user. Try again.", { id: loadingToast });
    }
  };

  const filteredUsers = users.filter(user => 
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <AdminSidebar userData={userData} />
      
      <main className="flex-1 p-8">

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800">User Management</h1>
          <p className="text-slate-500 text-sm">Real-time registered users</p>
        </div>
       {/* --- NOTIFICATION BELL SECTION --- */}
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
                        <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-lg">{noti.icon}</div>
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

         {/* --- HEADER & STATS --- */}
        <AdminHeaderStatCard
          loading={loading}
          stats={{
            totalUsers: users.length,
            activeAgents: users.filter(u => u.role === 'travelagent' && u.status === 'approved').length,
            pending: pendingRequests.length,
            revenue: `Rs. ${totalRevenue.toLocaleString()}`
          }}
        />

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-[#E6F4F9]/30 flex justify-between items-center border-b">
            <h3 className="font-bold text-slate-800">User Directory</h3>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input 
                type="text" placeholder="Search name or email..." 
                className="pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 outline-none w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr className="text-[11px] uppercase text-slate-400 font-bold">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="5" className="p-10 text-center text-slate-400">Loading Database...</td></tr>
              ) : filteredUsers.map((user) => (
                <tr key={user._id || user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                      <img 
                        src={user.profileImage ? `http://localhost:3000${user.profileImage}` : "/ne.png"} 
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = "/ne.png"; }} 
                      />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-800">{user.fullName}</div>
                      <div className="text-[11px] text-slate-400">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold uppercase">{user.role}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${user.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-700'}`}>
                      {user.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDelete(user._id || user.id)} className="text-red-600 hover:text-red-800 text-xs font-bold">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;