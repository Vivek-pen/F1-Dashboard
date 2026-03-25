// src/pages/Races.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRaces } from '../services/api';
import { MapPin, CalendarClock, ChevronRight } from 'lucide-react';

export default function Races() {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRaces()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : (res.data?.content || []);
        setRaces(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Safely format dates, handling both YYYY-MM-DD and full ISO strings
  const formatTime = (dateString) => {
    if (!dateString) return null;
    if (dateString.length === 10) {
      // It's just a date without time
      return new Date(dateString).toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    return new Date(dateString).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <div className="text-center text-f1-red mt-10 font-bold animate-pulse">Loading Calendar...</div>;

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-2 h-8 bg-f1-red rounded-sm shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tight">2026 Calendar</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {races.map((race) => (
          <Link 
            to={`/races/${race.round}`} 
            key={race.round} 
            className="bg-f1-card rounded-xl border border-zinc-800 overflow-hidden flex flex-col group hover:-translate-y-1 transition-all duration-300 hover:border-zinc-700 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] cursor-pointer"
          >
            {/* Header */}
            <div className="bg-zinc-900 p-4 border-b border-zinc-800 flex justify-between items-center group-hover:bg-zinc-800/80 transition-colors">
              <span className="text-f1-red font-black text-sm tracking-widest uppercase">Round {race.round}</span>
              <ChevronRight size={18} className="text-zinc-600 group-hover:text-white transition-colors" />
            </div>
            
            {/* Main Info */}
            <div className="p-6 flex-grow">
              <h3 className="text-2xl font-black text-white mb-4 group-hover:text-f1-red transition-colors italic tracking-wide uppercase">
                {race.raceName}
              </h3>
              
              {/* Weekend Schedule */}
              <div className="space-y-3 bg-zinc-950/50 p-4 rounded-lg border border-zinc-800/50">
                <div className="flex items-center gap-2 text-zinc-500 mb-2 border-b border-zinc-800 pb-2">
                  <CalendarClock size={14} />
                  <span className="text-xs font-bold uppercase tracking-widest">Weekend Schedule</span>
                </div>
                
                {race.qualifyingTime && (
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Qualifying</span>
                    <span className="text-white font-mono">{formatTime(race.qualifyingTime)}</span>
                  </div>
                )}
                {race.sprintRaceTime && (
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Sprint</span>
                    <span className="text-white font-mono">{formatTime(race.sprintRaceTime)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm pt-1 border-t border-zinc-800/50">
                  <span className="text-f1-red font-bold">Race</span>
                  <span className="text-f1-red font-mono font-bold">{formatTime(race.raceDateTime || race.date)}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}