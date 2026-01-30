
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPackageById, toggleWishlistApi, createBookingApi } from '../services/api';
import { MapPin, Clock, ArrowLeft, ShieldCheck, Heart, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const ViewPackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // New State for Booking
  const [bookingDate, setBookingDate] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await getPackageById(id);
        setPkg(res.data);
        setIsWishlisted(res.data.isWishlisted || false);
      } catch (err) {
        console.error("Error fetching details:", err);
        toast.error("Could not load package details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleWishlistToggle = async () => {
    try {
        const res = await toggleWishlistApi({ packageId: id }); 
        setIsWishlisted(res.data.isWishlisted);
        toast.success(res.data.message);
    } catch (err) {
        console.error("Wishlist Error:", err);
        toast.error("Failed to update wishlist");
    }
  };

  // --- NEW BOOKING HANDLER ---
  const handleBooking = async () => {
    if (!bookingDate) {
      return toast.error("Please select a travel date first!");
    }

    setIsBooking(true);
    try {
      const res = await createBookingApi({
        packageId: id,
        bookingDate: bookingDate
      });

      if (res.data.success) {
        toast.success("Booking Request Sent Successfully!");
        // Navigate to dashboard and maybe set a state to open the 'upcoming' tab
        navigate('/userdashboard', { state: { activeTab: 'upcoming' } });
      }
    } catch (err) {
      console.error("Booking Error:", err);
      toast.error(err.response?.data?.message || "Failed to initiate booking.");
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!pkg) return <div className="text-center p-20">Package not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* HEADER NAVIGATION */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold transition-colors"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        <div className="flex items-center gap-4">
            <button 
                onClick={handleWishlistToggle}
                className={`p-2 rounded-full transition-all ${isWishlisted ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-400 hover:text-red-400'}`}
            >
                <Heart fill={isWishlisted ? "currentColor" : "none"} size={24} />
            </button>
            <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
            {pkg.destination}
            </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 pt-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="relative h-[450px] rounded-[40px] overflow-hidden shadow-2xl group">
            <img 
              src={`${backendUrl}/public/uploads/${pkg.packageImage}`} 
              alt={pkg.packageName}
              className="w-full h-full object-cover transition-transform duration-700"
              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <h1 className="text-4xl font-black mb-2">{pkg.packageName}</h1>
              <p className="flex items-center gap-2 opacity-90 font-medium">
                <MapPin size={18} className="text-blue-400" /> {pkg.destination}, Nepal
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black text-slate-800 mb-6">Experience Description</h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line text-lg">
              {pkg.description}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-10 pt-10 border-t border-slate-100">
              <div className="flex flex-col gap-1">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Duration</span>
                <span className="text-slate-800 font-black flex items-center gap-2">
                  <Clock size={16} className="text-blue-500" /> {pkg.durationDays} Days
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Security</span>
                <span className="text-slate-800 font-black flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-500" /> Verified Trek
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: BOOKING SIDEBAR */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 sticky top-28">
            <div className="mb-6">
              <span className="text-slate-400 font-bold text-sm block mb-1">Package Cost</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-blue-600">Rs. {pkg.price}</span>
              </div>
            </div>
            <button 
              onClick={() => navigate('/booking', { state: { pkg } })}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-lg shadow-blue-200 mb-4"
             >
              Book This Trip
           </button>

            <p className="text-center text-slate-400 text-xs font-bold">* Flexible Cancellation</p>

            <hr className="my-6 border-slate-100" />
            
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
               <p className="text-[11px] text-blue-600 font-bold uppercase tracking-wider mb-1">Quick Note</p>
               <p className="text-xs text-blue-800 leading-relaxed">Your booking will be marked as <span className="font-bold">Pending</span> until the travel agent confirms your request.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPackage;