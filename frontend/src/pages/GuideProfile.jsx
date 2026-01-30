import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById } from '../services/api'; // Your API call
import { ArrowLeft, Mail, ShieldCheck, MapPin } from 'lucide-react';

const GuideProfile = () => {
  const { id } = useParams(); // Grabs the ID from the URL
  const navigate = useNavigate();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const res = await getUserById(id);
        setGuide(res.data.user || res.data);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGuide();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading Profile...</div>;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 text-slate-600 font-bold hover:text-blue-600">
        <ArrowLeft size={18} /> Back
      </button>
      
      <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-200 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="w-40 h-40 bg-blue-50 rounded-[2rem] overflow-hidden">
            <img 
              src={guide?.profileImage ? `${import.meta.env.VITE_API_BASE_URL}${guide.profileImage}` : "https://via.placeholder.com/150"} 
              className="w-full h-full object-cover" 
              alt={guide?.fullName}
            />
          </div>
          <div>
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase inline-flex items-center gap-1 mb-2">
              <ShieldCheck size={12} /> Verified Guide
            </span>
            <h1 className="text-4xl font-black text-slate-800">{guide?.fullName}</h1>
            <p className="text-slate-500 flex items-center gap-2 mt-2 font-medium">
              <Mail size={16} /> {guide?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideProfile;