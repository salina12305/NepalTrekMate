import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GuideSidebar from './components/GuideSidebar';
import { MapPin, Compass, CheckCircle2, Briefcase } from 'lucide-react';
import { getUserById, getGuideAssignmentsApi, getAgentFeedbackApi } from '../services/api';

const GuideMissions = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [activeMissions, setActiveMissions] = useState([]);
  const [ratingData, setRatingData] = useState({ avg: 0, count: 0 });
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:3000"; 

  useEffect(() => {
    const fetchMissionData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;
    
      try {
        // 1. Fetch Profile for Sidebar
        const userRes = await getUserById(userId).catch(() => null);
        if (userRes?.data) setUserData(userRes.data.user || userRes.data);
    
        // 2. Fetch Assignments
        const assignmentRes = await getGuideAssignmentsApi().catch(() => null);
    
        if (assignmentRes?.data?.success) {
          const allData = assignmentRes.data.data || [];
          
          // Filter ONLY for Active/Upcoming statuses
          const active = allData.filter(item => {
            const s = item.status?.toLowerCase();
            return ['confirmed', 'pending', 'approved', 'assigned'].includes(s);
          });
          setActiveMissions(active);
        }
    
        // 3. Ratings for Sidebar
        const feedbackRes = await getAgentFeedbackApi(userId).catch(() => null);
        if (feedbackRes?.data && Array.isArray(feedbackRes.data)) {
          const total = feedbackRes.data.reduce((acc, curr) => acc + (curr.rating || 0), 0);
          setRatingData({
            avg: feedbackRes.data.length > 0 ? (total / feedbackRes.data.length).toFixed(1) : 0,
            count: feedbackRes.data.length
          });
        }
      } catch (err) {
        console.error("Missions Load Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMissionData();
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center font-black text-cyan-600 bg-white">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
            Loading Mission Brief...
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
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
            <Briefcase className="text-cyan-600" size={32}/> Current Assignments
          </h1>
          <p className="text-slate-500 font-medium mt-1">Ready for your next adventure?</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
        {activeMissions.length > 0 ? (
            activeMissions.map((item) => (
              <div 
                key={item.id}
                onClick={() => navigate(`/guide/trip-details/${item.id}`)} 
                className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm flex justify-between items-center hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex gap-5 items-center">
                  <div className="w-24 h-24 rounded-3xl overflow-hidden bg-slate-50 border-2 border-white">
                    <img 
                      src={item.Package?.packageImage ? `${API_URL}/public/uploads/${item.Package.packageImage}` : "/placeholder.jpg"} 
                      alt="Trek"
                      className="w-full h-full object-cover"
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
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Traveler</p>
                    <p className="font-bold text-cyan-600">{item.User?.fullName}</p>
                  </div>
                  
                  <div className="text-right border-l pl-10 border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Departure</p>
                    <p className="font-bold text-slate-700">
                      {new Date(item.bookingDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase shadow-md">
                    <CheckCircle2 size={16} /> Active
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-24 text-center">
              <Compass className="mx-auto text-slate-200 mb-4" size={48} />
              <p className="text-slate-400 font-bold text-xl uppercase tracking-wider">No assigned missions</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GuideMissions;