export default function StatCard({ title, value, icon }) {
  return (
    <div className="bg-[#E6F7FB] rounded-xl p-6 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <p className="text-lg">{title}</p>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
