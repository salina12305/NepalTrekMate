import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPackageById, getUserById } from '../services/api';
import AdminSidebar from './components/AdminSidebar';
import { ArrowLeft, MapPin, Calendar, Info, Eye, ShoppingBag, Star, User } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminViewPackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const [pkgRes, userRes] = await Promise.all([
          getPackageById(id),
          getUserById(userId)
        ]);
        
        setPkg(pkgRes.data);
        setUserData(userRes.data);
      } catch (err) {
        console.error("Error loading details:", err);
        toast.error("Could not load package details.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-hidden">
      {/* ALWAYS SHOW ADMIN SIDEBAR HERE */}
      <AdminSidebar userData={userData} />
      
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-8 max-w-6xl mx-auto">
            <button 
                onClick={() => navigate('/adminpackages')} 
                className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all font-bold bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
            >
                <ArrowLeft size={20} /> Back to Package Directory
            </button>
            <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-xl font-bold border border-amber-200 text-sm">
                Administrator View Only
            </div>
        </div>

        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Content */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-200">
                    <img 
                        src={`${import.meta.env.VITE_API_BASE_URL}/public/uploads/${pkg.packageImage}`} 
                        className="w-full h-[450px] object-cover"
                        alt="Tour Banner"
                        onError={(e) => e.target.src = "https://via.placeholder.com/800x450"}
                    />
                    <div className="p-10">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-4xl font-black text-slate-800">{pkg.packageName}</h2>
                            <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${pkg.availability ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                {pkg.availability ? "Active" : "Hidden"}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-slate-400 mb-8 font-bold text-lg">
                            <MapPin size={22} className="text-blue-500" /> {pkg.destination}
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-black text-slate-700 text-xl flex items-center gap-2">
                                <Info size={22} className="text-blue-500" /> Full Itinerary
                            </h4>
                            <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                {pkg.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Pricing & Stats */}
            <div className="space-y-6">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">Package Cost</p>
                    <h2 className="text-5xl font-black text-blue-600 mb-8">Rs. {pkg.price}</h2>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-3 font-black text-slate-700">
                                <Calendar size={20} className="text-blue-500" /> Duration
                            </div>
                            <span className="font-black text-slate-900 text-lg">{pkg.durationDays} Days</span>
                        </div>
                        {/* Added Agent Info if available in your pkg object */}
                        <div className="flex items-center justify-between p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                            <div className="flex items-center gap-3 font-black text-slate-700">
                                <User size={20} className="text-blue-500" /> Created By
                            </div>
                            <span className="font-bold text-blue-600 text-sm italic">Agent ID: {pkg.agentId || "Internal"}</span>
                        </div>
                    </div>
                </div>

               
                
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminViewPackage;