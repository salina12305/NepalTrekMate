import React, { useEffect, useState } from 'react';
import { getPendingRequestsApi, getAllUsersApi } from '../../services/api'; 
import toast from 'react-hot-toast';

const NotificationHandler = () => {
  const [prevPending, setPrevPending] = useState(null);
  const [prevUsers, setPrevUsers] = useState(null);

  useEffect(() => {
    const checkUpdates = async () => {
      try {
        const [pRes, uRes] = await Promise.all([
          getPendingRequestsApi().catch(() => ({ data: {} })),
          getAllUsersApi().catch(() => ({ data: {} }))
        ]);

        const currentPending = pRes?.data?.requests?.length || 0;
        const currentUsers = (uRes?.data?.users || uRes?.data || []).length;

        if (prevPending !== null && currentPending > prevPending) {
          toast.success('🚀 New Agent Application!');
        }
        if (prevUsers !== null && currentUsers > prevUsers) {
          toast.success('👤 New User Registered!');
        }

        setPrevPending(currentPending);
        setPrevUsers(currentUsers);
      } catch (err) {
        console.error("Polling Error:", err);
      }
    };

    const interval = setInterval(checkUpdates, 15000);
    checkUpdates();
    return () => clearInterval(interval);
  }, [prevPending, prevUsers]);

  return null;
};

export default NotificationHandler;