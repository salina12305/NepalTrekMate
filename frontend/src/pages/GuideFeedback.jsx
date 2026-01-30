import React, { useState, useEffect } from 'react';
import GuideSidebar from './components/GuideSidebar';
import { getMyGuideReviewsApi, getUserById, deleteFeedbackApi } from '../services/api'; // Use the Guide-specific API
import { Star, MessageSquare, Loader2, User, ThumbsUp, Trash2, AlertTriangle  } from 'lucide-react';
import toast from "react-hot-toast";

const GuideFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const backendUrl = "http://localhost:3000";

  useEffect(() => {
    const loadData = async () => {
      const userId = localStorage.getItem('userId');
      try {
        // Fetch Guide-specific reviews and User Profile
        const [feedbackRes, userRes] = await Promise.allSettled([
          getMyGuideReviewsApi(), // Calls /api/feedback/my-reviews
          getUserById(userId)
        ]);

        
        if (feedbackRes.status === 'fulfilled') {
            const rawFeedbacks = feedbackRes.value.data.feedbacks || [];
            const formattedFeedbacks = rawFeedbacks.map(f => ({
              id: f.id,
              rating: f.rating,
              comment: f.comment,
              packageName: f.Booking?.Package?.packageName || "Trek Expedition",
              // CHANGE THIS: Use 'customer' instead of 'User' to match backend alias
              customerName: f.customer?.fullName || "Traveler", 
              userPhoto: f.customer?.profileImage // Matches the 'customer' alias
            }));
            setFeedbacks(formattedFeedbacks);
        } else {
          toast.error("Could not load reviews");
        }
        if (userRes.status === 'fulfilled') {
          setUserData(userRes.value.data.user || userRes.value.data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Calculate Average Rating
  const avgRating = feedbacks.length > 0 
    ? (feedbacks.reduce((acc, curr) => acc + (Number(curr.rating) || 0), 0) / feedbacks.length).toFixed(1)
    : "0.0";

    const confirmDelete = async () => {
        try {
            // Ensure this matches the function name in api.js
            const res = await deleteFeedbackApi(deleteModal.id); 
            
            if (res.data.success) {
                toast.success("Log deleted successfully");
                // Remove from the UI list immediately
                setFeedbacks(prev => prev.filter(item => item.id !== deleteModal.id));
                // Close the modal
                setDeleteModal({ show: false, id: null });
            }
        } catch (err) {
            console.error("Delete Error:", err.response?.data || err.message);
            toast.error("Failed to delete review");
        }
    };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-cyan-600" size={48} />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <GuideSidebar userData={userData} averageRating={avgRating} totalReviews={feedbacks.length} />
      {deleteModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <AlertTriangle className="text-red-500" size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-800 text-center mb-2">Delete Log?</h3>
            <p className="text-slate-500 text-center mb-8 font-medium">This will remove the traveler's review from your profile permanently.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setDeleteModal({ show: false, id: null })} 
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete} 
                className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold shadow-lg shadow-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      <main className="flex-1 p-10">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">Expedition Reviews</h1>
          <p className="text-slate-500 font-medium">Insights from the travelers you've guided across the Himalayas.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Stats Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm text-center">
                <h3 className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-4">Guide Score</h3>
                <div className="text-7xl font-black text-slate-800 mb-2">{avgRating}</div>
                <div className="flex justify-center gap-1 mb-4 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={20} fill={i < Math.floor(Number(avgRating)) ? "currentColor" : "none"} />
                    ))}
                </div>
                <p className="text-slate-500 font-bold text-sm tracking-tight">Based on {feedbacks.length} Guest Logs</p>
            </div>

            <div className="bg-slate-900 p-8 rounded-[32px] text-white shadow-xl">
                <h4 className="font-bold mb-6 flex items-center gap-2 text-cyan-400 uppercase text-xs tracking-widest">
                    Rating Distribution
                </h4>
                <div className="space-y-4">
                    {[5, 4, 3, 2, 1].map(star => {
                        const count = feedbacks.filter(f => Number(f.rating) === star).length;
                        const percentage = feedbacks.length > 0 ? (count / feedbacks.length) * 100 : 0;
                        return (
                          <div key={star} className="flex items-center gap-3">
                            <span className="text-[10px] font-black w-4">{star}★</span>
                            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-cyan-500" style={{ width: `${percentage}%` }}></div>
                            </div>
                            <span className="text-[10px] text-slate-500 w-6 text-right font-black">{count}</span>
                          </div>
                        );
                    })}
                </div>
            </div>
          </div>

          {/* RIGHT: Feedback Feed */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-black text-slate-400 uppercase text-[10px] tracking-widest px-2 flex items-center gap-2 mb-2">
                <MessageSquare size={14} className="text-cyan-600" /> Recent Expedition Logs
            </h3>
            
            {feedbacks.length > 0 ? (
              feedbacks.map((item) => (
<div key={item.id} className="bg-white border border-slate-100 rounded-[32px] p-7 shadow-sm hover:border-cyan-200 transition-all group relative">               <button 
        onClick={() => setDeleteModal({ show: true, id: item.id })}
        className="absolute top-16 right-8 p-2 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"      >
        <Trash2 size={18} />
      </button>                 
                  <div className="flex gap-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-[20px] flex items-center justify-center overflow-hidden border border-slate-100 shrink-0">
  {item.userPhoto ? (
    <img 
      src={`${backendUrl}/${item.userPhoto.replace(/\\/g, '/').replace(/^public\//, '')}`} 
      alt={item.customerName}
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
      onError={(e) => { 
        // If this runs, it means the URL above returned a 404
        e.target.onerror = null; 
        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.customerName)}&background=random`; 
      }}
    />
  ) : (
    <User size={30} className="text-slate-300" />
  )}
</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                           <h4 className="font-black text-slate-800 text-lg leading-none mb-1">{item.customerName}</h4>
                           <p className="text-[10px] font-black text-cyan-600 uppercase tracking-widest mb-3">{item.packageName}</p>
                        </div>
                        <div className="flex text-amber-400 bg-amber-50 px-2 py-1 rounded-lg">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill={i < (item.rating || 5) ? "currentColor" : "none"} />
                          ))}
                        </div>
                      </div>
                      <div className="relative">
                        <span className="absolute -left-3 -top-1 text-4xl text-slate-100 font-serif">“</span>
                        <p className="text-slate-600 text-sm italic font-medium relative z-10 leading-relaxed">
                          {item.comment || "The guest did not leave a written log, but completed the expedition with you."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-24 bg-white border-2 border-dashed border-slate-200 rounded-[40px]">
                  <MessageSquare size={48} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Your guide legacy is empty</p>
                  <p className="text-slate-300 text-[10px] mt-2">Reviews will appear here once travelers rate your treks.</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default GuideFeedback;