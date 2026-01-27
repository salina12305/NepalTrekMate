import React, { useState, useEffect } from 'react';
import TravelAgentSidebar from './components/TravelAgentSidebar';
import TravelAgentHeaderStatCard from './components/TravelAgentHeaderStatCard';
import { Search, Eye, Calendar, User } from 'lucide-react';
import { getUserById } from '../services/api'; // Add specific booking APIs here if you have them

const AgentBooking = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Placeholder for bookings data - replace with API call later
  const [bookings, setBookings] = useState([
    { id: 1, customer: "John Doe", package: "Everest Base Camp", date: "2024-05-20", status: "Confirmed", amount: "Rs. 50,000" },
    { id: 2, customer: "Jane Smith", package: "Annapurna Circuit", date: "2024-06-15", status: "Pending", amount: "Rs. 45,000" },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          const userRes = await getUserById(userId);
          setUserData(userRes.data);
          // You can fetch bookings here: const bookingRes = await getAgentBookings(userId);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* 1. Consistent Sidebar */}
      <TravelAgentSidebar type="agent" userData={userData} />
      
      <main className="flex-1 p-8 overflow-y-auto">
        {/* 2. Consistent Header Component */}
        <TravelAgentHeaderStatCard 
            title="Booking Management"
            subtitle="Track and manage your client reservations"
            stats={{
                totalPackages: 0, // This could be packages with bookings
                totalBookings: bookings.length,
                revenue: "Rs. 95,000",
                rating: "4.8",
                notifications: 2
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
          <button className="bg-white border border-slate-200 p-3 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm text-slate-600">
            <Calendar className="w-5 h-5" />
          </button>
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
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-slate-700">{booking.customer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{booking.package}</td>
                  <td className="px-6 py-4 text-slate-600">{booking.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      booking.status === 'Confirmed' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700">{booking.amount}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-blue-600 transition-colors">
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AgentBooking;