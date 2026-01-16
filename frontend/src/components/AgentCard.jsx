export default function AgentCard({ name, email, company }) {
  return (
    <div className="border rounded-xl p-6 shadow-sm bg-[#FFF9F7]">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          <div className="w-14 h-14 rounded-full bg-purple-400 flex items-center justify-center text-white text-xl">
            👩
          </div>

          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-gray-600">{email}</p>
            <p className="mt-2">{company}</p>
            <p className="text-sm mt-1">💰 Rs. 48,200 Revenue</p>
          </div>
        </div>

        <span className="bg-yellow-100 text-yellow-800 px-4 py-1 rounded-lg text-sm">
          Pending
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm mb-6">
        <p>📞 +9712345678</p>
        <p>📅 Joined 2024-10-19</p>
        <p>📦 24 Packages</p>
      </div>

      <div className="flex gap-4">
        <button className="bg-green-300 px-6 py-2 rounded-lg font-medium">
          Approve Agent
        </button>
        <button className="bg-red-300 px-6 py-2 rounded-lg font-medium">
          Reject
        </button>
        <button className="bg-yellow-200 px-6 py-2 rounded-lg font-medium">
          View Details
        </button>
      </div>
    </div>
  );
}
