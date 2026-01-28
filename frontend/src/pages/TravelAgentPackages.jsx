import React, { useState, useEffect } from 'react';
import TravelAgentSidebar from './components/TravelAgentSidebar';
import TravelAgentHeaderStatCard from './components/TravelAgentHeaderStatCard';
import { useNavigate } from 'react-router-dom';
import { getUserById, getAgentPackagesApi, getAllBookingsApi, deletePackageApi } from '../services/api';
import { MapPin } from 'lucide-react'; 
import toast from 'react-hot-toast';

const TravelAgentPackages = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPageData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) return navigate('/login');

        const userRes = await getUserById(userId);
        setUserData(userRes.data);

        const pkgRes = await getAgentPackagesApi(userId);
        setPackages(pkgRes.data.packages || pkgRes.data || []);

        const bookingRes = await getAllBookingsApi();
        const bookingData = bookingRes.data.data || bookingRes.data.bookings || bookingRes.data || [];
        setBookings(bookingData);

      } catch (err) { 
        console.error("Error loading data:", err); 
      } 
      finally { setLoading(false); }
    };
    loadPageData();
  }, [navigate]);


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;

    try {
      const response = await deletePackageApi(id);
      if (response.data.success) {
        setPackages(prev => prev.filter(pkg => (pkg.id || pkg._id) !== id));
        toast.success("Package deleted successfully");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting package");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <TravelAgentSidebar type="agent" userData={userData} />
      <main className="flex-1 p-8">
      <TravelAgentHeaderStatCard
          title="My Packages"
          subtitle="Manage your tour offerings"
          stats={{
            totalPackages: packages.length,
            // 1. UPDATE: Count confirmed AND completed bookings
            totalBookings: bookings.filter(b => 
              ['confirmed', 'completed'].includes(b.status?.toLowerCase())
            ).length,
            
            // 2. UPDATE: Sum revenue for confirmed AND completed bookings
            revenue: bookings.filter(b => 
              ['confirmed', 'completed'].includes(b.status?.toLowerCase())
            ).reduce((acc, curr) => acc + (Number(curr.totalPrice) || 0), 0),
            
            rating: "4.8",
            notifications: bookings.filter(b => b.status === 'pending').length
          }}
          loading={loading}
        />

        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8 mt-6">
          {/* Add New Package Card remains as it is a core management action */}
          <div
            onClick={() => navigate('/agentapackage')}
            className="border-2 border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-blue-400 transition-all min-h-[300px] bg-slate-50/50 group"
          >
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-sm mb-3">
              +
            </div>
            <p className="text-slate-500 font-bold text-sm">Add New Package</p>
          </div>

          {/* Conditional Rendering for Package List */}

          {packages.length > 0 ? (
            packages.map((pkg) => (
              <div key={pkg.id || pkg._id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all flex flex-col">

                {/* Package Info Area */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100">
                      {pkg.packageImage ? (
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL}/public/uploads/${pkg.packageImage}`}
                          alt="pkg"
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=No+Image"; }}
                        />
                      ) : (
                        <span className="text-3xl">🏔️</span>
                      )}
                    </div>
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-[10px] font-bold uppercase">Active</span>
                  </div>

                  <h3 className="text-lg font-black text-slate-800 mb-1">
                    {pkg.packageName}
                  </h3>
                  <p className="text-slate-500 text-xs mb-4 font-bold flex items-center gap-1">
                    <MapPin size={12} className="text-blue-400" /> {pkg.destination || "Nepal"}
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">⏱️ {pkg.durationDays} Days</div>
                  <div className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">💰 Rs. {pkg.price}</div>
                </div>
                <div className="flex gap-2">
                  <button
                   onClick={() => navigate(`/agent/package-details/${pkg.id}`)}
                    className="flex-1 py-2 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 text-[10px] font-black uppercase rounded-xl transition-all"
                  >
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/agent/edit-package/:id${pkg.id || pkg._id}`)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-800 hover:text-white text-slate-700 text-[10px] font-black uppercase rounded-xl transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id || pkg._id)}
                    className="flex-1 py-2 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 text-[10px] font-black uppercase rounded-xl transition-all"
                  >
                    Delete
                  </button>
                  </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-slate-400 italic">
              No packages found. Click "+" to create your first tour!
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TravelAgentPackages;