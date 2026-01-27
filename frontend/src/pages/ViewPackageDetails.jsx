import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPackageById, getUserById } from '../services/api';
import TravelAgentSidebar from './components/TravelAgentSidebar';
import { ArrowLeft, MapPin, Calendar, Banknote, Info, Eye, ShoppingBag, Star } from 'lucide-react';
import toast from 'react-hot-toast';


const ViewPackageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        // Fetch both package details and user data for the sidebar
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

  if (!pkg) return <div className="p-10 text-center font-bold">Package not found.</div>;

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-hidden">
      <TravelAgentSidebar type="agent" userData={userData} />
      
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-8 max-w-6xl mx-auto">
            <button 
                onClick={() => navigate('/agentpackages')} 
                className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all font-bold bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
            >
                <ArrowLeft size={20} /> Back to My Packages
            </button>
            <div className="flex gap-3">
                <button 
                    onClick={() => navigate(`/editpackages/${id}`)} 
                    className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-700 transition-all"
                >
                    Edit This Package
                </button>
            </div>
        </div>

        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Image and Long Description */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-200">
                    <img 
                        src={`${import.meta.env.VITE_API_BASE_URL}/public/uploads/${pkg.packageImage}`} 
                        className="w-full h-[500px] object-cover"
                        alt="Tour Banner"
                        onError={(e) => e.target.src = "https://placehold.co/800x500?text=Image+Not+Found"}
                    />
                    <div className="p-10">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-4xl font-black text-slate-800">{pkg.packageName}</h2>
                            <span className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                                Active Package
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-slate-400 mb-8 font-bold text-lg">
                            <MapPin size={22} className="text-blue-500" /> {pkg.destination}
                        </div>

                        <hr className="mb-8 border-slate-100" />

                        <div className="space-y-4">
                            <h4 className="font-black text-slate-700 text-xl flex items-center gap-2">
                                <Info size={22} className="text-blue-500" /> Package Itinerary & Details
                            </h4>
                            <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                                {pkg.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Quick Stats & Pricing */}
            <div className="space-y-6">
                {/* Price/Duration Card */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">Investment</p>
                    <h2 className="text-5xl font-black text-blue-600 mb-8">Rs. {pkg.price}</h2>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-3 font-black text-slate-700">
                                <Calendar size={20} className="text-blue-500" /> Duration
                            </div>
                            <span className="font-black text-slate-900 text-lg">{pkg.durationDays} Days</span>
                        </div>
                    </div>
                </div>

                {/* Performance Dashboard */}
                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl">
                    <h3 className="font-black text-lg mb-8 flex items-center gap-2 border-b border-white/10 pb-4">
                        <Star size={20} className="text-yellow-400 fill-yellow-400" /> Performance Tracking
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-6 rounded-3xl text-center border border-white/5">
                            <Eye className="mx-auto mb-3 text-blue-400" size={32} />
                            <div className="text-2xl font-black">{pkg.views || 0}</div>
                            <div className="text-[10px] uppercase font-black text-slate-500 tracking-tighter">Total Views</div>
                        </div>
                        <div className="bg-white/5 p-6 rounded-3xl text-center border border-white/5">
                            <ShoppingBag className="mx-auto mb-3 text-emerald-400" size={32} />
                            <div className="text-2xl font-black">{pkg.bookings || 0}</div>
                            <div className="text-[10px] uppercase font-black text-slate-500 tracking-tighter">Bookings</div>
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-6 text-center italic">
                        Updates in real-time based on customer activity
                    </p>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewPackageDetails;