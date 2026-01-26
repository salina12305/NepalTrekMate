import React, { useState, useEffect } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminHeaderStatCard from './components/AdminHeaderStatCard';
import { getAllUsersApi, getUserById, getPendingRequestsApi } from '../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          const profileRes = await getUserById(userId);
          setUserData(profileRes.data);
        }
        const usersRes = await getAllUsersApi();
        const allUsers = usersRes.data.users || usersRes.data;
        if (Array.isArray(allUsers)) setUsers(allUsers);

        const pendingRes = await getPendingRequestsApi();
        const requests = pendingRes.data.requests || pendingRes.data;
        if (Array.isArray(requests)) setPendingRequests(requests);
      } catch (error) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <AdminSidebar userData={userData} />
      
      <main className="flex-1 p-8">
        {/* New Stats Header - Preserving your data logic */}
        <AdminHeaderStatCard 
          title="Admin Dashboard"
          subtitle="Welcome back! Here is what's happening today."
          loading={loading}
          stats={{
            totalUsers: users.length,
            activeAgents: users.filter(u => u.role === 'travelagent' && u.status === 'approved').length,
            pending: pendingRequests.length,
            revenue: "Rs. 0"
          }}
        />

        {/* Keeping your Dashboard content exactly the same */}
        <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '20px' }}>Revenue Overview</h2>
            <select style={{ padding: '8px 15px', borderRadius: '8px', border: '1px solid #ccc', background: '#64B5F6', color: 'white' }}>
              <option>Weekly</option>
            </select>
          </div>

          <div style={{ height: '250px', width: '100%', position: 'relative', borderBottom: '1px solid #eee' }}>
             <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '12px', color: '#888' }}>
               <span>$800</span><span>$600</span><span>$400</span><span>$200</span><span>$0</span>
             </div>
             
             <div style={{ marginLeft: '40px', height: '100%', borderLeft: '1px solid #eee', position: 'relative' }}>
                <svg viewBox="0 0 700 200" style={{ width: '100%', height: '100%' }}>
                  <path d="M0,100 C100,80 150,150 250,120 S350,20 450,80 S600,60 700,90" fill="none" stroke="#64B5F6" strokeWidth="3" />
                  <circle cx="450" cy="80" r="5" fill="#64B5F6" />
                  <line x1="450" y1="80" x2="450" y2="200" stroke="#64B5F6" strokeDasharray="4" />
                </svg>
                <div style={{ position: 'absolute', left: '60%', top: '10px', background: '#E3F2FD', padding: '5px 10px', borderRadius: '5px', fontSize: '12px', textAlign: 'center' }}>
                  <strong>$635</strong><br/>12 Jul 28
                </div>
             </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: '50px', marginTop: '10px', fontSize: '12px', color: '#888' }}>
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>
        </div>

        {/* TOTAL TRIPS BAR */}
        <div style={{ marginTop: '30px', display: 'flex', alignItems: 'center', gap: '30px' }}>
          <div style={{ fontSize: '40px' }}>🏔️</div>
          <div>
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Total Trips</p>
            <h3 style={{ margin: 0 }}>1,200</h3>
          </div>
          
          <div style={{ flex: 1 }}>
            <div style={{ height: '12px', width: '100%', background: '#E1F5FE', borderRadius: '10px', display: 'flex', overflow: 'hidden' }}>
              <div style={{ width: '50%', background: '#B3E5FC' }}></div>
              <div style={{ width: '30%', background: '#81D4FA' }}></div>
              <div style={{ width: '20%', background: '#4FC3F7' }}></div>
            </div>
            <div style={{ display: 'flex', gap: '20px', marginTop: '10px', fontSize: '12px' }}>
               <span><span style={{ color: '#B3E5FC' }}>■</span> Done <strong>620</strong></span>
               <span><span style={{ color: '#81D4FA' }}>■</span> Booked <strong>465</strong></span>
               <span><span style={{ color: '#4FC3F7' }}>■</span> Canceled <strong>115</strong></span>
            </div>
          </div>
        </div>
        
      </main>
    </div>
  );
};

export default AdminDashboard;