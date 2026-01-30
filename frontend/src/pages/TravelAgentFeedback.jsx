import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TravelAgentSidebar from './components/TravelAgentSidebar';
import TravelAgentHeaderStatCard from './components/TravelAgentHeaderStatCard';
import { 
  getUserById, 
  getAgentFeedbackApi, 
  getAllBookingsApi, 
  getAgentPackagesApi,
  deleteAgentFeedbackApi
} from '../services/api';
import { Star, MessageSquare, ThumbsUp, User, Trash2, AlertTriangle } from 'lucide-react';
import toast from "react-hot-toast";

const TravelAgentFeedback = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [packagesCount, setPackagesCount] = useState(0);
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

  // Helper to format image URLs
  const formatImageUrl = (path) => {
    if (!path) return null;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
    if (path.startsWith('http')) return path;
    return `${baseUrl}/${path.replace(/\\/g, '/')}`;
  };

  useEffect(() => {
    const loadAllData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return navigate('/login');

      try {
        const [userRes, pkgRes, bookingRes, feedbackRes] = await Promise.allSettled([
          getUserById(userId),
          getAgentPackagesApi(userId),
          getAllBookingsApi(),
          getAgentFeedbackApi(userId),
        ]);

        if (userRes.status === 'fulfilled') setUserData(userRes.value.data);

        if (pkgRes.status === 'fulfilled') {
            const pData = pkgRes.value.data.packages || pkgRes.value.data || [];
            setPackagesCount(pData.length);
        }

        if (bookingRes.status === 'fulfilled') {
            const rawData = bookingRes.value.data.data || bookingRes.value.data.bookings || [];
            const myBookings = rawData.filter(b => {
                const bId = b.agentId || b.agent?._id || b.agent;
                const pId = b.Package?.agentId || b.Package?.agent?._id;
                return String(bId) === String(userId) || String(pId) === String(userId);
            });
            setBookings(myBookings);
        }

        if (feedbackRes.status === 'fulfilled') {
            // This now receives ONLY tour reviews (where guideId is null) from your updated backend
            setFeedbacks(feedbackRes.value.data.feedbacks || []);
        } else {
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

  const isSuccessful = (status) => ['confirmed', 'completed', 'finished'].includes(String(status).toLowerCase());

  const handleDelete = async () => {
    try {
        await deleteAgentFeedbackApi(deleteModal.id); 
        toast.success("Review removed");
        setFeedbacks(feedbacks.filter(f => f.id !== deleteModal.id));
        setDeleteModal({ show: false, id: null });
    } catch (err) {
        toast.error("Failed to delete review");
    }
  };

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
      
      {deleteModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <AlertTriangle className="text-red-500" size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-800 text-center mb-2">Delete Review?</h3>
            <p className="text-slate-500 text-center mb-8 font-medium">This action cannot be undone.</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteModal({ show: false, id: null })} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold shadow-lg shadow-red-100">Delete</button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 p-8">
        <TravelAgentHeaderStatCard
          title="Customer Feedback"
          subtitle="What travelers are saying about your tours"
          stats={{
            totalPackages: packagesCount,
            totalBookings: bookings.filter(b => isSuccessful(b.status)).length,
            revenue: bookings.filter(b => isSuccessful(b.status))
                             .reduce((acc, curr) => acc + (Number(curr.totalPrice) || 0), 0),
            rating: avgRating,
            notifications: feedbacks.length
          }}
          loading={loading}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm text-center">
                <h3 className="text-slate-400 font-black uppercase text-xs tracking-widest mb-4">Average Rating</h3>
                <div className="text-6xl font-black text-slate-800 mb-2">{avgRating}</div>
                <div className="flex justify-center gap-1 mb-4 text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={20} fill={star <= Math.round(avgRating) ? "currentColor" : "none"} />
                    ))}
                </div>
                <p className="text-slate-500 font-medium">Based on {feedbacks.length} reviews</p>
            </div>

            <div className="bg-slate-900 p-8 rounded-[32px] text-white shadow-xl">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                    <ThumbsUp size={18} className="text-cyan-400" /> Review Distribution
                </h4>
                <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map(star => {
                        const count = feedbacks.filter(f => Number(f.rating) === star).length;
                        const percentage = feedbacks.length > 0 ? (count / feedbacks.length) * 100 : 0;
                        return (
                          <div key={star} className="flex items-center gap-3">
                            <span className="text-xs font-bold w-4">{star}★</span>
                            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-cyan-500" style={{ width: `${percentage}%` }}></div>
                            </div>
                            <span className="text-[10px] text-slate-400 w-6 text-right">{count}</span>
                          </div>
                        );
                    })}
                </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-black text-slate-800 uppercase text-sm tracking-widest px-2">Recent Tour Reviews</h3>
            {feedbacks.length > 0 ? (
              feedbacks.map((item) => (
               <div key={item.id} className="relative bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm hover:border-cyan-200 transition-all group">                  
                <button 
                  onClick={() => setDeleteModal({ show: true, id: item.id })}
                  className="absolute bottom-6 right-8 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  >
                  <Trash2 size={20} />
                </button>
                  <div className="flex gap-4">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100">
  {item.userPhoto ? (
    <img 
      src={formatImageUrl(item.userPhoto)} 
      alt={item.customerName || "user"} 
      className="w-full h-full object-cover"
      onError={(e) => {
        e.target.onerror = null; 
        // Generates a backup letter avatar if the file is physically missing on the server
        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.customerName || 'T')}&background=random`;
      }}
    />
  ) : ( 
    <User className="text-slate-300" /> 
  )}
</div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-black text-slate-800">{item.customerName || "Traveler"}</h4>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < (item.rating || 0) ? "currentColor" : "none"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs font-bold text-cyan-600 mb-2">{item.packageName}</p>
                      <p className="text-slate-600 text-sm italic">"{item.comment || "No comment left."}"</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-[40px]">
                  <MessageSquare size={48} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No tour reviews yet</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TravelAgentFeedback;