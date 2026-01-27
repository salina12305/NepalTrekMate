
import React from 'react';
import TravelAgentStatCard from './TravelAgentStatCard';

const TravelAgentHeaderStatCard = ({ title, subtitle, stats, loading, label1 = "My Packages" }) => {
  const firstCardIcon = label1 === "Total Guides" ? "👤" : "📦";

  return (
    <>
      <header className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl font-bold m-0 text-slate-800">{title}</h1>
          <p className="text-slate-500 mt-1">{subtitle}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <TravelAgentStatCard 
            label={label1} 
            value={loading ? "..." : stats.totalPackages} 
            icon={firstCardIcon} 
        />
        <TravelAgentStatCard label="Total Bookings" value={loading ? "..." : stats.totalBookings} icon="📋" />
        <TravelAgentStatCard label="Total Revenue" value={loading ? "..." : `Rs. ${stats.revenue || 0}`} icon="💰" />
        <TravelAgentStatCard label="Avg Rating" value={loading ? "..." : (stats.rating || "N/A")} icon="⭐" />
      </div>
    </>
  );
};

export default TravelAgentHeaderStatCard;