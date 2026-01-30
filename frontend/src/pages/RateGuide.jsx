import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Star, Send } from 'lucide-react';
import { createGuideFeedbackApi } from '../services/api';
import toast from 'react-hot-toast';

const RateGuide = () => {
  const { state } = useLocation(); 
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hover, setHover] = useState(0);

  // Extract values from state (passed from Dashboard)
  const bookingId = state?.bookingId;
  const guideId = state?.guideId;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) return toast.error("Please select stars");
    
    // Check if the data exists before sending to API
    if (!bookingId || !guideId) {
        return toast.error("Required booking or guide information is missing.");
    }

    try {
        const data = {
            bookingId: bookingId,
            guideId: guideId, 
            rating: rating,
            comment: comment
        };
        
        const res = await createGuideFeedbackApi(data);
        
        if (res.data.success) {
            toast.success("Guide Rated Successfully!");
            navigate('/userdashboard');
        }
    } catch (err) {
        toast.error(err.response?.data?.message || "Error submitting review");
    }
};

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white max-w-md w-full rounded-[40px] p-10 shadow-xl border border-slate-100">
        <h2 className="text-2xl font-black text-slate-800 text-center mb-2 uppercase tracking-tighter">Rate Your Guide</h2>
        <p className="text-slate-400 text-center text-sm font-medium mb-8">How was your guide's service during the trip?</p>

        {/* Star Rating Section */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button" // Important to prevent form submission
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
              className="transition-transform active:scale-90"
            >
              <Star 
                size={40} 
                fill={(hover || rating) >= star ? "#FACC15" : "none"} 
                stroke={(hover || rating) >= star ? "#FACC15" : "#CBD5E1"} 
              />
            </button>
          ))}
        </div>

        <textarea
          className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all h-32 mb-6"
          placeholder="Share your experience with this guide..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button 
          onClick={handleSubmit} // This is likely where your error was (Line 159)
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-cyan-600 transition-all shadow-lg"
        >
          <Send size={18} /> Submit Guide Review
        </button>
      </div>
    </div>
  );
};

export default RateGuide;