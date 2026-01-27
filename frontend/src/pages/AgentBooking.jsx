import React, { useState, useEffect } from 'react';
import TravelAgentSidebar from './components/TravelAgentSidebar';
import TravelAgentHeaderStatCard from './components/TravelAgentHeaderStatCard';
import { Search, Eye, Calendar, User } from 'lucide-react';
import { getUserById, getAllBookingsApi, updateBookingStatusApi, getAgentPackagesApi } from '../services/api'; 
import toast from 'react-hot-toast';

const AgentBooking = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState([]);
  const [packagesCount, setPackagesCount] = useState(0);

    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('userId');
          const userRes = await getUserById(userId);
          setUserData(userRes.data);
          const pkgRes = await getAgentPackagesApi(userId);
          // FIX 2: Added safety checks for different response structures
          const packageList = pkgRes.data.packages || pkgRes.data.data || pkgRes.data || [];
          setPackagesCount(packageList.length);
    
          const bookingRes = await getAllBookingsApi();
          // FIX 3: Check if your backend sends { data: [...] } or just [...]
          const bookingData = bookingRes.data.data || bookingRes.data.bookings || bookingRes.data || [];
          setBookings(bookingData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await updateBookingStatusApi({ bookingId, status: newStatus });
      toast.success(`Booking ${newStatus}`);
      fetchData(); 
    } catch (err) { toast.error("Update failed"); }
  };

  const filteredBookings = bookings.filter(b => 
    (b.User?.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (b.Package?.packageName || "").toLowerCase().includes(searchTerm.toLowerCase())
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
      <TravelAgentSidebar type="agent" userData={userData} />
      <main className="flex-1 p-8 overflow-y-auto">
        <TravelAgentHeaderStatCard 
            title="Booking Management"
            subtitle="Track and manage your client reservations"
            stats={{
                totalPackages: packagesCount, 
                totalBookings: bookings.filter(b => b.status === 'confirmed').length,
                revenue: bookings.filter(b => b.status === 'confirmed')
                                 .reduce((acc, curr) => acc + (Number(curr.totalPrice) || 0), 0),
                rating: "4.8",
                notifications: bookings.filter(b => b.status === 'pending').length
            }}
            loading={loading}
        />

        {/* 3. Search and Actions Bar */}
        <div className="flex justify-between items-center mb-6 gap-4">
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

        {/* 4. Bookings Table */}
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
                  <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
                          {booking.User?.fullName ? booking.User.fullName[0] : "?"}
                        </div>
                        <span className="font-semibold text-slate-700">{booking.User?.fullName || "Unknown User"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{booking.Package?.packageName || "N/A"}</td>
                    <td className="px-6 py-4 text-slate-600">{booking.bookingDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-600' : 
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">Rs. {booking.totalPrice}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {booking.status === 'pending' ? (
                          <>
                            <button 
                              onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                              className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
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
                <td colSpan="6" className="p-20 text-center text-slate-400 font-bold">
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