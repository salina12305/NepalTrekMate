
import React, { useState, useEffect } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminHeaderStatCard from './components/AdminHeaderStatCard';
import toast from 'react-hot-toast';
import { 
  getAllUsersApi, 
  getUserById,
  getPendingRequestsApi, 
  approveUserApi, 
  rejectUserApi 
} from '../services/api';

const ApproveAgents = () => {
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const profileRes = await getUserById(userId);
        setUserData(profileRes.data);
      }
      const usersRes = await getAllUsersApi();
      setUsers(usersRes.data.users || usersRes.data);

      const pendingRes = await getPendingRequestsApi();
      setRequests(pendingRes.data.requests || pendingRes.data);
    } catch (err) {
      toast.error("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (id) => {
    try {
      await approveUserApi(id);
      toast.success("Agent Approved!");
      fetchData(); 
    } catch (err) {
      toast.error("Approval failed");
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
      
      <main className="flex-1 p-8">
        {/* Updated Header and Stats */}
        <AdminHeaderStatCard 
          title="Travel Agents Approval"
          subtitle="Review and approve travel agent registrations"
          loading={loading}
          stats={{
            totalUsers: users.length,
            activeAgents: activeAgentsCount,
            pending: requests.length,
            revenue: "Rs. 0"
          }}
        />

        {/* Keeping your exact original Approval list logic */}
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
                  <button className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg cursor-pointer font-bold transition-colors">
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