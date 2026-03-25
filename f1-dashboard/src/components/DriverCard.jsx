// src/components/DriverCard.jsx
export default function DriverCard({ driver }) {
  return (
    <div className="bg-f1-card rounded-xl p-6 border border-zinc-800 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_20px_rgba(239,68,68,0.15)] hover:border-zinc-700 group">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold text-white group-hover:text-f1-red transition-colors">
            {driver.givenName} {driver.familyName}
          </h3>
          <p className="text-zinc-400 font-mono mt-1">{driver.code}</p>
        </div>
        <span className="text-4xl font-black text-zinc-700 group-hover:text-zinc-500 transition-colors italic">
          {driver.permanentNumber}
        </span>
      </div>
      <div className="mt-4 inline-block px-3 py-1 rounded-full bg-zinc-800 text-xs font-semibold text-zinc-300 border border-zinc-700">
        {driver.nationality}
      </div>
    </div>
  );
}