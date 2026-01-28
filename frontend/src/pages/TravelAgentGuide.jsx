import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TravelAgentSidebar from './components/TravelAgentSidebar';
import TravelAgentHeaderStatCard from './components/TravelAgentHeaderStatCard';
// ADDED getAllBookingsApi and getAgentPackagesApi to the imports
import { getUserById, getAllUsersApi, getAllBookingsApi, getAgentPackagesApi } from '../services/api';
import { User, ShieldCheck, Mail, Briefcase } from 'lucide-react';
import toast from "react-hot-toast";

const TravelAgentGuide = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guides, setGuides] = useState([]);
  const [bookings, setBookings] = useState([]); // Real data for the header
  const [packagesCount, setPackagesCount] = useState(0); // Real count for the header
  const navigate = useNavigate();

  useEffect(() => {
    const loadPageData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return navigate('/login');

      try {
        // 1. Get Logged-in Agent Profile
        const userRes = await getUserById(userId);
        setUserData(userRes.data);

        // 2. Fetch Packages for header consistency
        const pkgRes = await getAgentPackagesApi(userId);
        setPackagesCount(pkgRes.data.packages?.length || 0);

        // 3. Fetch Bookings for header consistency
        const bookingRes = await getAllBookingsApi();
        const bookingData = bookingRes.data.data || bookingRes.data.bookings || bookingRes.data || [];
        setBookings(bookingData);

        // 4. Fetch Guides
        const allUsersRes = await getAllUsersApi(); 
        const allUsers = allUsersRes.data.users || allUsersRes.data || [];
        const registeredGuides = allUsers.filter(u => u.role === 'guide');
        setGuides(registeredGuides);

      } catch (err) {
        console.error("Error loading guides page data:", err);
        // toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    loadPageData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <TravelAgentSidebar type="agent" userData={userData} activeTab="Guide" />

      <main className="flex-1 p-8">
      <TravelAgentHeaderStatCard
          title="Verified Guides"
          subtitle="Explore and connect with registered guides for your packages"
          label1="Total Guides" 
          stats={{
            totalPackages: guides.length, 
            
            // 1. UPDATE: Include 'completed' in total bookings count
            totalBookings: bookings.filter(b => 
              ['confirmed', 'completed'].includes(b.status?.toLowerCase())
            ).length,

            // 2. UPDATE: Include 'completed' in revenue calculation
            revenue: bookings.filter(b => 
              ['confirmed', 'completed'].includes(b.status?.toLowerCase())
            ).reduce((acc, curr) => acc + (Number(curr.totalPrice) || 0), 0),
            
            rating: "4.8",
            notifications: bookings.filter(b => b.status?.toLowerCase() === 'pending').length
          }}
          loading={loading}
        />

        {/* ... Grid UI ... */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 mt-6">
          {guides.length > 0 ? (
            guides.map((guide) => (
              <div key={guide.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col group">
                {/* ... Card content same as before ... */}
                <div className="flex justify-between items-start mb-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100">
                    {guide.profileImage ? (
                      <img 
                        src={`${import.meta.env.VITE_API_BASE_URL}${guide.profileImage}`} 
                        alt={guide.fullName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=User"; }}
                      />
                    ) : (
                      <User size={32} className="text-blue-400" />
                    )}
                  </div>
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg text-[9px] font-black uppercase flex items-center gap-1">
                    <ShieldCheck size={10} /> Verified
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-black text-slate-800 mb-1 leading-tight">{guide.fullName}</h3>
                  <p className="text-slate-500 text-xs font-bold mb-4 flex items-center gap-1"><Mail size={12} /> {guide.email}</p>
                  <div className="bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-100">
                    <div className="flex justify-between items-center">
                       <div className="flex items-center gap-2">
                          <Briefcase size={14} className="text-blue-500" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</span>
                       </div>
                       <span className="text-xs font-bold text-slate-700">Available</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => navigate(`/guide-profile/${guide.id}`)} className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase rounded-xl transition-all shadow-md shadow-blue-100">View Profile</button>
                  <a href={`mailto:${guide.email}`} className="p-2 bg-slate-100 hover:bg-slate-800 hover:text-white text-slate-600 rounded-xl transition-all flex items-center justify-center"><Mail size={16} /></a>
                </div>
              </div>
            ))
          ) : (
             <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
               <p className="text-slate-500 font-bold">No registered guides found.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TravelAgentGuide;