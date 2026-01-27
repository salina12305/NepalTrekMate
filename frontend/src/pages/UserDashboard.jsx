import React, { useState, useEffect } from 'react';
import TripCard from './TripCard'; 
import UserStatCard from './components/UserStatCard';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUserById, getAllPackagesApi, getMyWishlistApi, getMyBookingsApi } from '../services/api';

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('available');
  const [userData, setUserData] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] =useState([]);
  const [bookings, setBookings] = useState([]);

  const backendUrl = "http://localhost:3000";

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem('userId');
        const [userRes, pkgRes] = await Promise.all([
          userId ? getUserById(userId) : Promise.resolve({ data: null }),
          getAllPackagesApi()
        ]);

        if (userRes?.data) setUserData(userRes.data);
        
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
          
          // Ensure res.data.data exists before mapping
          if (res.data && res.data.data) {
            // Extract the 'Package' object from the join result
            const items = res.data.data
              .filter(item => item.Package) // Safety check: skip if Package is null
              .map(item => item.Package);
              
            setWishlistItems(items);
          }
        } catch (err) {
          console.error("Wishlist error:", err);
          toast.error("Couldn't load wishlist");
        }
      };
      fetchWishlist();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'upcoming') {
      const fetchBookings = async () => {
        try {
          const res = await getMyBookingsApi();
          if (res.data && res.data.data) {
            setBookings(res.data.data);
          }
        } catch (err) {
          console.error("Bookings error:", err);
          toast.error("Couldn't load bookings");
        }
      };
      fetchBookings();
    }
  }, [activeTab]);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const formatImageUrl = (path, isPackage = false) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    let cleanPath = path.replace(/\\/g, '/').replace(/^\//, '');
    if (isPackage && !cleanPath.includes('public/uploads')) {
      return `${backendUrl}/public/uploads/${cleanPath}`;
    }
    return `${backendUrl}/${cleanPath}`;
  };

  const getTabStyle = (tabName) => ({
    fontSize: '18px',
    fontWeight: activeTab === tabName ? '600' : '500',
    color: activeTab === tabName ? '#5C78C1' : '#666',
    cursor: 'pointer',
    paddingBottom: '10px',
    borderBottom: activeTab === tabName ? '3px solid #5C78C1' : 'none',
    transition: 'all 0.3s ease'
  });

  const wishlistPackages = packages.filter(pkg => pkg.isWishlisted === true);

  if (loading) return <div className="p-20 font-bold">Loading Nepal TrekMate...</div>;

  return (
    <div className="p-10 md:px-[60px] bg-[#f9f9f9] min-h-screen font-sans">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black">Hi {userData?.fullName?.split(' ')[0] || 'User'}! 👋</h1>
          <p className="text-slate-500 mt-1">Welcome to your travel dashboard</p>
        </div>
        <div className="flex items-center gap-8">
          <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} className="text-red-400 font-bold">Log Out</button>
          <div className={`w-14 h-14 rounded-full border-2 border-white shadow-sm overflow-hidden flex items-center justify-center ${userData?.profileImage ? '' : 'bg-[#7986CB]'}`}>
            {userData?.profileImage ? (
              <img src={formatImageUrl(userData.profileImage)} className="w-full h-full object-cover" alt="Profile" />
            ) : (
              <span className="text-white text-xl font-bold">{userData?.fullName?.charAt(0)}</span>
            )}
          </div>
        </div>
      </header>

      <div className="flex gap-6 mb-12">
        <UserStatCard icon="🗺️" label="Browse Tour" onClick={() => setActiveTab('available')} />
        <UserStatCard icon="📋" label="My Bookings" onClick={() => setActiveTab('upcoming')} />
        <UserStatCard icon="💰" label="History" onClick={() => setActiveTab('past')} />
      </div>

      <div className="flex gap-8 border-b border-slate-200 mb-10">
        {['available', 'upcoming', 'past', 'wishlist'].map(tab => (
          <div key={tab} style={getTabStyle(tab)} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </div>
        ))}
      </div>

     <div className="flex gap-8 flex-wrap">
     {activeTab === 'available' && packages.map((pkg) => (
            <TripCard 
              key={pkg.id}
              title={pkg.packageName} 
              description={`${pkg.durationDays} Days in ${pkg.destination}`} 
              date={`Rs. ${pkg.price}`}
              image={formatImageUrl(pkg.packageImage, true)} 
              onClick={() => navigate(`/view-package/${pkg.id}`)}
            />
        ))
        }
        
        {activeTab === 'wishlist' && (
         wishlistItems.length > 0 ? (
           wishlistItems.map((pkg) => (
            <TripCard 
                key={pkg.id}
                title={pkg.packageName} 
                // Using pkg directly because we mapped it in fetchWishlist
                description={`${pkg.durationDays} Days in ${pkg.destination}`} 
                date={`Rs. ${pkg.price}`}
                image={formatImageUrl(pkg.packageImage, true)} 
                isWishlisted={true} 
                // onClick={() => navigate(`/view-package/${pkg.id}`)}
                onClick={() => navigate(`/view-package/${pkg.id}`)} // This matches the User route
            />
        ))
    ) : (
        <div className="w-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium text-lg">Your wishlist is empty. Start hearting some treks!</p>
            <button 
                onClick={() => setActiveTab('available')}
                className="mt-4 text-blue-600 font-bold hover:underline"
            >
                Browse Packages
            </button>
        </div>
    )
)}

{activeTab === 'upcoming' && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {bookings.length > 0 ? (
              bookings.map((booking) => (
                    <div 
                       key={booking.id} 
                       className="bg-white rounded-[32px] p-4 shadow-sm border border-slate-100 flex items-center gap-6 h-44 hover:shadow-md transition-shadow"
                    >
                   {/* Left Side: Package Image - Fixed Square with padding */}
                    <div className="w-32 h-32 md:w-36 md:h-36 shrink-0 rounded-3xl overflow-hidden bg-slate-100">
                       <img 
                          src={formatImageUrl(booking.Package?.packageImage, true)} 
                          className="w-full h-full object-cover" 
                          alt="Trek"
                       />
                    </div>
          
                      {/* Right Side: Booking Details */}
                    <div className="flex-1 pr-2 relative">
                        {/* Status Badge */}
                       <div className={`absolute -top-1 right-0 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            booking.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                        }`}>
                         {booking.status}
                    </div>
            
                    <h3 className="text-xl font-black text-slate-800 mb-0.5 leading-tight">
                      {booking.Package?.packageName}
                    </h3>
                    <p className="text-slate-400 text-sm font-medium mb-4">
                        {booking.Package?.destination}
                    </p>
            
                    <div className="flex gap-8">
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
                           <p className="text-sm font-bold text-slate-700">{booking.bookingDate}</p>
                       </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Paid</p>
                           <p className="text-sm font-black text-indigo-600">Rs. {booking.totalPrice}</p>
                       </div>
                   </div>
                </div>
            </div>
       ))
    ) : (
           <div className="col-span-full text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold text-lg">No adventures planned yet!</p>
               <button 
                   onClick={() => setActiveTab('available')}
                   className="mt-4 text-indigo-600 font-black hover:underline"
                >
                Explore Treks
               </button>
           </div>
        )}
    </div> 
)}
    </div>
    </div>
  );
};

export default UserDashboard;