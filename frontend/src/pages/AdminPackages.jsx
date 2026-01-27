import React, { useState, useEffect } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminHeaderStatCard from './components/AdminHeaderStatCard'; 
import { Search, Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUserById, getAllPackagesApi, deletePackageApi, getAllUsersApi } from '../services/api'; 
import toast from 'react-hot-toast';

const AdminPackages = () => {
  const [packages, setPackages] = useState([]);
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Get userId at the very beginning of the function
      const storedUserId = localStorage.getItem('userId'); 

      try {
        // Run fetches. Note: We only call getUserById if storedUserId exists
        const [packagesRes, allUsersRes, userProfileRes] = await Promise.all([
          getAllPackagesApi(),
          getAllUsersApi(),
          storedUserId ? getUserById(storedUserId) : Promise.resolve({ data: null })
        ]);

        // 1. Handle Admin Profile Data
        if (userProfileRes?.data) {
          setUserData(userProfileRes.data);
        }

        // 2. Handle Packages Data
        const allPkgs = packagesRes.data.packages || packagesRes.data || [];
        setPackages(Array.isArray(allPkgs) ? allPkgs : []);

        // 3. Handle Users Data (for stats)
        const allUsers = allUsersRes.data.users || allUsersRes.data || [];
        setUsers(Array.isArray(allUsers) ? allUsers : []);

      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;
    try {
      const response = await deletePackageApi(id);
      if (response.data.success) {
        setPackages(prev => prev.filter(pkg => (pkg._id || pkg.id) !== id));
        toast.success("Package deleted successfully");
      }
    } catch (err) {
      toast.error("Error deleting package");
    }
  };

  const filteredPackages = packages.filter(pkg => 
    pkg.packageName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.destination?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <AdminSidebar userData={userData} />
      
      <main className="flex-1 p-8">
        <AdminHeaderStatCard
           title="Package Management"
           subtitle="Overview of all trekking and tour experiences"
           loading={loading}
           firstCardLabel="Total Packages"
           stats={{
             totalPackages: packages.length,
             activeAgents: users.filter(u => 
             (u.role === 'agent' || u.role === 'travelagent') && 
             u.status === 'approved').length,
             pending: users.filter(u => u.status === 'pending').length,
             revenue: "Rs. 0"
           }}
         />
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
          <div className="p-4 bg-[#E6F4F9]/30 flex justify-between items-center border-b">
            <h3 className="font-bold text-slate-800">Package Directory</h3>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search package or destination..." 
                className="pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 outline-none w-64 focus:ring-2 focus:ring-blue-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b">
                <tr className="text-[11px] uppercase text-slate-400 font-bold">
                  <th className="px-6 py-4">Package</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan="5" className="p-10 text-center text-slate-400">Loading...</td></tr>
                ) : filteredPackages.length === 0 ? (
                    <tr><td colSpan="5" className="p-10 text-center text-slate-400">No packages found.</td></tr>
                ) : filteredPackages.map((pkg) => (
                  <tr key={pkg._id || pkg.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-12 h-10 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                        <img 
                          src={pkg.packageImage ? `${import.meta.env.VITE_API_BASE_URL}/public/uploads/${pkg.packageImage}` : "/placeholder.png"} 
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = "/placeholder.png"; }} 
                        />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-800">{pkg.packageName}</div>
                        <div className="text-[11px] text-slate-400">{pkg.destination}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-700">Rs. {pkg.price}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{pkg.durationDays} Days</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${pkg.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {pkg.availability ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <button 
                            onClick={() => navigate(`/admin/view-package/${pkg._id || pkg.id}`)} 
                            className="text-blue-600 hover:text-blue-800"
                            >
                            <Eye size={18} />
                          </button>
                            <button onClick={() => handleDelete(pkg._id || pkg.id)} className="text-red-500 hover:text-red-700">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPackages;