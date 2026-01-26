import React from 'react';

import GuideSidebar from './Component/GuideSidebar';
import GuideStatCard from './Component/GuideStatCard';
import { Bell } from 'lucide-react';


const TourCard = ({ tour }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-4 shadow-sm relative">
    <div className="absolute top-4 right-4">
      <span className="bg-slate-100 text-slate-600 text-[10px] px-3 py-1 rounded-md font-bold uppercase">
        {tour.status}
      </span>
    </div>

    <div className="flex items-center gap-2 mb-4">
      <span className="text-2xl">{tour.typeIcon}</span>
      <div>
        <h3 className="font-bold text-slate-800 text-sm leading-tight">{tour.title}</h3>
        <p className="text-[11px] text-slate-500">{tour.region}</p>
      </div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {[
        { label: "Start Date", val: tour.startDate, icon: "📅" },
        { label: "End Date", val: tour.endDate, icon: "🏁" },
        { label: "Duration", val: tour.duration, icon: "⏱️" },
        { label: "Travelers", val: `${tour.travelers}people`, icon: "👥" },
        { label: "Difficulty", val: tour.difficulty, icon: "🎢" },
      ].map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-lg grayscale">{item.icon}</span>
          <div>
            <p className="text-[9px] text-slate-400 uppercase font-bold leading-none">{item.label}</p>
            <p className="text-[11px] font-bold text-slate-700">{item.val}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="flex gap-2">
      <button className="flex items-center gap-1 bg-[#1a2b3c] text-white px-3 py-1.5 rounded-md text-xs font-medium">
        <span>▶</span> Start Tour
      </button>
      <button className="flex items-center gap-1 bg-[#FEF3C7] text-amber-900 px-3 py-1.5 rounded-md text-xs font-medium">
        <span>👥</span> View Travelers
      </button>
      <button className="flex items-center gap-1 bg-[#F3E8FF] text-purple-700 px-3 py-1.5 rounded-md text-xs font-medium">
        <span>📋</span> Details
      </button>
    </div>
  </div>
);

const GuideHistory = () => {
  const tourHistory = [
    {
      id: 1,
      title: "Annapurna Base Camp Trek",
      region: "Annapurna Region",
      typeIcon: "🏔️",
      startDate: "2025-10-12",
      endDate: "2025-10-28",
      duration: "5days",
      travelers: 6,
      difficulty: "Moderate",
      status: "completed"
    },
    {
      id: 2,
      title: "Chitwan Safari Adventure",
      region: "Chitwan Region",
      typeIcon: "🦏",
      startDate: "2025-12-12",
      endDate: "2025-12-28",
      duration: "5days",
      travelers: 4,
      difficulty: "Moderate",
      status: "completed"
    }
  ];

  return (
    <div className="flex min-h-screen bg-white">
      <GuideSidebar />

      <main className="flex-1 p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">History</h1>
            <p className="text-sm text-slate-500">Your completed tours and ratings</p>
          </div>
          <button className="p-2 text-amber-500 hover:bg-amber-50 rounded-full transition-colors">
            <Bell size={24} fill="currentColor" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <GuideStatCard label="Total Tours" value="123" icon="🎒" />
          <GuideStatCard label="Active Tours" value="2" icon="🏃" />
          <GuideStatCard label="Total Revenue" value="Rs.256K" icon="💰" />
          <GuideStatCard label="Average Rating" value="4.2" icon="⭐" />
        </div>

        <hr className="border-slate-100 mb-8" />

        <div className="max-w-4xl">
          {tourHistory.map(tour => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default GuideHistory;