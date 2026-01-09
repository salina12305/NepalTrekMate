import React from 'react';
import { 
  Backpack, Calendar, History, LogOut, Star 
} from 'lucide-react';

const GuideSidebar = () => {
  const menuItems = [
    { icon: <Backpack size={18}/>, label: "My Tours"},
    { icon: <Calendar size={18}/>, label: "Upcoming" },
    { icon: <History size={18}/>, label: "History" },
  ];

  return (
    <aside className="w-64 bg-[#E0F2F7] border-r border-[#CFE2E8] p-6 flex flex-col h-screen sticky top-0">

      <div className="text-center mb-8">
        <h2 className="text-xl font-bold mb-6 text-slate-800 tracking-tight">Guide Portal</h2>
        
        <div className="relative w-16 h-16 mx-auto mb-3">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center shadow-md border-2 border-white overflow-hidden">
            <span className="text-2xl">👤</span>
          </div>
        </div>

        <h3 className="font-bold text-base text-slate-800 m-0">Phemba Sherpa</h3>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1">
          Mountain Trekking Expert
        </p>
        
        <div className="flex items-center justify-center gap-1 mt-2 text-xs font-bold text-amber-600 bg-amber-50 py-1 px-2 rounded-full w-fit mx-auto">
          <Star size={12} fill="currentColor" /> 4.2 
          <span className="text-slate-400 font-normal ml-1">(123 tours)</span>
        </div>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {menuItems.map((item, index) => (
          <div 
          key={index} 
          className={`
            flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
            ${item.active 
              ? 'bg-white shadow-sm text-cyan-600 font-bold' 
              : 'hover:bg-white/50 text-slate-600 hover:text-slate-900'
            }
          `}
          >
            {item.icon}
            <span className="text-sm">{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="pt-4 border-t border-cyan-200/60">
        <div className="flex items-center gap-3 px-4 py-3 text-slate-600 cursor-pointer hover:text-red-500 transition-colors group">
          <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
          <span className="text-sm font-bold">Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default GuideSidebar;