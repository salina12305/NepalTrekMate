
import React, { useEffect, useState } from 'react';
import { getAllBookingsApi, getAllGuidesApi } from '../../services/api'; 
import toast from 'react-hot-toast';

const TravelAgentNotificationHandler = ({ onNewNotification }) => {
  const [prevBookings, setPrevBookings] = useState(null);
  const [prevGuides, setPrevGuides] = useState(null);

  useEffect(() => {
    const checkUpdates = async () => {
      try {
        const userId = localStorage.getItem('userId');
        // Individual try-catches within the Promise.all
        const [bRes, gRes] = await Promise.all([
          getAllBookingsApi().catch(err => {
            console.warn("Bookings API working, but error suppressed.");
            return { data: [] };
          }),
          getAllGuidesApi().catch(err => {
            console.error("Guide API 500 Error - Check Backend Console.");
            return { data: [] }; // Fallback to empty so logic continues
          })
        ]);

       // Now this code will run even if gRes failed
        const allBookings = bRes.data?.data || bRes.data?.bookings || bRes.data || [];
        const myBookings = allBookings.filter(b => {
          const agentId = b.agentId || b.agent?._id || b.Package?.agentId;
          return String(agentId) === String(userId);
        });

        const currentBookingsCount = myBookings.length;

        if (prevBookings !== null && currentBookingsCount > prevBookings) {
          toast.success("New Package Booked!");
          if (onNewNotification) {
            onNewNotification({
              id: Date.now(),
              title: "New Booking!",
              desc: "Check your booking list.",
              icon: "✈️",
              link: "/agentbookings",
              time: "Just now"
            });
          }
        }
        setPrevBookings(currentBookingsCount);
      } catch (err) {
        console.error("Critical failure in checkUpdates:", err);
      }
    };

    const interval = setInterval(checkUpdates, 10000);
    checkUpdates();
    return () => clearInterval(interval);
  }, [prevBookings, prevGuides, onNewNotification]);

  return null;
};

export default TravelAgentNotificationHandler;