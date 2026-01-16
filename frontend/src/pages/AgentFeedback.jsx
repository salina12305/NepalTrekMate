export default function AgentFeedback() {
  return (
    <div className="min-h-screen flex bg-white">

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#E8F7FB] p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold mb-6">Travel Agent</h1>

          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl">
              👤
            </div>
            <p className="mt-3 font-semibold">Pheem Metawin</p>
            <p className="text-sm text-gray-600">Senior Travel Agent</p>
          </div>

          <nav className="space-y-4 text-lg">
            <p>📦 My Packages</p>
            <p>📋 Booking</p>
            <p>🧑‍💼 Guide</p>
            <p>💰 Revenue</p>
            <p className="font-bold">⭐ Feedback</p>
          </nav>
        </div>

        <button className="flex items-center gap-2 text-lg">
          🚪 Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold">Feedback</h2>
            <p className="text-gray-600">Customer reviews and ratings</p>
          </div>

          <div className="flex gap-4">
            <button className="px-4 py-2 border rounded-lg shadow">
              👥 Assign Guides
            </button>
            <button className="px-4 py-2 border rounded-lg shadow">
              📊 View Revenue
            </button>
            🔔
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          {[
            ["Total Packages", "18", "📦"],
            ["Active Bookings", "21", "📋"],
            ["Total Revenue", "Rs.256K", "💰"],
            ["Average Rating", "4.2", "⭐"],
          ].map(([title, value, icon]) => (
            <div
              key={title}
              className="bg-[#E8F7FB] rounded-xl p-6 shadow"
            >
              <p className="flex justify-between text-gray-700">
                {title} <span>{icon}</span>
              </p>
              <p className="text-2xl font-bold mt-2">{value}</p>
            </div>
          ))}
        </div>

        {/* FEEDBACK CARDS */}
        <div className="space-y-6">
          {/* CARD 1 */}
          <div className="border rounded-xl p-6 shadow bg-[#F5FBFD]">
            <div className="flex justify-between">
              <div>
                <p className="font-bold">👦 John Smith</p>
                <p className="font-semibold">Annapurna Base Camp Trek</p>
                <p className="text-gray-700 mt-2">
                  Absolutely incredible experience! The guide was knowledgeable
                  and the views were breathtaking. Highly recommend!
                </p>
                <p className="text-sm mt-2">
                  📅 2024-02-28 &nbsp; ✔ Verified Booking
                </p>
              </div>
              <p className="text-yellow-500 text-lg">⭐⭐⭐⭐⭐</p>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="border rounded-xl p-6 shadow bg-[#F5FBFD]">
            <div className="flex justify-between">
              <div>
                <p className="font-bold">👩 Sarah Johnson</p>
                <p className="font-semibold">Everest Base Camp Trek</p>
                <p className="text-gray-700 mt-2">
                  Trip of a lifetime! Everything was well organized and the team
                  was professional. Worth every penny.
                </p>
                <p className="text-sm mt-2">
                  📅 2024-02-25 &nbsp; ✔ Verified Booking
                </p>
              </div>
              <p className="text-yellow-500 text-lg">⭐⭐⭐⭐</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
