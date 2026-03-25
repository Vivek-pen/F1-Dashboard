// src/pages/RaceDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRaceDetails } from '../services/api';
import { getTeamColor } from '../utils/colors';
import { ArrowLeft, Trophy } from 'lucide-react';

export default function RaceDetails() {
  const { round } = useParams(); // Gets the round number from the URL
  const [race, setRace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRaceDetails(round)
      .then((res) => setRace(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [round]);

  if (loading) return <div className="text-center text-f1-red mt-10 font-bold animate-pulse">Loading Race Details...</div>;
  if (!race) return <div className="text-center text-zinc-500 mt-10">No results found for this round.</div>;

  // Podium Component Helper
  const PodiumStep = ({ driver, step, height }) => {
    if (!driver) return null;
    const teamColor = getTeamColor(driver.constructorName);
    
    return (
      <div className={`flex flex-col items-center justify-end ${height} w-full max-w-[140px] z-10`}>
        <div className="text-center mb-4">
          <div className="font-black text-white uppercase text-xl md:text-2xl leading-tight">{driver.driverName}</div>
          <div className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: teamColor }}>{driver.constructorName}</div>
          <div className="text-zinc-400 font-mono text-sm mt-1">{driver.points} PTS</div>
        </div>
        <div 
          className="w-full flex items-start justify-center pt-4 rounded-t-lg shadow-[0_-10px_20px_rgba(0,0,0,0.5)] border-t-4 border-l border-r border-zinc-800"
          style={{ backgroundColor: 'rgba(24, 24, 27, 0.9)', borderTopColor: teamColor }}
        >
          <span className="text-4xl font-black text-zinc-700/50 italic">{step}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link to="/races" className="text-zinc-500 hover:text-white flex items-center gap-2 text-sm font-bold uppercase tracking-widest mb-4 transition-colors">
            <ArrowLeft size={16} /> Back to Calendar
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-f1-red rounded-sm shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
            <h1 className="text-4xl font-black text-white italic uppercase tracking-tight">
              {race.raceName}
            </h1>
          </div>
          <p className="text-f1-red font-black tracking-widest uppercase mt-2 ml-5">Round {race.round} Results</p>
        </div>
      </div>

      {/* Podium Display */}
      {(race.winner || race.second || race.third) && (
        <div className="bg-gradient-to-t from-zinc-900 to-f1-card rounded-2xl border border-zinc-800 p-8 pt-16 mt-12 relative overflow-hidden flex justify-center items-end h-[350px] gap-2 md:gap-6 shadow-2xl">
          <div className="absolute top-6 left-1/2 -translate-x-1/2 text-zinc-800/30">
            <Trophy size={160} />
          </div>
          <PodiumStep driver={race.second} step="2" height="h-[80%]" />
          <PodiumStep driver={race.winner} step="1" height="h-[100%]" />
          <PodiumStep driver={race.third} step="3" height="h-[70%]" />
        </div>
      )}

      {/* Full Classification Table */}
      <div className="bg-f1-card rounded-xl border border-zinc-800 overflow-hidden shadow-xl">
        <div className="bg-zinc-900 p-4 border-b border-zinc-800">
          <h2 className="text-lg font-black text-white italic tracking-wide uppercase">Final Classification</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-zinc-950/50 text-zinc-400 text-xs uppercase tracking-widest border-b border-zinc-800">
              <tr>
                <th className="p-4 w-16 text-center">Pos</th>
                <th className="p-4">Driver</th>
                <th className="p-4 hidden sm:table-cell">Team</th>
                <th className="p-4 text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {(race.results || []).map((res) => {
                const teamColor = getTeamColor(res.constructorName);
                return (
                  <tr key={res.driverName} className="hover:bg-zinc-800/30 transition-colors group relative">
                    <td className="relative p-4 text-center font-black text-white text-lg">
                      <div className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-2" style={{ backgroundColor: teamColor }}></div>
                      {res.position}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white uppercase tracking-wide text-lg">{res.driverName}</div>
                      <div className="sm:hidden text-xs uppercase tracking-widest font-semibold mt-0.5" style={{ color: teamColor }}>{res.constructorName}</div>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className="text-sm uppercase tracking-widest font-bold" style={{ color: teamColor }}>{res.constructorName}</span>
                    </td>
                    <td className="p-4 text-right font-mono text-xl text-f1-red font-black drop-shadow-[0_0_8px_rgba(239,68,68,0.2)]">{res.points}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}