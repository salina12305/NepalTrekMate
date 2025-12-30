import { useState } from 'react';
import { Calendar, Mountain, Star, AlertCircle, CreditCard, Minus, Plus } from 'lucide-react';

export default function BookingForm() {
  const [startDate, setStartDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Khalti');

  const basePrice = 7099;
  const serviceFee = 50;
  const adultsTotal = adults * basePrice;
  const childrenTotal = children * 0; // Children are free in this example
  const totalAmount = adultsTotal + childrenTotal + serviceFee;

  const handleAdultsChange = (delta) => {
    setAdults(Math.max(1, adults + delta));
  };

  const handleChildrenChange = (delta) => {
    setChildren(Math.max(0, children + delta));
  };

  const handleConfirmBooking = () => {
    if (!startDate) {
      alert('Please select a start date');
      return;
    }
    alert(`Booking confirmed!\nTotal: Rs.${totalAmount}\nPayment: ${paymentMethod}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Complete Your Booking</h1>
          <p className="text-gray-600 text-lg">Just a few more steps to confirm your adventure</p>
        </div>

        {/* Trek Info Banner */}
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 mb-6 text-white shadow-lg">
          <div className="flex items-start gap-2 mb-2">
            <Mountain className="mt-1" size={24} />
            <div>
              <h2 className="text-2xl font-bold mb-1">Annapurna Base Camp Trek</h2>
              <p className="text-indigo-100">12-day adventure through stunning mountain landscapes and traditional villages</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span className="font-semibold">12 Days</span>
            </div>
            <div className="flex items-center gap-2">
              <Mountain size={18} />
              <span className="font-semibold">Max Altitude: 4,130m</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={18} fill="currentColor" />
              <span className="font-semibold">4.9 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle size={18} />
              <span className="font-semibold">Moderate Difficulty</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Booking Details */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="text-indigo-600" size={24} />
              <h2 className="text-2xl font-bold">Booking Details</h2>
            </div>

            {/* Date Selection */}
            <div className="mb-6">
              <label className="block font-semibold mb-2">Select Your Dates</label>
              <input
                type="text"
                placeholder="dd/mm/yyyy"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full max-w-md px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              />
              <p className="text-sm text-gray-600 mt-1">Start Date</p>
            </div>

            {/* Number of Travelers */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-4">Number of Travelers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Adults */}
                <div>
                  <label className="block font-semibold mb-3">Adults (18+)</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleAdultsChange(-1)}
                      className="w-12 h-12 border-2 border-gray-300 rounded-lg hover:bg-gray-100 flex items-center justify-center font-bold text-xl"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="text-3xl font-bold w-12 text-center">{adults}</span>
                    <button
                      onClick={() => handleAdultsChange(1)}
                      className="w-12 h-12 border-2 border-gray-300 rounded-lg hover:bg-gray-100 flex items-center justify-center font-bold text-xl"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div>
                  <label className="block font-semibold mb-3">Children (0-17)</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleChildrenChange(-1)}
                      className="w-12 h-12 border-2 border-gray-300 rounded-lg hover:bg-gray-100 flex items-center justify-center font-bold text-xl"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="text-3xl font-bold w-12 text-center">{children}</span>
                    <button
                      onClick={() => handleChildrenChange(1)}
                      className="w-12 h-12 border-2 border-gray-300 rounded-lg hover:bg-gray-100 flex items-center justify-center font-bold text-xl"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="text-indigo-600" size={24} />
                <h3 className="font-bold text-lg">Payment Method</h3>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="eSewa"
                    checked={paymentMethod === 'eSewa'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 w-5 h-5"
                  />
                  <div>
                    <div className="font-bold text-lg">eSewa</div>
                    <div className="text-gray-600 text-sm">Fast and secure digital wallet payment</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="Khalti"
                    checked={paymentMethod === 'Khalti'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 w-5 h-5"
                  />
                  <div>
                    <div className="font-bold text-lg">Khalti</div>
                    <div className="text-gray-600 text-sm">Popular digital payment solution</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Booking Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Tour Package</span>
                <span className="font-semibold">ABC Trek</span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Start Date</span>
                <span className="font-semibold">{startDate || 'Not selected'}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Duration</span>
                <span className="font-semibold">12 Days</span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Travelers</span>
                <span className="font-semibold">{adults} Adult, {children} Children</span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-semibold">{paymentMethod}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Base Price (per person)</span>
                <span className="font-semibold">Rs.{basePrice}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Adults × {adults}</span>
                <span className="font-semibold">Rs.{adultsTotal}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Children × {children}</span>
                <span className="font-semibold">Rs.{childrenTotal}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Service Fee</span>
                <span className="font-semibold">Rs.{serviceFee}</span>
              </div>
              
              <div className="flex justify-between py-3 text-lg font-bold border-t-2 border-gray-300">
                <span>Total Amount</span>
                <span className="text-indigo-600">Rs.{totalAmount}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleConfirmBooking}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold text-lg hover:bg-indigo-700 transition-colors shadow-md"
              >
                Confirm Booking
              </button>
              
              <button
                onClick={() => alert('Booking cancelled')}
                className="w-full py-3 bg-red-300 text-red-900 rounded-lg font-bold text-lg hover:bg-red-400 transition-colors"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}