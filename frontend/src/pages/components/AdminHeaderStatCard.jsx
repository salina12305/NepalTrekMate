
import React from 'react';
import AdminStatCard from './AdminStatCard';

const AdminHeaderStatCard = ({ title, subtitle, stats, loading, firstCardLabel = "Total Users" }) => {

  // Dynamic logic to pick the value for the first card
  const getFirstCardValue = () => {
    if (loading) return "...";
    if (firstCardLabel === "Total Bookings") return stats.totalBookings;
    if (firstCardLabel === "Total Packages") return stats.totalPackages;
    return stats.totalUsers;
  };

  // Dynamic icon logic
  const getIcon = () => {
    if (firstCardLabel === "Total Bookings") return "🎫";
    if (firstCardLabel === "Total Packages") return "📦";
    return "👥";
  };
  return (
    <>
      <header className="mb-10">
        <h1 className="text-3xl font-bold m-0 text-slate-800">{title}</h1>
        <p className="text-slate-500 mt-1">{subtitle}</p>
      </header>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <AdminStatCard 
          label={firstCardLabel} 
          value={getFirstCardValue()} 
          icon={getIcon()} 
        />
        <AdminStatCard 
          label="Active Agents" 
          value={loading ? "..." : stats.activeAgents} 
          icon="👤" 
        />
        <AdminStatCard 
          label="Total Revenue" 
          value={loading ? "..." : (typeof stats.revenue === 'number' ? `Rs. ${stats.revenue.toLocaleString()}` : stats.revenue)} 
          icon="💰" 
        />
        <AdminStatCard 
          label="Pending Approvals" 
          value={loading ? "..." : stats.pending} 
          icon="⌛" 
        />
      </div>
    </>
  );
};

export default AdminHeaderStatCard;