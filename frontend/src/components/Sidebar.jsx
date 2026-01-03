export default function Sidebar() {
  return (
    <aside className="w-[260px] bg-[#E6F7FB] px-6 py-8">
      <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>

      <div className="flex flex-col items-center mb-10">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 text-2xl">
          👤
        </div>
        <p className="font-semibold">Admin User</p>
        <p className="text-sm text-gray-600">System Administrator</p>
      </div>

      <nav className="space-y-5 text-lg">
        <div className="flex items-center gap-3 font-semibold">📊 Dashboard</div>
        <div className="flex items-center gap-3">👥 Users</div>
        <div className="flex items-center gap-3 font-semibold">🧑‍💼 Agents</div>
        <div className="flex items-center gap-3">📦 Package</div>
        <div className="flex items-center gap-3">📋 Booking</div>
      </nav>
    </aside>
  );
}
