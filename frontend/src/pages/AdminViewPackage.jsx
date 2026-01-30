import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPackageById, getUserById } from '../services/api';
import AdminSidebar from './components/AdminSidebar';
import { 
  ArrowLeft, MapPin, Calendar, Info, 
  ShoppingBag, Star, User, Shield, 
  Mail, Clock, Tag 
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminViewPackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null); // The trek/package data
  const [adminData, setAdminData] = useState(null); // The logged-in admin for sidebar
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const adminId = localStorage.getItem('userId');
        const [pkgRes, adminRes] = await Promise.all([
          getPackageById(id),
          getUserById(adminId)
        ]);
        
        // Match your API structure
        setPkg(pkgRes.data.package || pkgRes.data);
        setAdminData(adminRes.data.user || adminRes.data);
      } catch (err) {
        console.error("Error loading details:", err);
        toast.error("Could not load package details.");
        navigate('/adminpackages');
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <AdminSidebar userData={adminData} />
      
      <main className="flex-1 p-8">
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center gap-2 text-slate-400 hover:text-slate-800 mb-8 font-bold transition-all"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          BACK TO PACKAGES
        </button>

        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* --- PACKAGE HEADER CARD --- */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-blue-600 to-cyan-500 relative">
               <div className="absolute top-6 right-8">
                  <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
                    pkg?.availability ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                  }`}>
                    {pkg?.availability ? 'Active' : 'Inactive'}
                  </span>
               </div>
            </div>

            <div className="px-10 pb-10">
              <div className="relative flex justify-between items-end -mt-20 mb-8">
                <div className="p-2 bg-white rounded-[2.5rem] shadow-2xl">
                  <img 
                    src={pkg?.packageImage ? `${import.meta.env.VITE_API_BASE_URL}/public/uploads/${pkg.packageImage}` : "/placeholder.png"} 
                    className="w-56 h-40 rounded-[2rem] object-cover border-4 border-white"
                    alt="Package"
                    onError={(e) => { e.target.src = "/placeholder.png"; }}
                  />
                </div>
                <div className="pb-4">
                   <h2 className="text-4xl font-black text-slate-800 tracking-tight">Rs. {pkg?.price?.toLocaleString()}</h2>
                   <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] text-right">Per Person</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                  <h1 className="text-5xl font-black text-slate-800 mb-2 tracking-tight">{pkg?.packageName}</h1>
                  <div className="flex flex-wrap gap-4 text-slate-500 mb-8">
                    <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl text-sm font-bold">
                      <MapPin size={16} className="text-blue-500"/> {pkg?.destination}
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl text-sm font-bold">
                      <Clock size={16} className="text-cyan-500"/> {pkg?.durationDays} Days / {pkg?.durationDays - 1} Nights
                    </span>
                  </div>
                  
                  <div className="p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100">
                    <h4 className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest mb-4">
                      <Info size={18} /> Experience Description
                    </h4>
                    <p className="text-slate-600 leading-relaxed text-lg italic">
                      {pkg?.description || "No description provided for this package."}
                    </p>
                  </div>
                </div>

                {/* --- PACKAGE STATS --- */}
                <div className="space-y-4">
                  <PackageStat icon={<Tag className="text-indigo-500"/>} label="Category" value={pkg?.category || "Trekking"} />
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Internal Helper Component
const PackageStat = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm hover:shadow-md transition-all">
    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shadow-sm">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="font-bold text-slate-700">{value}</p>
    </div>
  </div>
);

export default AdminViewPackage;