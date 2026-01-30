import React, { useState, useEffect } from 'react';
import TripCard from './TripCard'; 
import UserStatCard from './components/UserStatCard';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUserById, getAllPackagesApi, getMyWishlistApi, getMyBookingsApi } from '../services/api';
import { Star, MessageSquare, ShieldCheck, Map } from 'lucide-react';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('available');
  const [userData, setUserData] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [bookings, setBookings] = useState([]);

  const backendUrl = "http://localhost:3000";

  /**
   * 1. PARALLEL DATA FETCHING
   * Using Promise.all ensures that the dashboard doesn't wait for one request to finish
   * before starting the next, significantly reducing load times.
   */
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem('userId');
        const [userRes, pkgRes, bookingRes] = await Promise.all([
          userId ? getUserById(userId) : Promise.resolve({ data: null }),
          getAllPackagesApi(),
          getMyBookingsApi()
        ]);

        if (userRes?.data) setUserData(userRes.data.user || userRes.data);
        if (bookingRes?.data?.data) setBookings(bookingRes.data.data);
        
        const allPkgs = pkgRes.data.packages || pkgRes.data || [];
        setPackages(Array.isArray(allPkgs) ? allPkgs : []);
      } catch (err) {
        console.error("Dashboard Error:", err);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === 'wishlist') {
      const fetchWishlist = async () => {
        try {
          const res = await getMyWishlistApi();
          if (res.data && res.data.data) {
            const items = res.data.data.filter(item => item.Package).map(item => item.Package);
            setWishlistItems(items);
          }
        } catch (err) {
          toast.error("Couldn't load wishlist");
        }
      };
      fetchWishlist();
    }
  }, [activeTab]);

  /**
   * 2. DATA FILTERING LOGIC
   * We categorize bookings locally to avoid extra backend calls.
   * 'Finished' status moves a booking from 'Upcoming' to 'Past'.
   */
  const upcomingBookings = bookings.filter(b => b.status?.toLowerCase() !== 'finished');
  const pastBookings = bookings.filter(b => b.status?.toLowerCase() === 'finished');

  const formatImageUrl = (path, isPackage = false) => {
    if (!path) return "/ne.png";
    if (path.startsWith('http')) return path;
    let cleanPath = path.replace(/\\/g, '/').replace(/^\//, '');
    return isPackage && !cleanPath.includes('public/uploads') 
      ? `${backendUrl}/public/uploads/${cleanPath}` 
      : `${backendUrl}/${cleanPath}`;
  };

  // HANDLER: Rate Guide
  const handleRateGuide = (booking) => {
    // Check both potential locations for guideId
    const guideId = booking.guideId || booking.guide?.id;
    const guideName = booking.guide?.fullName || "Your Guide";

    if (!guideId) {
        toast.error("No specific guide was assigned to this mission.");
        return;
    }

    // FIX: Navigate to '/rate-guide' and pass BOTH IDs in state
    navigate('/rate-guide', { 
        state: { 
            bookingId: booking.id, 
            guideId: guideId,
            guideName: guideName 
        } 
    });
  };

  // HANDLER: Rate Package (Tour)
  const handleRatePackage = (booking) => {
    // Navigate to your existing tour rating page (ensure this route exists)
    navigate('/rate-package', { 
        state: { 
            bookingId: booking.id, 
            packageName: booking.Package?.packageName,
            agentId: booking.agentId || booking.Package?.agentId
        } 
    });
  };

  const handleRateClick = (booking) => {
    navigate('/rate-guide', { 
      state: { 
        bookingId: booking.id, 
        guideId: booking.guideId, // CRITICAL: This must not be null
        guideName: booking.guide?.fullName || "your guide" 
      } 
    });
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-indigo-600 animate-pulse uppercase tracking-widest">Nepal TrekMate Loading...</div>;

  return (
    <div className="p-6 md:p-12 bg-[#F9FBFF] min-h-screen font-sans">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Hi {userData?.fullName?.split(' ')[0] || 'Explorer'}! 🏔️</h1>
          <p className="text-slate-500 font-medium">Your mountain adventures start here.</p>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} className="text-slate-400 hover:text-red-500 font-bold transition-colors">Log Out</button>
          <div className="w-14 h-14 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-indigo-500">
            {userData?.profileImage ? (
              <img src={formatImageUrl(userData.profileImage)} className="w-full h-full object-cover" alt="Profile" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-black text-xl">{userData?.fullName?.charAt(0)}</div>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <UserStatCard icon="🗺️" label="Discover" onClick={() => setActiveTab('available')} />
        <UserStatCard icon="🏔️" label="My Treks" onClick={() => setActiveTab('upcoming')} />
        <UserStatCard icon="📒" label="Past Logs" onClick={() => setActiveTab('past')} />
      </div>

      <div className="flex gap-8 border-b border-slate-200 mb-10">
        {['available', 'upcoming', 'past', 'wishlist'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'text-indigo-600 border-b-4 border-indigo-600' : 'text-slate-400 border-b-4 border-transparent'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {activeTab === 'available' && packages.map((pkg) => (
          <TripCard key={pkg.id} title={pkg.packageName} description={`${pkg.durationDays} Days • ${pkg.destination}`} date={`Rs. ${pkg.price}`} image={formatImageUrl(pkg.packageImage, true)} onClick={() => navigate(`/view-package/${pkg.id}`)} />
        ))}

        {(activeTab === 'upcoming' || activeTab === 'past') && (
          (activeTab === 'upcoming' ? upcomingBookings : pastBookings).length > 0 ? (
            (activeTab === 'upcoming' ? upcomingBookings : pastBookings).map(booking => (
              <BookingRow 
                key={booking.id} 
                booking={booking} 
                formatImageUrl={formatImageUrl} 
                isPast={activeTab === 'past'} 
                onRateGuide={handleRateGuide}
                onRatePackage={handleRatePackage}
              />
            ))
          ) : (
            <EmptyState message={activeTab === 'upcoming' ? "No trips booked yet." : "No history found."} onBrowse={() => setActiveTab('available')} />
          )
        )}

        {activeTab === 'wishlist' && (
            wishlistItems.length > 0 ? wishlistItems.map(pkg => (
                <TripCard key={pkg.id} title={pkg.packageName} description={`${pkg.durationDays} Days • ${pkg.destination}`} date={`Rs. ${pkg.price}`} image={formatImageUrl(pkg.packageImage, true)} isWishlisted={true} onClick={() => navigate(`/view-package/${pkg.id}`)} />
            )) : <EmptyState message="Wishlist is empty" onBrowse={() => setActiveTab('available')} />
        )}
      </div>
    </div>
  );
};

const BookingRow = ({ booking, formatImageUrl, isPast, onRateGuide, onRatePackage }) => (
  <div className="bg-white rounded-[32px] p-5 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-xl transition-all group">
    <div className="w-full md:w-40 h-40 shrink-0 rounded-[24px] overflow-hidden">
      <img src={formatImageUrl(booking.Package?.packageImage, true)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Trek" />
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-start mb-2">
        <div>
            <h3 className="text-xl font-black text-slate-800 leading-tight">{booking.Package?.packageName}</h3>
            <p className="text-indigo-600 text-xs font-black uppercase tracking-widest mt-1">{booking.Package?.destination}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${isPast ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-600'}`}>
            {booking.status}
        </span>
      </div>
      
      <div className="flex gap-6 mt-4 py-3 border-y border-slate-50">
        <div>
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">Expedition Date</p>
          <p className="text-xs font-bold text-slate-600">{booking.bookingDate}</p>
        </div>
        <div>
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">Total Investment</p>
          <p className="text-xs font-black text-slate-800">Rs. {booking.totalPrice}</p>
        </div>
      </div>

      {isPast && (
        <div className="flex gap-3 mt-5">
          <button 
            onClick={() => onRateGuide(booking)}
            className="flex-1 bg-slate-900 text-white py-3 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all"
          >
            <ShieldCheck size={14} /> Rate Guide
          </button>
          <button 
            onClick={() => onRatePackage(booking)}
            className="flex-1 bg-white border-2 border-slate-900 text-slate-900 py-3 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
          >
            <Map size={14} /> Rate Tour
          </button>
        </div>
      )}
    </div>
  </div>
);

const EmptyState = ({ message, onBrowse }) => (
  <div className="col-span-full text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-200">
    <MessageSquare className="mx-auto text-slate-200 mb-4" size={48} />
    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">{message}</p>
    <button onClick={onBrowse} className="mt-4 text-indigo-600 font-black hover:underline text-sm uppercase tracking-widest">Explore Nepal</button>
  </div>
);

export default UserDashboard;