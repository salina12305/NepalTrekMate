import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import GuideSidebar from './GuideSidebar';

const GuideLayout = () => {
  const [userData, setUserData] = useState(null);
  const backendUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchGuideProfile = async () => {
      try {
        const token = localStorage.getItem("token-37c");
        const userId = localStorage.getItem("userId");
        
        if (!token || !userId) return;
        const response = await axios.get(`${backendUrl}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching guide profile:", error);
      }
    };

    fetchGuideProfile();
  }, [backendUrl]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Passing the fetched userData to the Sidebar */}
      <GuideSidebar userData={userData} />
      
      <main className="flex-1 p-8">
        <Outlet /> {/* This renders the specific page content */}
      </main>
    </div>
  );
};

export default GuideLayout;