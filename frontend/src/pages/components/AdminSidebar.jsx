import React from 'react';
import { 
  LayoutDashboard, Users, UserCheck, Package, 
  BookOpen, LogOut 
} from 'lucide-react';

const AdminSidebar = () => {

  const menuItems = [
    { icon: <LayoutDashboard size={18}/>, label: "Dashboard" },
    { icon: <Users size={18}/>, label: "Users"},
    { icon: <UserCheck size={18}/>, label: "Agents" },
    { icon: <Package size={18}/>, label: "Package" },
    { icon: <BookOpen size={18}/>, label: "Booking" },
  ];

  return (
    <aside className="w-64 bg-[#EAF7FC] border-r border-[#D1E9F2] p-6 flex flex-col h-screen sticky top-0">
 
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold mb-6 text-slate-800 tracking-tight">Admin Panel</h2>

        <div className="w-16 h-16 bg-white rounded-full mx-auto mb-3 flex items-center justify-center shadow-sm border border-cyan-100">
          <span className="text-3xl">👨‍💼</span>
        </div>
        <h3 className="font-bold text-base text-slate-800 m-0">Admin User</h3>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1">
          System Administrator
        </p>
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
            <span className={item.active ? "text-cyan-600" : "text-slate-500"}>
              {item.icon}
            </span>
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

export default AdminSidebar;