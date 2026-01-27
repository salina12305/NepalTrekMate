import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TravelAgentSidebar from './components/TravelAgentSidebar';
import TravelAgentHeaderStatCard from './components/TravelAgentHeaderStatCard';
import { 
  getUserById, 
  getAgentFeedbackApi, 
  getAllBookingsApi, 
  getAgentPackagesApi 
} from '../services/api';
import { Star, MessageSquare, ThumbsUp, Calendar, User } from 'lucide-react';
import toast from "react-hot-toast";

const TravelAgentFeedback = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [packagesCount, setPackagesCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAllData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return navigate('/login');

      try {
        // We use individual try/catches or settled promises so one failure doesn't kill the page
        const [userRes, pkgRes, bookingRes, feedbackRes] = await Promise.allSettled([
          getUserById(userId),
          getAgentPackagesApi(userId),
          getAllBookingsApi(),
          getAgentFeedbackApi(userId)
        ]);

        // 1. Handle User Data
        if (userRes.status === 'fulfilled') setUserData(userRes.value.data);

        // 2. Handle Packages
        if (pkgRes.status === 'fulfilled') {
            setPackagesCount(pkgRes.value.data.packages?.length || 0);
        }

        // 3. Handle Bookings
        if (bookingRes.status === 'fulfilled') {
            const bData = bookingRes.value.data.data || bookingRes.value.data.bookings || [];
            setBookings(bData);
        }

        // 4. Handle Feedback
        if (feedbackRes.status === 'fulfilled') {
            setFeedbacks(feedbackRes.value.data.feedbacks || []);
        } else {
            console.error("Feedback API failed:", feedbackRes.reason);
            toast.error("Could not load reviews");
        }
        
      } catch (err) {
        console.error("General loading error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, [navigate]);

  // Logic for stats
  const avgRating = feedbacks.length > 0 
    ? (feedbacks.reduce((acc, curr) => acc + (Number(curr.rating) || 0), 0) / feedbacks.length).toFixed(1)
    : "0.0";

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <TravelAgentSidebar type="agent" userData={userData} activeTab="Feedback" />

      <main className="flex-1 p-8">
        <TravelAgentHeaderStatCard
          title="Customer Feedback"
          subtitle="What travelers are saying about your tours"
          stats={{
            totalPackages: packagesCount,
            totalBookings: bookings.filter(b => b.status?.toLowerCase() === 'confirmed').length,
            revenue: bookings.filter(b => b.status?.toLowerCase() === 'confirmed')
                             .reduce((acc, curr) => acc + (Number(curr.totalPrice) || 0), 0),
            rating: avgRating,
            notifications: feedbacks.length
          }}
          loading={loading}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Left Panel: Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm text-center">
                <h3 className="text-slate-400 font-black uppercase text-xs tracking-widest mb-4">Average Rating</h3>
                <div className="text-6xl font-black text-slate-800 mb-2">{avgRating}</div>
                <div className="flex justify-center gap-1 mb-4 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={20} fill={i < Math.floor(Number(avgRating)) ? "currentColor" : "none"} />
                    ))}
                </div>
                <p className="text-slate-500 font-medium">Based on {feedbacks.length} reviews</p>
            </div>

            <div className="bg-slate-900 p-8 rounded-[32px] text-white shadow-xl">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                    <ThumbsUp size={18} className="text-blue-400" /> Review Distribution
                </h4>
                <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map(star => {
                        const count = feedbacks.filter(f => Number(f.rating) === star).length;
                        const percentage = feedbacks.length > 0 ? (count / feedbacks.length) * 100 : 0;
                        return (
                          <div key={star} className="flex items-center gap-3">
                              <span className="text-xs font-bold w-4">{star}★</span>
                              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                              </div>
                              <span className="text-[10px] text-slate-400 w-6 text-right">{count}</span>
                          </div>
                        );
                    })}
                </div>
            </div>
          </div>

          {/* Right Panel: Feed */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-black text-slate-800 uppercase text-sm tracking-widest px-2">Recent Reviews</h3>
            {feedbacks.length > 0 ? (
              feedbacks.map((item) => (
                <div key={item.id || item._id} className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm hover:border-blue-200 transition-all group">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center overflow-hidden border border-indigo-100">
                      {item.userPhoto ? (
                        <img src={`${import.meta.env.VITE_API_BASE_URL}${item.userPhoto}`} alt="user" className="w-full h-full object-cover" />
                      ) : ( <User className="text-indigo-400" /> )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-black text-slate-800">{item.customerName || "Traveler"}</h4>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < (item.rating || 5) ? "currentColor" : "none"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs font-bold text-blue-600 mb-2">{item.packageName}</p>
                      <p className="text-slate-600 text-sm italic">"{item.comment}"</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-[40px]">
                  <MessageSquare size={48} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No reviews yet</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TravelAgentFeedback;