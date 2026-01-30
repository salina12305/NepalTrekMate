import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Star, Send, ChevronLeft, MessageSquare, ShieldCheck, Map, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const RateService = () => {
    const { id } = useParams(); 
    const { state } = useLocation();
    const navigate = useNavigate();
    
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const isGuide = window.location.pathname.includes('rate-guide');
    const displayName = isGuide ? state?.guideName : state?.packageName;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) return toast.error("Please select a star rating");
        
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            
            // DYNAMIC ENDPOINTS:
            // Guide ratings go to /rate-guide, Package ratings go to /add
            const endpoint = isGuide 
                ? `http://localhost:3000/api/feedback/rate-guide` 
                : `http://localhost:3000/api/feedback/add`;

            const payload = {
                bookingId: state?.bookingId,
                rating,
                comment,
                guideId: isGuide ? id : null, 
                packageId: !isGuide ? id : null 
            };

            const res = await axios.post(endpoint, payload, { 
                headers: { Authorization: `Bearer ${token}` } 
            });

            if (res.data.success) {
                toast.success(res.data.message);
                navigate('/userdashboard');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Submission failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
            <div className="max-w-xl w-full bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
                <div className={`p-10 text-white text-center relative ${isGuide ? 'bg-cyan-900' : 'bg-indigo-900'}`}>
                    <button onClick={() => navigate(-1)} className="absolute top-8 left-8 text-white/50 hover:text-white transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4 mx-auto border border-white/20">
                        {isGuide ? <ShieldCheck className="text-cyan-400" /> : <Map className="text-indigo-400" />}
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">
                        {isGuide ? 'Guide Evaluation' : 'Package Review'}
                    </p>
                    <h2 className="text-2xl font-black">Rate {displayName}</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                    <div className="flex justify-center gap-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)} className="transition-transform hover:scale-110">
                                <Star size={42} className={star <= (hover || rating) ? "text-amber-400 fill-amber-400" : "text-slate-200"} />
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <MessageSquare className="absolute top-5 left-5 text-slate-300" size={20} />
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-[24px] p-5 pl-14 h-40 outline-none transition-all resize-none font-medium text-slate-600"
                            placeholder={isGuide ? "How was the guide's leadership?" : "How was the trek itinerary?"}
                            required
                        />
                    </div>
                    <button disabled={submitting} className={`w-full py-5 rounded-[24px] font-black uppercase tracking-widest text-xs text-white shadow-xl transition-all ${isGuide ? 'bg-cyan-600 shadow-cyan-100 hover:bg-cyan-700' : 'bg-indigo-600 shadow-indigo-100 hover:bg-indigo-700'} disabled:opacity-50`}>
                        {submitting ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Submit Feedback"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RateService;