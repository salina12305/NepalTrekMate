import React, { useState, useEffect } from 'react';
import TravelAgentSidebar from './components/TravelAgentSidebar';
import TravelAgentHeaderStatCard from './components/TravelAgentHeaderStatCard';
import { Search, Check, X } from 'lucide-react';
import { 
  getUserById, 
  getAllBookingsApi, 
  updateBookingStatusApi, 
  getAgentPackagesApi, 
  getAgentFeedbackApi 
} from '../services/api'; 
import toast from 'react-hot-toast';

const AgentBooking = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState([]);
  const [packageCount, setPackagesCount] = useState(0);
  const [avgRating, setAvgRating] = useState("0.0");

  const fetchData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const [userRes, pkgRes, bookingRes, feedbackRes] = await Promise.all([
        getUserById(userId),
        getAgentPackagesApi(userId),
        getAllBookingsApi(),
        getAgentFeedbackApi(userId)
      ]);
      
      if (userRes?.data) setUserData(userRes.data);

      // 1. Set Package Count
      const packageList = pkgRes.data?.packages || pkgRes.data?.data || pkgRes.data || [];
      setPackagesCount(packageList.length);

      // 2. Define raw data before filtering to avoid "undefined" errors
      const rawBookingData = bookingRes.data?.data || bookingRes.data?.bookings || bookingRes.data || [];

      // 3. Filter for bookings belonging ONLY to this agent
      const myBookings = rawBookingData.filter(b => {
        const bId = b.agentId || b.agent?._id || b.agent;
        const pId = b.Package?.agentId || b.Package?.agent?._id || b.Package?.agent || b.package?.agentId;
        return String(bId) === String(userId) || String(pId) === String(userId);
      });
      
      setBookings(myBookings);

      // 4. Calculate real Average Rating from feedback
      const fbData = feedbackRes.data?.feedbacks || feedbackRes.data || [];
      if (fbData.length > 0) {
        const total = fbData.reduce((acc, curr) => acc + (Number(curr.rating) || 0), 0);
        setAvgRating((total / fbData.length).toFixed(1));
      } else {
        setAvgRating("0.0");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to sync dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

 // AgentBooking.jsx

const handleStatusUpdate = async (bookingId, newStatus) => {
  try {
    // PASS AS TWO SEPARATE ARGUMENTS: id first, then status
    await updateBookingStatusApi(bookingId, newStatus);
    
    toast.success(`Booking ${newStatus}`);
    fetchData(); // Refresh the list
  } catch (err) { 
    console.error("Update error:", err);
    toast.error("Update failed"); 
  }
};

  

  // Improved search logic to handle case sensitivity and nested objects
  const filteredBookings = bookings.filter(b => 
    (b.User?.fullName || b.user?.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (b.Package?.packageName || b.package?.packageName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <TravelAgentSidebar type="agent" userData={userData} activeTab="Bookings" />
      <main className="flex-1 p-8 overflow-y-auto">
        <TravelAgentHeaderStatCard 
          title="Booking Management"
          subtitle="Track and manage your client reservations"
          stats={{
            totalPackages: packageCount, 
            // Count successful statuses
            totalBookings: bookings.filter(b => 
              ['confirmed', 'completed', 'finished'].includes(String(b.status).toLowerCase())
            ).length,     
            // Sum revenue from successful statuses
            revenue: bookings.filter(b => 
              ['confirmed', 'completed', 'finished'].includes(String(b.status).toLowerCase())
            ).reduce((acc, curr) => acc + (Number(curr.totalPrice) || 0), 0),
            rating: avgRating,
            notifications: bookings.filter(b => String(b.status).toLowerCase() === 'pending').length
          }}
          loading={loading}
        />

        <div className="flex justify-between items-center mb-6 gap-4 mt-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer or package..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Package</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking.id || booking._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
                          {(booking.User?.fullName || booking.user?.fullName || "?")[0]}
                        </div>
                        <span className="font-semibold text-slate-700">
                          {booking.User?.fullName || booking.user?.fullName || "Unknown User"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {booking.Package?.packageName || booking.package?.packageName || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{booking.bookingDate || booking.createdAt?.split('T')[0]}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        ['confirmed', 'completed', 'finished'].includes(String(booking.status).toLowerCase()) ? 'bg-green-100 text-green-600' : 
                        String(booking.status).toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">Rs. {booking.totalPrice}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {String(booking.status).toLowerCase() === 'pending' ? (
                          <>
                            <button 
                              onClick={() => handleStatusUpdate(booking.id || booking._id, 'confirmed')}
                              className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(booking.id || booking._id, 'cancelled')}
                              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <span className="text-slate-300 text-xs font-bold italic pr-2 uppercase">Processed</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AgentBooking;