import React, { useState, useEffect } from 'react';
import TripCard from './TripCard'; 
import UserStatCard from './components/UserStatCard';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getUserById, getAllPackagesApi } from '../services/api';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const formatImageUrl = (path, isPackage = false) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    let cleanPath = path.replace(/\\/g, '/').replace(/^\//, '');
    if (isPackage && !cleanPath.includes('public/uploads')) {
      return `${backendUrl}/public/uploads/${cleanPath}`;
    }
    return `${backendUrl}/${cleanPath}`;
  };

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

      {/* Stats Section - Kept Browse Tour as the primary action */}
      <div className="flex gap-6 mb-12">
        <UserStatCard icon="🗺️" label="Browse Tour" onClick={() => {}} />
      </div>

      <div className="flex gap-8 border-b border-slate-200 mb-10">
        <div style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#5C78C1',
            paddingBottom: '10px',
            borderBottom: '3px solid #5C78C1'
        }}>
            Available Packages
        </div>
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