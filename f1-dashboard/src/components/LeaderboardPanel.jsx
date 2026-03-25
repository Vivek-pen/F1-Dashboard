// src/components/LeaderboardPanel.jsx

export default function LeaderboardPanel({ leaderboardData }) {
  if (!leaderboardData || leaderboardData.length === 0) {
    return <div className="p-8 text-center text-zinc-500 font-bold">Waiting for telemetry...</div>;
  }

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-zinc-950 text-zinc-400 text-xs uppercase tracking-widest border-b border-zinc-800">
            <tr>
              <th className="p-4 w-16 text-center">Pos</th>
              <th className="p-4">Driver</th>
              <th className="p-4">Team</th>
              <th className="p-4 text-right">Last Lap</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {leaderboardData.map((driver) => (
              <tr key={driver.driverNumber} className="hover:bg-zinc-800/40 transition-colors">
                <td className="p-4 text-center font-black text-white text-lg">
                  {driver.position}
                </td>
                <td className="p-4">
                  <div className="font-bold text-white uppercase tracking-wide">
                    {driver.driverName}
                  </div>
                  <div className="text-xs text-zinc-500 font-bold italic mt-0.5">
                    CAR {driver.driverNumber}
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm uppercase tracking-widest font-bold text-zinc-300">
                    {driver.teamName}
                  </span>
                </td>
                <td className="p-4 text-right font-mono text-xl text-f1-red font-black drop-shadow-md">
                  {driver.lastLapTime || 'OUT'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}