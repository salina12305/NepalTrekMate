
import React from 'react';
import AdminStatCard from './AdminStatCard';

const AdminHeaderStatCard = ({ title, subtitle, stats, loading, firstCardLabel = "Total Users" }) => {
  return (
    <>
      <header className="mb-10">
        <h1 className="text-3xl font-bold m-0 text-slate-800">{title}</h1>
        <p className="text-slate-500 mt-1">{subtitle}</p>
      </header>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <AdminStatCard 
          label={firstCardLabel} 
          value={loading ? "..." : (stats.totalPackages ?? stats.totalUsers)} 
          icon={firstCardLabel === "Total Packages" ? "📦" : "👥"} 
        />
        <AdminStatCard 
          label="Active Agents" 
          value={loading ? "..." : stats.activeAgents} 
          icon="👤" 
        />
        <AdminStatCard 
          label="Total Revenue" 
          value={stats.revenue || "Rs. 0"} 
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