import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Compass, Users, Calendar, CheckCircle, ArrowLeft } from 'lucide-react';
import { getBookingByIdApi, updateBookingStatusApi } from '../services/api'; // Ensure these exist
import toast from 'react-hot-toast';

const GuideTripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Update this block in GuideTripDetails.jsx
   const fetchTripDetails = async () => {
    try {
      const res = await getBookingByIdApi(id);
      console.log("Single Booking Response:", res.data); // Add this!
      if (res.data.success) {
        setBooking(res.data.data);
      }
    } catch (err) {
      console.error("Fetch Error:", err.response); // Log the full error response
      if (err.response?.status === 404) {
          toast.error("Endpoint not found! Check api.js route name.");
      } else {
          toast.error("Failed to load expedition details");
      }
    } finally {
      setLoading(false);
    }
  };
    fetchTripDetails();
  }, [id]);

  const handleCompleteTrip = async () => {
    try {
        const res = await updateBookingStatusApi({ 
            bookingId: id, 
            status: 'completed' 
        });

        if (res.data.success) {
            toast.success("Trip marked as completed!");
            navigate('/guidedashboard');
        }
    } catch (err) {
        console.error("Frontend Update Error:", err);
        toast.error("Database rejected the update. Check server logs.");
    }
};

  if (loading) return <div className="p-20 font-black text-cyan-600">Loading Intelligence...</div>;

  // SAFETY CHECK: If loading is finished but booking is still null
  if (!booking) return (
    <div className="p-20 text-center">
      <p className="text-slate-500 font-bold">Expedition data not found.</p>
      <button onClick={() => navigate(-1)} className="text-cyan-600 underline mt-4">Go Back</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-bold mb-6 hover:text-cyan-600 transition-colors">
        <ArrowLeft size={20} /> Back to Basecamp
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-slate-100">
          {/* Header Image */}
          <div className="h-64 relative">
            <img 
              src={`http://localhost:3000/public/uploads/${booking.Package?.packageImage}`} 
              className="w-full h-full object-cover" 
              alt="Trek"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-10">
              <h1 className="text-4xl font-black text-white uppercase">{booking.Package?.packageName}</h1>
            </div>
          </div>

          <div className="p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Left Side: Stats */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-slate-400 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Users size={16} className="text-cyan-500" /> Expedition Members
                  </h2>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <p className="font-bold text-slate-800 text-lg">{booking.User?.fullName}</p>
                    <p className="text-slate-500 text-sm">Lead Trekker</p>
                    {/* Add more logic here if your booking model supports multiple trekkers */}
                  </div>
                </div>

                <div>
                  <h2 className="text-slate-400 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Calendar size={16} className="text-cyan-500" /> Logistics
                  </h2>
                  <div className="flex gap-4">
                    <div className="bg-cyan-50 p-4 rounded-2xl flex-1 text-center">
                      <p className="text-[10px] font-black text-cyan-600 uppercase">Duration</p>
                      <p className="font-bold text-slate-800">{booking.Package?.durationDays} Days</p>
                    </div>
                    <div className="bg-cyan-50 p-4 rounded-2xl flex-1 text-center">
                      <p className="text-[10px] font-black text-cyan-600 uppercase">Departure</p>
                      <p className="font-bold text-slate-800">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Action */}
              <div className="flex flex-col justify-between">
                <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2.5rem] text-center">
                  <CheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />
                  <h3 className="font-black text-slate-800 text-xl mb-2">Ready for Debrief?</h3>
                  <p className="text-slate-500 text-sm mb-6">Confirming completion will move this trip to your permanent expedition history.</p>
                  
                  <button 
                    onClick={handleCompleteTrip}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-100 transition-all uppercase tracking-widest"
                  >
                    Complete Trip
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideTripDetails;