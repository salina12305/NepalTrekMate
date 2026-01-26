import React, { useEffect, useState } from 'react';
import { getAllBookingsApi, getAllGuidesApi } from '../../services/api'; 
import toast from 'react-hot-toast';

const TravelAgentNotificationHandler = () => {
  const [prevBookingCount, setPrevBookingCount] = useState(null);
  const [prevGuideCount, setPrevGuideCount] = useState(null);
  const agentId = localStorage.getItem('userId');

  useEffect(() => {
    const checkAgentUpdates = async () => {
      try {
        const [bookingRes, guideRes] = await Promise.all([
          getAllBookingsApi().catch(() => ({ data: [] })),
          getAllGuidesApi().catch(() => ({ data: [] }))
        ]);

        const allBookings = bookingRes?.data?.data || bookingRes?.data || [];
        const myBookings = allBookings.filter(b => {
            const pkgAgentId = b.packageId?.agent?._id || b.packageId?.agent;
            return String(pkgAgentId) === String(agentId);
        });

        const currentGuides = (guideRes?.data?.guides || guideRes?.data || []).length;

        if (prevBookingCount !== null && myBookings.length > prevBookingCount) {
          toast.success('🚀 New Booking Received!');
        }
        
        if (prevGuideCount !== null && currentGuides > prevGuideCount) {
          toast('🏔️ New Guide available in system', { icon: '✨' });
        }

        setPrevBookingCount(myBookings.length);
        setPrevGuideCount(currentGuides);
      } catch (err) {
        console.error("Polling Error:", err);
      }
    };

    const interval = setInterval(checkAgentUpdates, 20000);
    checkAgentUpdates();
    return () => clearInterval(interval);
  }, [prevBookingCount, prevGuideCount, agentId]);

  return null;
};

export default TravelAgentNotificationHandler;