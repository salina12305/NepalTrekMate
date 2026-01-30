import React, { useState, useEffect } from 'react';
import GuideSidebar from './components/GuideSidebar';
import { getGuideBookingsApi, getAgentFeedbackApi, getUserById } from '../services/api';
import { History as HistoryIcon, Star, Loader2, MapPin, Calendar, Compass, Quote } from 'lucide-react';

const GuideHistory = () => {
  const [tours, setTours] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const userId = localStorage.getItem('userId');
      try {
        const [aRes, fRes, uRes] = await Promise.all([
          getGuideBookingsApi(),
          getAgentFeedbackApi(userId),
          getUserById(userId)
        ]);
        const all = aRes.data?.data || aRes.data?.assignments || [];
        setTours(all.filter(t => t.status?.toLowerCase() === 'finished'));
        setFeedbacks(fRes.data?.feedbacks || []);
        setUserData(uRes.data?.user || uRes.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-cyan-500" size={40} />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#FDFDFF]">
      <GuideSidebar userData={userData} averageRating="Legacy" totalReviews={tours.length} />
      
      <main className="flex-1 p-12">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-3">
              <Compass className="text-cyan-500" size={36} /> Expedition Log
            </h1>
            <p className="text-slate-400 font-bold text-sm mt-1 uppercase tracking-widest">A record of your successful summits</p>
          </div>
          
          <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl flex items-center gap-4 shadow-xl shadow-slate-200">
            <div className="text-center">
              <span className="block text-[10px] font-black text-slate-400 uppercase leading-none">Total</span>
              <span className="text-xl font-black">{tours.length}</span>
            </div>
          </div>
        </header>

        <div className="relative border-l-2 border-slate-100 ml-4 pl-10 space-y-8">
          {tours.length > 0 ? tours.map((t) => {
            const fb = feedbacks.find(f => f.packageName === t.Package?.packageName);
            return (
              <div key={t.id} className="relative group">
                {/* Timeline Indicator */}
                <div className="absolute -left-[3.05rem] top-6 w-4 h-4 bg-white border-2 border-cyan-500 rounded-full z-10 group-hover:bg-cyan-500 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.3)]" />
                
                <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 flex items-center gap-8 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-900/5 transition-all duration-300">
                  
                  {/* Trip Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-black text-cyan-600 bg-cyan-50 px-3 py-0.5 rounded-full uppercase">Completed</span>
                      <span className="text-slate-300 text-[10px] font-black uppercase flex items-center gap-1">
                        <Calendar size={12} /> {new Date().getFullYear()}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">{t.Package?.packageName}</h3>
                    
                    <div className="flex gap-4 mt-2">
                      <span className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                        <MapPin size={14} className="text-cyan-500"/> {t.Package?.destination}
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-400 text-xs font-bold border-l pl-4">
                      <span className="text-cyan-500 italic">Traveler:</span> {t.User?.fullName || t.traveler?.fullName || "Guest Traveler"}                      </span>
                    </div>

                    {/* Integrated Review */}
                    {fb && (
                      <div className="mt-4 pt-4 border-t border-slate-50 flex items-start gap-3">
                        <Quote size={16} className="text-cyan-100 shrink-0" fill="currentColor" />
                        <div>
                          <p className="text-xs text-slate-500 italic font-medium leading-relaxed">
                            {fb.comment}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={10} className={i < fb.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions / Status */}
                  <div className="shrink-0 flex flex-col items-center justify-center bg-slate-50 w-24 h-24 rounded-3xl">
                    <HistoryIcon className="text-slate-300" size={24} />
                    <span className="text-[9px] font-black text-slate-400 uppercase mt-2">Archived</span>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-24 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-black uppercase tracking-widest">No Log Entries Found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GuideHistory;