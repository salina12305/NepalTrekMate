import React, { useEffect } from 'react';
import { getAllBookingsApi, getAllGuidesApi } from '../../services/api'; 
import toast from 'react-hot-toast';

const TravelAgentNotificationHandler = () => {
  const agentId = localStorage.getItem('userId');

  useEffect(() => {
    const checkUpdates = async () => {
      try {
        console.log("Checking for updates...");
        const [bookingRes, guideRes] = await Promise.all([
          getAllBookingsApi().catch(() => ({ data: [] })),
          getAllGuidesApi().catch(() => ({ data: [] }))
        ]);

        // 1. Process Data
        const allBookings = bookingRes?.data?.data || bookingRes?.data || [];
        const myBookingsCount = allBookings.filter(b => {
            const pkgAgentId = b.packageId?.agent?._id || b.packageId?.agent;
            return String(pkgAgentId) === String(agentId);
        }).length;

        const currentGuidesCount = (guideRes?.data?.guides || guideRes?.data || []).length;

        // 2. Persistent Storage Logic
        const storedBookingCount = localStorage.getItem('last_booking_count');
        const storedGuideCount = localStorage.getItem('last_guide_count');

        // Initial setup if LocalStorage is empty
        if (storedBookingCount === null) {
          localStorage.setItem('last_booking_count', myBookingsCount.toString());
          localStorage.setItem('last_guide_count', currentGuidesCount.toString());
          return;
        }

        const prevBookingCount = parseInt(storedBookingCount);
        const prevGuideCount = parseInt(storedGuideCount);

        // 3. Comparison Logic
        if (myBookingsCount > prevBookingCount) {
          console.log("New Booking Detected!");
          notify('🚀 New Booking Received!', 'New Booking', 'A customer booked a trip.', '📅', '/agent/bookings');
          localStorage.setItem('last_booking_count', myBookingsCount.toString());
        }

        if (currentGuidesCount > prevGuideCount) {
          console.log("New Guide Detected!");
          notify('✨ New Guide available!', 'New Guide', 'A new guide joined the platform.', '🏔️', '/agent/guides');
          localStorage.setItem('last_guide_count', currentGuidesCount.toString());
        }

      } catch (err) {
        console.error("Notification Polling Error:", err);
      }
    };

    const notify = (toastMsg, title, desc, icon, link) => {
      toast.success(toastMsg);
      const event = new CustomEvent('agent-notification', {
        detail: { id: Date.now(), title, desc, icon, link }
      });
      window.dispatchEvent(event);
    };

    const interval = setInterval(checkUpdates, 10000); // Checked every 10 seconds for testing
    checkUpdates(); 

    return () => clearInterval(interval);
  }, [agentId]);

  return null;
};

export default TravelAgentNotificationHandler;