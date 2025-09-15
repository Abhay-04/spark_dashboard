

export default function StatsCard({ title, amount, color }) {
    
    
  return (
    
    <div className={`rounded-xl p-4 shadow-sm bg-white`}>
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className={`text-2xl font-bold ${color}`}>₹{amount.toLocaleString()}</h2>
    </div>
  );
}
