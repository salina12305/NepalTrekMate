import React, { useState, useEffect } from 'react';
import TripCard from './TripCard'; 
import UserStatCard from './components/UserStatCard';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getUserById, getAllPackagesApi, getMyWishlistApi } from '../services/api';


const UserDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] =useState([]);

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
        {packages.map((pkg) => (
            <TripCard 
              key={pkg.id}
              title={pkg.packageName} 
              description={`${pkg.durationDays} Days in ${pkg.destination}`} 
              date={`Rs. ${pkg.price}`}
              image={formatImageUrl(pkg.packageImage, true)} 
              onClick={() => navigate(`/view-package/${pkg.id}`)}
            />
        ))}

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
        
        {packages.length === 0 && (
            <div className="w-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium text-lg">No packages available at the moment.</p>
            </div>
        )}
     </div>
    </div>
  );
};

export default UserDashboard;