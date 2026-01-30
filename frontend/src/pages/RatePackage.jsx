import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Star, Send } from 'lucide-react';
import { createFeedbackApi } from '../services/api'; // Standard Tour Feedback API
import toast from 'react-hot-toast';

const RatePackage = () => {
  const { state } = useLocation(); 
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hover, setHover] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // UI Validation: Ensure the user actually picked at least 1 star
    if (rating === 0) return toast.error("Please select stars");

    try {
        const data = {
            bookingId: state.bookingId,
            rating: rating,
            comment: comment
        };
        
        // This targets /api/feedback/add (The Agent/Tour feedback)
        const res = await createFeedbackApi(data);
        
        if (res.data.success) {
            toast.success("Tour Experience Rated!");
            navigate('/userdashboard');
        }
    } catch (err) {
        toast.error("Error submitting review");
    }
};

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white max-w-md w-full rounded-[40px] p-10 shadow-xl border border-slate-100">
        <h2 className="text-2xl font-black text-slate-800 text-center mb-2 uppercase tracking-tighter">Rate the Tour</h2>
        <p className="text-slate-400 text-center text-sm font-medium mb-8">How was the overall trek and organization?</p>

        {/* STAR RATING PICKER */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
              className="transition-transform active:scale-90"
            >
              <Star 
                size={40} 
                fill={(hover || rating) >= star ? "#6366f1" : "none"} 
                stroke={(hover || rating) >= star ? "#6366f1" : "#CBD5E1"} 
              />
            </button>
          ))}
        </div>

        {/* COMMENT AREA */}
        <textarea
          className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-32 mb-6"
          placeholder="What did you think of the itinerary and service?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* SUBMIT BUTTON */}
        <button 
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg"
        >
          <Send size={18} /> Submit Tour Review
        </button>
      </div>
    </div>
  );
};

export default RatePackage;