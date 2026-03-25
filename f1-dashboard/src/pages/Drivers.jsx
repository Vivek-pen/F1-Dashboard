import { useEffect, useState } from 'react';
import { getDrivers } from '../services/api';

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDrivers()
      .then((res) => {
        setDrivers(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center text-f1-red mt-10 font-bold animate-pulse">Loading Grid...</div>;

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-2 h-8 bg-f1-red rounded-sm shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
        <h1 className="text-3xl font-black text-white italic tracking-tight uppercase">2026 Starting Grid</h1>
      </div>
      
      <div className="flex flex-col gap-4">
        {drivers.map((driver) => {
          // Destructure directly from your new API response, with safe fallbacks
          const teamName = driver.constructorName || 'Independent';
          const teamColor = driver.teamColor || '#ef4444'; 

          return (
            <div 
              key={driver.driverId} 
              className="bg-f1-card rounded-xl border border-zinc-800 transition-all duration-300 hover:border-zinc-700 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] group flex overflow-hidden relative"
            >
              
              {/* Left Accent Color Strip */}
              <div 
                className="w-2.5 transition-transform duration-300 group-hover:scale-x-125 origin-left z-20" 
                style={{ backgroundColor: teamColor }}
              ></div>

              {/* PERMANENT BACKGROUND GRADIENT */}
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none z-10"
                style={{ 
                  background: `linear-gradient(90deg, ${teamColor} 0%, rgba(24, 24, 27, 0) 50%, rgba(24, 24, 27, 0) 100%)` 
                }}
              ></div>
              
              {/* HOVER HIGHLIGHT GRADIENT */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none z-10"
                style={{ 
                  background: `linear-gradient(90deg, ${teamColor} 0%, transparent 100%)` 
                }}
              ></div>

              {/* CARD CONTENT */}
              <div className="p-6 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-20 hover:bg-zinc-800/10 transition-colors">
                
                {/* 1. Driver Number & Name/Team */}
                <div className="flex items-center gap-8 flex-1">
                  <span className="text-5xl font-black text-zinc-800 transition-colors group-hover:text-zinc-700/50 italic w-16 text-center tracking-tighter">
                    {/* Fallback to a dash if permanentNumber isn't in the new DTO */}
                    {driver.permanentNumber || '-'}
                  </span>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-black text-white tracking-wide uppercase italic">
                      {driver.givenName} {driver.familyName}
                    </h3>
                    <p 
                      className="text-sm font-bold uppercase tracking-widest mt-1" 
                      style={{ color: teamColor }}
                    >
                      {teamName}
                    </p>
                  </div>
                </div>

                {/* 2. Nationality & Code Block (Only renders if they exist in the DTO) */}
                <div className="flex items-center justify-end gap-10">
                  {driver.code && (
                    <div className="text-zinc-600 font-mono text-3xl font-black uppercase hidden lg:block tracking-widest opacity-50">
                      {driver.code}
                    </div>
                  )}
                  {driver.nationality && (
                    <div className="px-5 py-2.5 rounded-lg bg-zinc-950 text-sm font-bold text-zinc-300 border border-zinc-800 min-w-[140px] text-center uppercase tracking-wider shadow-inner hidden md:block">
                      {driver.nationality}
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}