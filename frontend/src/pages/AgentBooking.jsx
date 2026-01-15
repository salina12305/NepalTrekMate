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
}

export default AgentBooking;