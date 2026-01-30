
import React, { useState, useEffect } from 'react';
import GuideSidebar from './components/GuideSidebar';
import { getGuideBookingsApi } from '../services/api';
import { Clock, CheckCircle, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';

const PastTreks = () => {
  // --- STATE ---
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await getGuideBookingsApi();
      
      // Matches the backend key 'assignments' from your controller
      const allData = res.data.assignments || res.data.data || [];
      
      // Filter for only finished/completed missions
      const finished = allData.filter(b => 
        b.status?.toLowerCase() === 'finished' || 
        b.status?.toLowerCase() === 'completed'
      );
      
      setHistory(finished);
    } catch (err) {
      console.error("History Error:", err);
      toast.error("Could not load trip history.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FDFDFF]">
      {/* Note: We pass history.length as totalReviews here. 
          In a production app, you might want to only count missions 
          where a review was actually left. 
      */}
      <GuideSidebar userData={userData} averageRating={4.9} totalReviews={history.length} />
      
      <main className="flex-1 p-10">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-slate-900">Trip History</h1>
          <p className="text-slate-500 mt-2">View all your successfully completed missions</p>
        </header>
        {/* LOADING STATE */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
          </div>
        ) : history.length > 0 ? (
          /* GRID OF COMPLETED TREKS */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {history.map(trip => (
              <div key={trip.id} className="group bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl">
                    <CheckCircle size={20} />
                  </div>
                  <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest text-slate-500">
                    Archived
                  </span>
                </div>

                <h3 className="font-black text-xl text-slate-800 mb-1">{trip.Package?.packageName}</h3>

                {/* DATE FORMATTING: Converts ISO string to readable local date */}
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
                  <Clock size={14} />
                  <span>Completed on {new Date(trip.bookingDate).toLocaleDateString()}</span>
                </div>

                {/* SUMMARY FOOTER: Traveler info and Guide payout */}
                <div className="flex justify-between items-center pt-5 border-t border-slate-50">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Traveler</p>
                    <p className="text-sm font-bold text-slate-700">{trip.User?.fullName || 'Guest'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Payout</p>
                    <p className="text-lg font-black text-emerald-600">Rs. {trip.totalPrice?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold">No completed missions in your archive yet.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default PastTreks;