import React, { useState, useEffect } from 'react';
import { 
  getGuideBookingsApi, 
  getGuideStatsApi, 
  updateBookingStatusApi, 
  getUserById, 
  getMyGuideReviewsApi 
} from '../services/api';
import GuideSidebar from './components/GuideSidebar';
import GuideStatCard from './components/GuideStatCard'; 
import { User, MapPin, Loader2, Star, MessageSquareQuote } from 'lucide-react';
import toast from 'react-hot-toast';

const GuideDashboard = () => {
  const [missions, setMissions] = useState([]);
  const [stats, setStats] = useState({ totalTrips: 0, averageRating: 0 });
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]); 
  const backendUrl = "http://localhost:3000";

  const formatImageUrl = (path) => {
    if (!path) return "/placeholder-trek.jpg";
    const cleanPath = path.replace(/\\/g, '/').replace(/^\//, '');
    return cleanPath.includes('public/uploads') ? `${backendUrl}/${cleanPath}` : `${backendUrl}/public/uploads/${cleanPath}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        
        // Using allSettled so one failing API doesn't kill the whole page
        const results = await Promise.allSettled([
          getGuideBookingsApi(),
          getGuideStatsApi(),
          getUserById(userId),
          getMyGuideReviewsApi()
        ]);

        // 1. Handle Missions
        if (results[0].status === 'fulfilled') {
          const mRes = results[0].value;
          setMissions(mRes.data?.data || mRes.data?.assignments || []);
        }

        // 2. Handle Stats
        if (results[1].status === 'fulfilled') {
          const sRes = results[1].value;
          setStats({
            totalTrips: sRes.data?.totalTrips || 0,
            averageRating: sRes.data?.averageRating || 5.0
          });
        }

        // 3. Handle User
        if (results[2].status === 'fulfilled') {
          const uRes = results[2].value;
          setUserData(uRes.data?.user || uRes.data);
        }

        // 4. Handle Reviews (Mapping strictly to your working traveler name logic)
        if (results[3].status === 'fulfilled') {
          const rRes = results[3].value;
          const rawFeedbacks = rRes.data?.feedbacks || [];
          console.log("Dashboard Reviews Debug:", rawFeedbacks); // Check your console!
          
          setReviews(rawFeedbacks.map(f => ({
            id: f.id,
            rating: f.rating,
            comment: f.comment,
            customerName: f.User?.fullName || "Traveler",
            userPhoto: f.User?.profileImage
          })));
        }

      } catch (err) { 
        console.error("Critical Dashboard Error:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateBookingStatusApi(id, newStatus);
      toast.success(`Mission marked as ${newStatus}`);
      window.location.reload(); 
    } catch (err) { toast.error("Status update failed"); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-cyan-600" size={48} /></div>;

  const activeMissions = missions.filter(m => m.status !== 'finished');

  return (
    <div className="flex min-h-screen bg-[#FDFDFF]">
      <GuideSidebar userData={userData} averageRating={stats.averageRating} totalReviews={stats.totalTrips} />
      
      <main className="flex-1 p-10">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-8 uppercase tracking-tighter">Mission Control</h1>
          <div className="flex gap-4">
            <GuideStatCard label="Total Trips" value={stats.totalTrips} icon="🚀" />
            <GuideStatCard label="Rating" value={`${stats.averageRating} / 5`} icon="⭐" />
            <GuideStatCard label="Active" value={activeMissions.length} icon="🎯" />
          </div>
        </header>

        {/* MISSIONS */}
        <div className="mb-16">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Live Assignments</h2>
          <div className="grid grid-cols-1 gap-6">
            {activeMissions.map((mission) => (
              <div key={mission.id} className="bg-white rounded-[35px] p-6 border border-slate-100 shadow-sm flex items-center gap-8">
                <div className="w-48 h-36 rounded-3xl overflow-hidden bg-slate-100 shrink-0">
                  <img src={formatImageUrl(mission.Package?.packageImage)} className="w-full h-full object-cover" alt="Trip" />
                </div>
                <div className="flex-1">
                  <span className="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-cyan-100 text-cyan-600">• {mission.status}</span>
                  <h3 className="text-2xl font-black text-slate-800 mt-2">{mission.Package?.packageName}</h3>
                  <div className="flex gap-6 mt-4 text-slate-500 text-sm font-bold">
                    <span className="flex items-center gap-2"><User size={16} className="text-cyan-500"/> {mission.User?.fullName}</span>
                    <span className="flex items-center gap-2"><MapPin size={16} className="text-cyan-500"/> {mission.Package?.destination}</span>
                  </div>
                </div>
                <button onClick={() => handleStatusChange(mission.id, mission.status === 'pending' ? 'confirmed' : 'finished')} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase">
                  {mission.status === 'pending' ? 'Accept Trip' : 'Complete Mission'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <div className="mt-12">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Latest Traveler Logs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.length > 0 ? reviews.slice(0, 4).map((rev) => (
              <div key={rev.id} className="bg-white p-6 rounded-[35px] border border-slate-100 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center font-black text-cyan-600">
                  {rev.customerName.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-slate-800 text-sm">{rev.customerName}</h4>
                  <p className="text-slate-500 text-xs italic mt-1">"{rev.comment || "No comment provided."}"</p>
                  <div className="flex gap-0.5 mt-2">
                     {[...Array(rev.rating)].map((_, i) => <Star key={i} size={10} className="fill-amber-400 text-amber-400" />)}
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-2 p-10 text-center bg-slate-50 rounded-[35px] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">No reviews synced to dashboard yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GuideDashboard;