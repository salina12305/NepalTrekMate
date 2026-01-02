import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import AgentCard from "../components/AgentCard";

export default function AdminPanel() {
  return (
    <div className="flex min-h-screen bg-white text-black">

      <Sidebar />

      <main className="flex-1 px-10 py-8">

        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-3xl font-bold">Travel Agents Approval</h2>
            <p className="text-gray-600 mt-1">
              Review and approve travel agent registrations
            </p>
          </div>
          <div className="text-2xl">🔔</div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          <StatCard title="Total Users" value="1845" icon="👥" />
          <StatCard title="Active Agents" value="181" icon="🧑‍💼" />
          <StatCard title="Total Revenue" value="Rs.256K" icon="💰" />
          <StatCard title="Pending Approvals" value="181" icon="⏳" />
        </div>

        {/* Agent Cards */}
        <div className="space-y-6">
          <AgentCard
            name="John Smith"
            email="John1@gmail.com"
            company="Nepal Adventures"
          />
          <AgentCard
            name="Preeti Stha"
            email="Stha88@gmail.com"
            company="Himalayan Treks"
          />
        </div>

      </main>
    </div>
  );
}
