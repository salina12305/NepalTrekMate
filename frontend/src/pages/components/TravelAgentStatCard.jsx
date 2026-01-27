import React from 'react';

const TravelAgentStatCard = ({ label, value, icon }) => {
  return (
    <div className="bg-[#E6F4F9] p-5 rounded-xl shadow-sm border border-slate-100 relative flex-1">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-slate-600 font-medium mb-2">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
        <span className="text-xl">{icon}</span>
      </div>
    </div>
  );
};

export default TravelAgentStatCard;