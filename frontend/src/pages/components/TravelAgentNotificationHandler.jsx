// // import React, { useEffect } from 'react';
// // import { getAllBookingsApi, getAllGuidesApi } from '../../services/api'; 
// // import toast from 'react-hot-toast';

// // const TravelAgentNotificationHandler = () => {
// //   const agentId = localStorage.getItem('userId');

// //   useEffect(() => {
// //     const checkUpdates = async () => {
// //       try {
// //         console.log("Checking for updates...");
// //         const [bookingRes, guideRes] = await Promise.all([
// //           getAllBookingsApi().catch(() => ({ data: [] })),
// //           getAllGuidesApi().catch(() => ({ data: [] }))
// //         ]);

// //         // 1. Process Data
// //         const allBookings = bookingRes?.data?.data || bookingRes?.data || [];
// //         const myBookingsCount = allBookings.filter(b => {
// //             const pkgAgentId = b.packageId?.agent?._id || b.packageId?.agent;
// //             return String(pkgAgentId) === String(agentId);
// //         }).length;

// //         const currentGuidesCount = (guideRes?.data?.guides || guideRes?.data || []).length;

// //         // 2. Persistent Storage Logic
// //         const storedBookingCount = localStorage.getItem('last_booking_count');
// //         const storedGuideCount = localStorage.getItem('last_guide_count');

// //         // Initial setup if LocalStorage is empty
// //         if (storedBookingCount === null) {
// //           localStorage.setItem('last_booking_count', myBookingsCount.toString());
// //           localStorage.setItem('last_guide_count', currentGuidesCount.toString());
// //           return;
// //         }

// //         const prevBookingCount = parseInt(storedBookingCount);
// //         const prevGuideCount = parseInt(storedGuideCount);

// //         // 3. Comparison Logic
// //         if (myBookingsCount > prevBookingCount) {
// //           console.log("New Booking Detected!");
// //           notify('🚀 New Booking Received!', 'New Booking', 'A customer booked a trip.', '📅', '/agent/bookings');
// //           localStorage.setItem('last_booking_count', myBookingsCount.toString());
// //         }

// //         if (currentGuidesCount > prevGuideCount) {
// //           console.log("New Guide Detected!");
// //           notify('✨ New Guide available!', 'New Guide', 'A new guide joined the platform.', '🏔️', '/agent/guides');
// //           localStorage.setItem('last_guide_count', currentGuidesCount.toString());
// //         }

// //       } catch (err) {
// //         console.error("Notification Polling Error:", err);
// //       }
// //     };

// //     const notify = (toastMsg, title, desc, icon, link) => {
// //       toast.success(toastMsg);
// //       const event = new CustomEvent('agent-notification', {
// //         detail: { id: Date.now(), title, desc, icon, link }
// //       });
// //       window.dispatchEvent(event);
// //     };

// //     const interval = setInterval(checkUpdates, 10000); // Checked every 10 seconds for testing
// //     checkUpdates(); 

// //     return () => clearInterval(interval);
// //   }, [agentId]);

// //   return null;
// // };

// // export default TravelAgentNotificationHandler;
// import React, { useEffect, useState } from 'react';
// import { getAllBookingsApi, getAllGuidesApi } from '../../services/api'; 
// import toast from 'react-hot-toast';

// const TravelAgentNotificationHandler = ({ onNewNotification }) => {
//   const [prevBookings, setPrevBookings] = useState(null);
//   const [prevGuides, setPrevGuides] = useState(null);

//   useEffect(() => {
//     const checkUpdates = async () => {
//       try {
//         const userId = localStorage.getItem('userId');
//         const [bRes, gRes] = await Promise.all([
//           getAllBookingsApi().catch(() => ({ data: [] })),
//           getAllGuidesApi().catch(() => ({ data: [] }))
//         ]);

//         // Filter bookings for this specific agent
//         const allBookings = bRes.data?.data || bRes.data?.bookings || bRes.data || [];
//         const myBookings = allBookings.filter(b => 
//           String(b.agentId || b.agent?._id || b.Package?.agentId) === String(userId)
//         );
//         const currentBookingsCount = myBookings.length;

//         // Guides count (system wide)
//         const currentGuidesCount = (gRes.data?.guides || gRes.data || []).length;

//         // Logic for New Booking
//         if (prevBookings !== null && currentBookingsCount > prevBookings) {
//           const newNoti = {
//             id: Date.now() + Math.random(),
//             title: "New Package Booked!",
//             desc: `A new customer has booked your package.`,
//             icon: "✈️",
//             link: "/agent/bookings",
//             time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//           };
//           toast.success(newNoti.title);
//           if (onNewNotification) onNewNotification(newNoti);
//         }

//         // Logic for New Guide
//         if (prevGuides !== null && currentGuidesCount > prevGuides) {
//           const newNoti = {
//             id: Date.now() + Math.random(),
//             title: "New Guide Registered",
//             desc: "A new guide has joined the platform.",
//             icon: "🗺️",
//             link: "/agent/guides",
//             time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//           };
//           toast("🌟 New Guide Joined!");
//           if (onNewNotification) onNewNotification(newNoti);
//         }

//         setPrevBookings(currentBookingsCount);
//         setPrevGuides(currentGuidesCount);
//       } catch (err) {
//         console.error("Polling Error:", err);
//       }
//     };

//     const interval = setInterval(checkUpdates, 15000);
//     checkUpdates();
//     return () => clearInterval(interval);
//   }, [prevBookings, prevGuides, onNewNotification]);

//   return null;
// };

// export default TravelAgentNotificationHandler;

// TravelAgentNotificationHandler.js
import React, { useEffect, useState } from 'react';
import { getAllBookingsApi, getAllGuidesApi } from '../../services/api'; 
import toast from 'react-hot-toast';

const TravelAgentNotificationHandler = ({ onNewNotification }) => {
  const [prevBookings, setPrevBookings] = useState(null);
  const [prevGuides, setPrevGuides] = useState(null);

  useEffect(() => {
    // const checkUpdates = async () => {
    //   try {
    //     const userId = localStorage.getItem('userId');

    //     // We catch errors individually so one 404 doesn't break everything
    //     const [bRes, gRes] = await Promise.all([
    //       getAllBookingsApi().catch(err => {
    //         console.error("Booking API Error:", err.message);
    //         return { data: [] };
    //       }),
    //       getAllGuidesApi().catch(err => {
    //         console.error("Guide API Error (404 usually means wrong URL):", err.message);
    //         return { data: [] };
    //       })
    //     ]);

    // Inside TravelAgentNotificationHandler.jsx
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