
import React, { useState, useEffect } from 'react';
import GuideSidebar from './components/GuideSidebar';
import GuideStatCard from './components/GuideStatCard';
import { MapPin, Compass, Briefcase, CheckCircle2 } from 'lucide-react';
import { getUserById, getGuideAssignmentsApi, getAgentFeedbackApi } from '../services/api';

const GuideDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [ratingData, setRatingData] = useState({ avg: 0, count: 0 });
  const [loading, setLoading] = useState(true);

  // Define the Backend URL to fetch real images
  const API_URL = "http://localhost:3000"; 

  useEffect(() => {
    const fetchDashboardData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      try {
        // 1. Fetch Guide Profile
        const userRes = await getUserById(userId).catch(() => null);
        if (userRes?.data) setUserData(userRes.data.user || userRes.data);

        // 2. Fetch ONLY Approved Assignments
        const assignmentRes = await getGuideAssignmentsApi().catch(() => null);
        if (assignmentRes?.data?.success) {
          setAssignments(assignmentRes.data.data || []);
        }

        // 3. Ratings Calculation
        const feedbackRes = await getAgentFeedbackApi(userId).catch(() => null);
        if (feedbackRes?.data && Array.isArray(feedbackRes.data)) {
          const total = feedbackRes.data.reduce((acc, curr) => acc + (curr.rating || 0), 0);
          setRatingData({
            avg: feedbackRes.data.length > 0 ? (total / feedbackRes.data.length).toFixed(1) : 0,
            count: feedbackRes.data.length
          });
        }
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center font-black text-cyan-600 bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
        Syncing Basecamp...
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <GuideSidebar 
        userData={userData} 
        averageRating={ratingData.avg} 
        totalReviews={ratingData.count} 
      />
      
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Mission Control</h1>
          <p className="text-slate-500 font-medium">
            Welcome back, <span className="text-cyan-600 font-bold">{userData?.fullName || 'Guide'}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <GuideStatCard 
            label="Approved Missions" 
            value={assignments.length} 
            icon={<Briefcase className="text-cyan-600"/>} 
          />
          <GuideStatCard 
            label="User Rating" 
            value={ratingData.count > 0 ? ratingData.avg : "N/A"} 
            icon="⭐" 
          />
          <GuideStatCard 
            label="Total Earnings" 
            value={`Rs.${assignments.reduce((a,c) => a + (Number(c.totalPrice) || 0), 0)}`} 
            icon="💰" 
          />
        </div>

        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Compass className="text-cyan-500"/> Your Expeditions
        </h2>
        
        <div className="grid grid-cols-1 gap-4">
          {assignments.length > 0 ? (
            assignments.map((item) => (
              <div 
                key={item.id} 
                className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm flex justify-between items-center hover:shadow-lg transition-all duration-300"
              >
                <div className="flex gap-5 items-center">
                  {/* REAL IMAGE RENDERING */}
                  <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-inner bg-slate-50 border-2 border-white">
                    <img 
                      src={`${API_URL}${item.Package?.packageImage}`} 
                      alt="Trek"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=No+Image"; }}
                    />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-xl leading-tight">
                      {item.Package?.packageName}
                    </h3>
                    <p className="text-slate-400 text-sm flex items-center gap-1 font-bold mt-1">
                      <MapPin size={16} className="text-cyan-500"/> 
                      {item.Package?.destination}
                    </p>
                  </div>
                </div>

                <div className="flex gap-16 items-center pr-4">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assigned Traveler</p>
                    <p className="font-bold text-cyan-600 text-lg">
                      {item.User?.fullName}
                    </p>
                  </div>
                  
                  <div className="text-right border-l pl-10 border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Departure Date</p>
                    <p className="font-bold text-slate-700 text-lg">
                      {new Date(item.bookingDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Visual Proof of Approval */}
                  <div className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase shadow-md shadow-emerald-100">
                    <CheckCircle2 size={16} />
                    Ready
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-24 text-center">
              <div className="text-6xl mb-6 opacity-30">🏔️</div>
              <p className="text-slate-400 font-bold text-xl uppercase tracking-wider">No active missions</p>
              <p className="text-slate-300 text-sm mt-2">Wait for the Travel Agent to approve your assigned treks.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GuideDashboard;