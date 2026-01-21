


import React, { useState, useEffect } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminHeaderStatCard from './components/AdminHeaderStatCard'; 
import { Search } from 'lucide-react';
import { getAllUsersApi, deleteUsersById, getUserById } from '../services/api'; 
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem('userId'); 
        if (userId) {
          const res = await getUserById(userId);
          if (res.data) setUserData(res.data); 
        }
        
        const response = await getAllUsersApi();
        const allUsers = response.data.users || response.data;
        if (Array.isArray(allUsers)) setUsers(allUsers);
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to connect to the server.");
      } finally {
        setLoading(false); 
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await deleteUsersById(id);
      if (response?.status === 200 || response?.data?.success) {
        setUsers(prev => prev.filter(u => (u._id || u.id) !== id));
        toast.success("User deleted successfully");
      }
    } catch (err) {
      toast.error("An error occurred during deletion");
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
        {/* --- DYNAMIC HEADER & STATS SECTION (Matches Screenshot) --- */}
        <AdminHeaderStatCard
          title="User Management"
          subtitle="Real-time registered users"
          loading={loading}
          stats={{
            totalUsers: users.length,
            activeAgents: users.filter(u => u.role === 'travelagent' && u.status === 'approved').length,
            pending: users.filter(u => u.status === 'pending').length,
            revenue: "Rs. 0"
          }}
        />

        {/* --- PRESERVED ORIGINAL TABLE CONTENT --- */}
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