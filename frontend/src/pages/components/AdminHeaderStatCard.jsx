// import React from 'react';
// import AdminStatCard from './AdminStatCard';

// const AdminHeaderStatCard = ({ title, subtitle, stats, loading }) => {
//   return (
//     <>
//       {/* Header Section */}
//       <header className="flex justify-between items-start mb-10">
//         <div>
//           <h1 className="text-3xl font-bold m-0 text-slate-800">{title}</h1>
//           <p className="text-slate-500 mt-1">{subtitle}</p>
//         </div>
//         <div className="text-3xl cursor-pointer hover:scale-110 transition-transform">🔔</div>
//       </header>

//       {/* Stats Cards Section */}
//       <div className="grid grid-cols-4 gap-4 mb-8">
//         <AdminStatCard 
//           label="Total Users" 
//           value={loading ? "..." : stats.totalUsers} 
//           icon="👥" 
//         />
//         <AdminStatCard 
//           label="Active Agents" 
//           value={loading ? "..." : stats.activeAgents} 
//           icon="👤" 
//         />
//         <AdminStatCard 
//           label="Total Revenue" 
//           value={stats.revenue || "Rs. 0"} 
//           icon="💰" 
//         />
//         <AdminStatCard 
//           label="Pending Approvals" 
//           value={loading ? "..." : stats.pending} 
//           icon="⌛" 
//         />
//       </div>
//     </>
//   );
// };

// export default AdminHeaderStatCard;

import React from 'react';
import AdminStatCard from './AdminStatCard';

// Added firstCardLabel and firstCardValue to make it flexible
const AdminHeaderStatCard = ({ title, subtitle, stats, loading, firstCardLabel = "Total Users" }) => {
  return (
    <>
      <header className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl font-bold m-0 text-slate-800">{title}</h1>
          <p className="text-slate-500 mt-1">{subtitle}</p>
        </div>
        <div className="text-3xl cursor-pointer hover:scale-110 transition-transform">🔔</div>
      </header>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <AdminStatCard 
          label={firstCardLabel} 
          // We look for totalPackages first, if not there, use totalUsers
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