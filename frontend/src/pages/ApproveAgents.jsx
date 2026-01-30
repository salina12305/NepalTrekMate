import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminHeaderStatCard from './components/AdminHeaderStatCard';
import toast from 'react-hot-toast';
import { 
  getAllUsersApi, 
  getUserById,
  getPendingRequestsApi, 
  approveUserApi, 
  rejectUserApi,
  getAllBookingsApi 
} from '../services/api';

const ApproveAgents = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // --- STATES ---
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Notification states
  const [showNoti, setShowNoti] = useState(false);
  const [lastViewedTime, setLastViewedTime] = useState(
    localStorage.getItem('adminNotiLastViewed') || new Date(0).toISOString()
  );

  // --- HELPER FOR REVENUE SYNC ---
  const isSuccessful = (status) => {
    const s = String(status || "").toLowerCase();
    return s.includes('confirm') || s.includes('complete') || s.includes('finish');
  };

  // --- REUSABLE FETCH LOGIC ---
  const fetchData = useCallback(async (isAuto = false) => {
    if (!isAuto) setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      
      // Parallel fetching for speed
      const [profileRes, usersRes, pendingRes, bookingsRes] = await Promise.all([
        userId ? getUserById(userId) : Promise.resolve({ data: null }),
        getAllUsersApi(),
        getPendingRequestsApi(),
        getAllBookingsApi()
      ]);

      if (profileRes?.data) setUserData(profileRes.data);
      
      const allUsers = usersRes.data.users || usersRes.data;
      if (Array.isArray(allUsers)) setUsers(allUsers);

      const allRequests = pendingRes.data.requests || pendingRes.data;
      if (Array.isArray(allRequests)) setRequests(allRequests);

      const allBookings = bookingsRes.data?.data || bookingsRes.data?.bookings || bookingsRes.data || [];
      const successfulBookings = allBookings.filter(b => isSuccessful(b.status));
      
      const calculatedRevenue = successfulBookings.reduce((acc, curr) => 
        acc + (Number(curr.totalPrice) || 0), 0
      );
      setTotalRevenue(calculatedRevenue);
    } catch (err) {
      console.error("Fetch Error:", err);
      if (!isAuto) toast.error("Error loading data");
    } finally {
      setLoading(false);
    }
  }, []);

  // --- EFFECTS ---
  useEffect(() => {
    fetchData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => fetchData(true), 30000);

    // Click outside dropdown handler
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
    ...requests.map(req => ({
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
      fetchData(true);
    }
  };

  // --- HANDLERS ---
  const handleApprove = async (id) => {
    try {
      await approveUserApi(id);
      toast.success("Agent Approved!");
      fetchData(); 
    } catch (err) {
      toast.error("Approval failed");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this agent?")) return;
    try {
      await rejectUserApi(id);
      toast.success("Agent Rejected");
      fetchData();
    } catch (err) {
      toast.error("Rejection failed");
    }
  };

  const activeAgentsCount = users.filter(u => u.role === 'travelagent' && u.status === 'approved').length;

  const approvalCardStyle = {
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '15px',
    padding: '25px',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0px 2px 8px rgba(0,0,0,0.04)'
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar userData={userData} />
      
      <main className="flex-1 p-8 relative">

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Travel Agents Approval</h1>
          <p className="text-slate-500 text-sm">Review and approve travel agent registrations</p>
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
                        <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-lg">{noti.icon}</div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-800 m-0">{noti.title}</p>
                          <p className="text-[11px] text-slate-500 m-0 leading-tight mt-0.5">{noti.desc}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center text-slate-400 text-xs">No updates</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <AdminHeaderStatCard 
          loading={loading}
          stats={{
            totalUsers: users.length,
            activeAgents: activeAgentsCount,
            pending: requests.length,
            revenue: `Rs. ${totalRevenue.toLocaleString()}`
          }}
        />

        <div className="max-w-[2000px]">
          {loading ? (
            <div className="p-10 text-center">Loading requests...</div>
          ) : requests.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-xl border">
              <p className="text-slate-500">No new travel agent registrations to review.</p>
            </div>
          ) : (
            requests.map((agent) => (
              <div key={agent._id || agent.id} style={approvalCardStyle}>
                <div className="flex justify-between items-start">
                  <div className="flex gap-8">
                    <div className="group relative w-16 h-16 bg-slate-100 rounded-full overflow-hidden border-2 border-slate-200 flex items-center justify-center">
                      <img 
                        src={agent.profileImage ? `http://localhost:3000${agent.profileImage}` : "/ne.png"} 
                        alt={agent.fullName}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-125"
                        onError={(e) => { e.target.src = "/ne.png"; }} 
                      />
                    </div>
                    <div>
                      <h3 className="m-0 text-lg font-bold">{agent.fullName}</h3>
                      <p className="m-0 text-slate-500 text-sm">{agent.email}</p>
                      
                      <div className="grid grid-cols-3 gap-10 mt-4">
                        <div>
                          <p className="m-0 font-bold">{agent.companyName || 'New Agency'}</p>
                          <p className="m-0 text-slate-800 text-sm">💰 Rs. 0 Revenue</p>
                        </div>
                        <div>
                          <p className="m-0 text-sm">{agent.phoneNumber || 'No Phone'}</p>
                          <p className="m-0 text-slate-500 text-xs">Joined {new Date(agent.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="m-0 text-sm">📦 0 Packages</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="bg-yellow-100 px-4 py-1.5 rounded-full text-xs font-bold uppercase text-yellow-700">
                      {agent.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6">
                  <button 
                    onClick={() => handleApprove(agent._id || agent.id)}
                    className="px-6 py-2.5 bg-green-200 hover:bg-green-300 text-green-900 border-none rounded-lg cursor-pointer font-bold transition-colors"
                  >
                    Approve Agent
                  </button>
                  <button 
                    onClick={() => handleReject(agent._id || agent.id)}
                    className="px-6 py-2.5 bg-red-200 hover:bg-red-300 text-red-900 border-none rounded-lg cursor-pointer font-bold transition-colors"
                  >
                    Reject
                  </button>
                  <button 
      onClick={() => navigate(`/admin/user/${agent._id || agent.id}`)}
      className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg cursor-pointer font-bold transition-colors"
    >
      View Details
    </button>
                </div>
              </div>
            )
          ))}
        </div>
      </main>
    </div>
  );
};

export default ApproveAgents;