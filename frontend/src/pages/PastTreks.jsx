import React, { useState, useEffect } from 'react';
import GuideSidebar from './components/GuideSidebar';
import { Clock, MapPin, Calendar, CreditCard } from 'lucide-react';
import { getGuideAssignmentsApi, getUserById, getAgentFeedbackApi } from '../services/api';

const PastTreks = () => {
  const [userData, setUserData] = useState(null);
  const [pastMissions, setPastMissions] = useState([]);
  const [ratingData, setRatingData] = useState({ avg: 0, count: 0 });
  const [loading, setLoading] = useState(true);

  // Define the Backend URL for images
  const API_URL = "http://localhost:3000"; 

  useEffect(() => {
    const fetchHistoryAndProfile = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      try {
        // 1. Fetch Guide Profile (Required for Sidebar Image/Name)
        const userRes = await getUserById(userId).catch(() => null);
        if (userRes?.data) {
          setUserData(userRes.data.user || userRes.data);
        }

        // 2. Fetch Assignments and filter for 'completed'
        const res = await getGuideAssignmentsApi().catch(() => null);
        if (res?.data?.success) {
          const allData = res.data.data || [];
          const history = allData.filter(item => 
            item.status?.toLowerCase() === 'completed'
          );
          setPastMissions(history);
        }

        // 3. Fetch Ratings (Required for Sidebar Stars)
        const feedbackRes = await getAgentFeedbackApi(userId).catch(() => null);
        if (feedbackRes?.data && Array.isArray(feedbackRes.data)) {
          const total = feedbackRes.data.reduce((acc, curr) => acc + (curr.rating || 0), 0);
          setRatingData({
            avg: feedbackRes.data.length > 0 ? (total / feedbackRes.data.length).toFixed(1) : 0,
            count: feedbackRes.data.length
          });
        }
      } catch (err) {
        console.error("Error fetching history/profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryAndProfile();
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center font-black text-cyan-600 bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
        Opening Archives...
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
            <Clock className="text-cyan-600" size={32} /> Expedition History
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Reviewing your successful missions, <span className="text-cyan-600 font-bold">{userData?.fullName || 'Guide'}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {pastMissions.length > 0 ? (
            pastMissions.map((item) => (
              <div 
                key={item.id} 
                className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex justify-between items-center opacity-90 hover:opacity-100 transition-all duration-300"
              >
                <div className="flex gap-6 items-center">
                  <div className="w-20 h-20 rounded-3xl overflow-hidden bg-slate-100 border-2 border-white shadow-inner">
                    <img 
                      src={item.Package?.packageImage ? `${API_URL}/public/uploads/${item.Package.packageImage}` : "/placeholder.jpg"} 
                      alt="Completed Trek"
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                      onError={(e) => { e.target.src = "/placeholder.jpg"; }}
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

                <div className="flex gap-12 items-center pr-4">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center justify-end gap-1">
                      <Calendar size={12}/> Date
                    </p>
                    <p className="font-bold text-slate-600">
                      {new Date(item.bookingDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  
                  <div className="text-right border-l pl-10 border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center justify-end gap-1">
                      <CreditCard size={12}/> Payout
                    </p>
                    <p className="font-bold text-emerald-600 text-lg">
                      Rs.{item.totalPrice}
                    </p>
                  </div>

                  <div className="bg-emerald-100 text-emerald-700 px-5 py-2 rounded-2xl font-black text-[11px] uppercase tracking-wider">
                    Completed
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-24 text-center">
              <div className="text-6xl mb-6 opacity-30">📜</div>
              <p className="text-slate-400 font-bold text-xl uppercase tracking-wider">No history found</p>
              <p className="text-slate-300 text-sm mt-2">Finish your active missions to see them archived here.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PastTreks;