import { useEffect, useState } from 'react';
import { getDriverStandings, getConstructorStandings } from '../services/api';
import { getTeamColor } from '../utils/colors';

export default function Standings() {
  const [driverStandings, setDriverStandings] = useState([]);
  const [constructorStandings, setConstructorStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDriverStandings(), getConstructorStandings()])
      .then(([driversRes, constructorsRes]) => {
        // Safe extraction logic
        setDriverStandings(Array.isArray(driversRes.data) ? driversRes.data : (driversRes.data?.content || []));
        setConstructorStandings(Array.isArray(constructorsRes.data) ? constructorsRes.data : (constructorsRes.data?.content || []));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const TableHeader = ({ title }) => (
    <div className="bg-zinc-900 p-4 border-b border-zinc-800 flex justify-between items-center rounded-t-xl">
      <h2 className="text-xl font-bold text-white italic tracking-wide">{title}</h2>
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-48 p-6 text-zinc-500">
      <p className="text-xl font-bold text-zinc-400">Season not started yet</p>
      <p className="text-sm mt-2">Check back after the first race is completed.</p>
    </div>
  );

  if (loading) return <div className="text-center text-f1-red mt-10 animate-pulse font-bold">Loading Standings...</div>;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-fade-in max-w-[90rem] mx-auto">
      
      {/* Drivers Championship */}
      <div className="bg-f1-card rounded-xl border border-zinc-800 shadow-lg flex flex-col">
        <TableHeader title="DRIVER STANDINGS" />
        {driverStandings.length === 0 ? <EmptyState /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-zinc-900/50 text-zinc-400 text-xs uppercase tracking-widest border-b border-zinc-800">
                <tr>
                  <th className="p-4 w-16 text-center">Pos</th>
                  <th className="p-4">Driver / Team</th>
                  <th className="p-4 text-center">Wins</th>
                  <th className="p-4 text-right">Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {driverStandings.map((driver) => {
                  const teamColor = getTeamColor(driver.constructorName);
                  return (
                    <tr key={driver.driverName} className="hover:bg-zinc-800/30 transition-colors group relative">
                      <td className="relative p-4 text-center font-black text-white text-lg">
                        <div className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-2" style={{ backgroundColor: teamColor }}></div>
                        {driver.position}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white uppercase tracking-wide text-lg">{driver.driverName}</div>
                        <div className="text-xs uppercase tracking-widest font-semibold mt-0.5" style={{ color: teamColor }}>{driver.constructorName}</div>
                      </td>
                      <td className="p-4 text-center font-medium text-zinc-400">{driver.wins}</td>
                      <td className="p-4 text-right font-mono text-xl text-white font-black drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{driver.points}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Constructors Championship */}
      <div className="bg-f1-card rounded-xl border border-zinc-800 shadow-lg flex flex-col">
        <TableHeader title="CONSTRUCTOR STANDINGS" />
        {constructorStandings.length === 0 ? <EmptyState /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-zinc-900/50 text-zinc-400 text-xs uppercase tracking-widest border-b border-zinc-800">
                <tr>
                  <th className="p-4 w-16 text-center">Pos</th>
                  <th className="p-4">Team</th>
                  <th className="p-4 text-center">Wins</th>
                  <th className="p-4 text-right">Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {constructorStandings.map((team) => {
                  const teamColor = getTeamColor(team.constructorName);
                  return (
                    <tr key={team.constructorName} className="hover:bg-zinc-800/30 transition-colors group relative">
                      <td className="relative p-4 text-center font-black text-white text-lg">
                        <div className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-2" style={{ backgroundColor: teamColor }}></div>
                        {team.position}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white uppercase tracking-wide text-lg">{team.constructorName}</div>
                      </td>
                      <td className="p-4 text-center font-medium text-zinc-400">{team.wins}</td>
                      <td className="p-4 text-right font-mono text-xl text-white font-black drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{team.points}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}