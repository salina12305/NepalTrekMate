
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Mountain, CreditCard, Minus, Plus, UserCheck } from 'lucide-react';
import { getAllGuidesApi, createBookingApi } from '../services/api'; 
import toast from 'react-hot-toast';

export default function BookingForm() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const pkg = state?.pkg;

  const [startDate, setStartDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState('');
  const [loading, setLoading] = useState(false);

  // Constants based on package
  const basePrice = pkg?.price || 0;
  const totalAmount = (adults * basePrice); 

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const res = await getAllGuidesApi();
        setGuides(res.data.guides || []);
      } catch (err) {
        toast.error("Could not load guides");
      }
    };
    fetchGuides();
  }, []);

  const handleConfirmBooking = async () => {
    if (!startDate || !selectedGuide) {
      return toast.error('Please select a date and a guide');
    }

    setLoading(true);
    try {
      const bookingData = {
        packageId: pkg.id,
        guideId: selectedGuide,
        bookingDate: startDate,
        totalPrice: totalAmount,
        numberOfTravelers: adults
      };

      await createBookingApi(bookingData);
      toast.success("Booking sent to Guide for confirmation!");
      navigate('/userdashboard');
    } catch (err) {
      toast.error("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRateGuide = (booking) => {
    const guideId = booking.guideId || booking.guide?.id; // Matches your alias 'guide'
    if (!guideId) {
        toast.error("No specific guide was assigned to this mission.");
        return;
    }
    navigate(`/rate-guide`, { // Navigate to the rate page
        state: { 
            bookingId: booking.id, 
            guideId: guideId, // Pass the ID here!
            guideName: booking.guide?.fullName || "Your Guide" 
        } 
    });
};

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Guide Selection Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-6">
              <UserCheck className="text-indigo-600" size={24} />
              <h2 className="text-2xl font-bold">Choose Your Guide</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guides.map((guide) => (
                <div 
                  key={guide.id}
                  onClick={() => setSelectedGuide(guide.id)}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedGuide === guide.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 hover:border-indigo-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
                      {guide.fullName[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{guide.fullName}</p>
                      <p className="text-xs text-slate-500">{guide.experienceYears} Years Exp.</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date & Travelers (Keep your existing UI logic here) */}
          <div className="bg-white rounded-xl shadow-md p-6">
             <h2 className="text-xl font-bold mb-4">Travel Details</h2>
             <input 
               type="date" 
               className="w-full p-3 border rounded-lg mb-4"
               onChange={(e) => setStartDate(e.target.value)}
             />
             {/* ... Adult/Children counters ... */}
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="bg-white rounded-xl shadow-md p-6 h-fit sticky top-6">
          <h2 className="text-xl font-bold mb-4">Summary</h2>
          <div className="text-sm space-y-3 mb-6">
            <div className="flex justify-between"><span>Package</span><span className="font-bold">{pkg?.packageName}</span></div>
            <div className="flex justify-between"><span>Total</span><span className="text-indigo-600 font-black text-xl">Rs. {totalAmount}</span></div>
          </div>
          <button 
            disabled={loading}
            onClick={handleConfirmBooking}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:bg-slate-300"
          >
            {loading ? 'Processing...' : 'Request Booking'}
          </button>
        </div>
      </div>
    </div>
  );
}