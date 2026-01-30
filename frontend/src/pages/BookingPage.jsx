
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { 
  Calendar, Mountain, Star, CreditCard, 
  Minus, Plus, ChevronLeft, User, Sparkles, X, CheckCircle2 
} from 'lucide-react';
import { getPackageById, createBookingApi, getAllUsersApi } from '../services/api';
import toast from 'react-hot-toast';

export default function BookingPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // --- States ---
  const [pkg, setPkg] = useState(location.state?.pkg || null);
  const [loading, setLoading] = useState(!location.state?.pkg);
  const [startDate, setStartDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Khalti');
  
  // Guide States
  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [guidesLoading, setGuidesLoading] = useState(true);
  const [viewingGuide, setViewingGuide] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Package if not passed via state
        if (!pkg) {
          const pkgRes = await getPackageById(id);
          setPkg(pkgRes.data.package || pkgRes.data);
        }

        // Fetch Guides
        const userRes = await getAllUsersApi();
        const allUsers = userRes.data.users || userRes.data || [];
        setGuides(allUsers.filter(u => u.role === 'guide'));
      } catch (err) {
        console.error("Booking Page Error:", err);
        toast.error("Failed to load necessary data");
      } finally {
        setLoading(false);
        setGuidesLoading(false);
      }
    };
    fetchData();
  }, [id, pkg]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center font-bold text-indigo-600">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mr-3"></div>
      Loading Trek Details...
    </div>
  );
  
  if (!pkg) return <div className="p-20 text-center font-bold">Package not found.</div>;

  // --- Pricing Logic ---
  const basePrice = Number(pkg.price) || 0;
  const serviceFee = 500;
  const adultsTotal = adults * basePrice;
  const childrenTotal = children * (basePrice * 0.5); // 50% discount for kids
  const totalAmount = adultsTotal + childrenTotal + serviceFee;


  const handleConfirmBooking = async () => {
    if (!startDate) return toast.error('Please select a start date');
    if (!selectedGuide) return toast.error('Please choose a guide for your trek');
  
    const bookingData = {
      packageId: pkg.id || pkg._id,
      guideId: selectedGuide.id || selectedGuide._id, // Fixed: check both id and _id
      bookingDate: startDate,
      // CRITICAL: Calculate total people for the backend
      numberOfPeople: Number(adults) + Number(children), 
      totalPrice: totalAmount,
      paymentMethod: paymentMethod
    };
  
    try {
      const res = await createBookingApi(bookingData);
      if (res.data.success) {
        toast.success("Booking Request Sent Successfully!");
        // Navigate to dashboard and show upcoming tab
        navigate('/userdashboard', { state: { activeTab: 'upcoming' } });
      }
    } catch (err) {
      // If the server is down, this will show "Network Error"
      const errorMessage = err.response?.data?.message || "Server connection failed. Is the backend running?";
      toast.error(errorMessage);
      console.error("Booking Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-indigo-600 font-bold mb-6 hover:translate-x-1 transition-transform">
          <ChevronLeft size={20} /> Back to Trek Details
        </button>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Finalize Your Adventure</h1>
          <p className="text-slate-500">Review your details and prepare for the journey.</p>
        </div>

        {/* Package Banner */}
        <div className="bg-gradient-to-r from-indigo-700 to-blue-600 rounded-[32px] p-8 mb-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md"><Mountain size={32} /></div>
              <div>
                <h2 className="text-3xl font-black">{pkg.packageName}</h2>
                <p className="text-indigo-100 flex items-center gap-2 font-medium">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" /> 4.9 • {pkg.destination}
                </p>
              </div>
            </div>
            <div className="bg-black/20 backdrop-blur-md px-6 py-3 rounded-2xl font-bold">
              {pkg.durationDays} Days Duration
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            
            {/* Step 1: Date & Count */}
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8">
              <SectionHeader title="1. Travel Details" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Start Date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Base Price</label>
                  <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl font-black text-xl border-2 border-emerald-100">
                    Rs. {basePrice} <span className="text-[10px] uppercase opacity-60">/person</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Counter label="Adults" sub="Ages 18+" val={adults} set={(v) => setAdults(Math.max(1, v))} />
                <Counter label="Children" sub="50% Off" val={children} set={(v) => setChildren(Math.max(0, v))} />
              </div>
            </div>

            {/* Step 2: Guide Selection */}
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8">
              <SectionHeader title="2. Select Your Guide" icon={<Sparkles size={18} className="text-indigo-600"/>} />
              <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {guides.map((guide) => (
                  <div 
                    key={guide.id || guide.id}
                    onClick={() => setSelectedGuide(guide)}
                    className={`min-w-[180px] p-6 rounded-[28px] border-2 transition-all cursor-pointer text-center relative ${
                      selectedGuide?.id === guide.id ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-slate-50 bg-white hover:border-slate-200'
                    }`}
                  >
                    <div className="w-20 h-20 rounded-2xl bg-slate-100 mx-auto mb-4 overflow-hidden border-2 border-white shadow-sm">
                      {guide.profileImage ? (
                        <img src={`${import.meta.env.VITE_API_BASE_URL}${guide.profileImage}`} className="w-full h-full object-cover" alt="guide" />
                      ) : <User className="w-full h-full p-5 text-slate-300" />}
                    </div>
                    <p className="font-bold text-slate-800 text-sm truncate">{guide.fullName}</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setViewingGuide(guide); setIsModalOpen(true); }}
                      className="mt-3 text-[10px] font-black text-indigo-600 uppercase tracking-wider"
                    >View Bio</button>
                    {selectedGuide?.id === guide.id && <CheckCircle2 className="absolute top-3 right-3 text-indigo-600" size={18} />}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3: Payment */}
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8">
              <SectionHeader title="3. Payment Method" />
              <div className="grid grid-cols-2 gap-4">
                {['Khalti', 'eSewa'].map((method) => (
                  <label key={method} className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === method ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 hover:bg-slate-50'}`}>
                    <input type="radio" className="hidden" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black ${method === 'Khalti' ? 'bg-purple-600' : 'bg-green-600'}`}>
                      {method[0]}
                    </div>
                    <span className="font-bold text-slate-700">{method} Wallet</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[40px] shadow-xl border border-slate-100 p-10 sticky top-8">
              <h3 className="text-2xl font-black mb-8 border-b pb-4">Trip Summary</h3>
              <div className="space-y-4 mb-10">
                <SummaryItem label="Trek" val={pkg.packageName} />
                <SummaryItem label="Travelers" val={`${adults + children} Total`} />
                <SummaryItem label="Guide" val={selectedGuide?.fullName || "Not Selected"} highlight={!selectedGuide} />
                <SummaryItem label="Service Fee" val={`Rs. ${serviceFee}`} />
                <div className="pt-6 mt-6 border-t-2 border-dashed flex justify-between items-center">
                  <span className="font-bold text-slate-400 uppercase text-xs">Total Amount</span>
                  <span className="text-3xl font-black text-indigo-600">Rs. {totalAmount}</span>
                </div>
              </div>
              <button 
                onClick={handleConfirmBooking}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xl transition-all shadow-lg active:scale-95"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Guide Detail Modal */}
      {isModalOpen && viewingGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div className="h-32 bg-indigo-600 relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-white/80 hover:text-white"><X /></button>
            </div>
            <div className="px-10 pb-10">
              <div className="w-24 h-24 rounded-3xl bg-white p-1.5 shadow-xl -mt-12 mb-6 relative z-10 mx-auto">
                <img src={`${import.meta.env.VITE_API_BASE_URL}${viewingGuide.profileImage}`} className="w-full h-full object-cover rounded-[22px]" alt="guide" />
              </div>
              <h3 className="text-2xl font-black text-center mb-2">{viewingGuide.fullName}</h3>
              <p className="text-slate-500 text-center text-sm leading-relaxed mb-8">
                {viewingGuide.bio || "An experienced Himalayan guide specializing in high-altitude treks and local cultural storytelling."}
              </p>
              <button 
                onClick={() => { setSelectedGuide(viewingGuide); setIsModalOpen(false); }}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold"
              >
                Choose This Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Sub-components for Cleanliness ---
const SectionHeader = ({ title, icon }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-1 h-6 bg-indigo-600 rounded-full" />
    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">{title} {icon}</h3>
  </div>
);

const Counter = ({ label, sub, val, set }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
    <div>
      <p className="font-bold text-slate-800 text-sm">{label}</p>
      <p className="text-[10px] text-slate-400 font-bold uppercase">{sub}</p>
    </div>
    <div className="flex items-center gap-4">
      <button onClick={() => set(val - 1)} className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors"><Minus size={14}/></button>
      <span className="font-black text-lg w-4 text-center">{val}</span>
      <button onClick={() => set(val + 1)} className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors"><Plus size={14}/></button>
    </div>
  </div>
);

const SummaryItem = ({ label, val, highlight }) => (
  <div className="flex justify-between text-sm">
    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{label}</span>
    <span className={`font-black text-right ${highlight ? 'text-rose-500 animate-pulse' : 'text-slate-800'}`}>{val}</span>
  </div>
);