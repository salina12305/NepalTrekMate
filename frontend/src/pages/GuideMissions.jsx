
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GuideSidebar from './components/GuideSidebar';
import { MapPin, Compass, CheckCircle2, Briefcase } from 'lucide-react';
import { getUserById, getGuideAssignmentsApi, getAgentFeedbackApi } from '../services/api';

const GuideMissions = () => {
  const navigate = useNavigate();
  // --- STATE ---
  const [userData, setUserData] = useState(null);
  const [activeMissions, setActiveMissions] = useState([]);
  const [ratingData, setRatingData] = useState({ avg: 0, count: 0 });
  const [loading, setLoading] = useState(true);

  const backendUrl = "http://localhost:3000"; 

  /**
   * Helper: Image URL Formatter
   * Converts local file paths (e.g., uploads\image.jpg) into valid web URLs.
   */
  const formatImageUrl = (path) => {
    if (!path) return "/placeholder.jpg";
    if (path.startsWith('http')) return path;
    const cleanPath = path.replace(/\\/g, '/').replace(/^\//, '');
    return `${backendUrl}/${cleanPath}`;
  };

  /**
   * DATA INITIALIZATION
   * Fetches user profile, assigned missions, and agent feedback simultaneously.
   */
  useEffect(() => {
    const fetchMissionData = async () => {
      const userId = localStorage.getItem('userId');
      try {
        const [userRes, assignmentRes, feedbackRes] = await Promise.all([
          getUserById(userId).catch(() => null),
          getGuideAssignmentsApi().catch(() => null),
          getAgentFeedbackApi(userId).catch(() => null)
        ]);

        if (userRes?.data) setUserData(userRes.data.user || userRes.data);

        if (assignmentRes?.data) {
          const allData = assignmentRes.data.assignments || assignmentRes.data.data || [];
          setActiveMissions(allData.filter(item => item.status !== 'finished'));
        }

        if (feedbackRes?.data && Array.isArray(feedbackRes.data)) {
          const total = feedbackRes.data.reduce((acc, curr) => acc + (curr.rating || 0), 0);
          setRatingData({
            avg: feedbackRes.data.length > 0 ? (total / feedbackRes.data.length).toFixed(1) : 0,
            count: feedbackRes.data.length
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMissionData();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-cyan-600">LOADING...</div>;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar with Reputation Stats passed as props */}
      <GuideSidebar userData={userData} averageRating={ratingData.avg} totalReviews={ratingData.count} />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-black text-slate-800 uppercase mb-8 flex items-center gap-3">
          <Briefcase className="text-cyan-600" size={32}/> Assignments
        </h1>
        {/* MISSION LIST SECTION */}
        <div className="grid grid-cols-1 gap-4">
          {activeMissions.length > 0 ? activeMissions.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-[2.5rem] border border-slate-100 flex justify-between items-center shadow-sm">
              <div className="flex gap-5 items-center">
                <div className="w-24 h-24 rounded-3xl overflow-hidden bg-slate-50">
                  <img src={formatImageUrl(item.Package?.packageImage)} className="w-full h-full object-cover" alt="" />
                </div>
                {/* Mission Details */}
                <div>
                  <h3 className="font-black text-slate-800 text-xl">{item.Package?.packageName}</h3>
                  <p className="text-slate-400 text-sm font-bold flex items-center gap-1"><MapPin size={16}/> {item.Package?.destination}</p>
                </div>
              </div>
              {/* Status Badge */}
              <div className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase">
                <CheckCircle2 size={16} /> {item.status}
              </div>
            </div>
          )) : (
            <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
               <p className="text-slate-400 font-bold uppercase">No missions assigned</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GuideMissions;
