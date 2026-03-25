import { useState, useEffect } from 'react';
import { getRaceResults } from '../services/api';
import { Search } from 'lucide-react';

export default function RaceResults() {
  const [round, setRound] = useState(1);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = (roundNum) => {
    setLoading(true);
    getRaceResults(roundNum)
      .then((res) => setResults(res.data))
      .catch((err) => {
        console.error(err);
        setResults([]); // Clear on error
      })
      .finally(() => setLoading(false));
  };

  // Fetch initial results on mount
  useEffect(() => {
    fetchResults(round);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchResults(round);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-f1-red rounded-sm"></div>
          <h1 className="text-3xl font-black text-white italic">RACE RESULTS</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-zinc-900 p-1.5 rounded-lg border border-zinc-800 focus-within:border-f1-red transition-colors">
          <span className="text-zinc-400 pl-3 font-bold text-sm">ROUND</span>
          <input 
            type="number" 
            min="1"
            value={round}
            onChange={(e) => setRound(e.target.value)}
            className="bg-transparent text-white w-16 text-center outline-none font-mono font-bold"
          />
          <button type="submit" className="bg-f1-red hover:bg-red-600 text-white p-2 rounded-md transition-colors">
            <Search size={18} />
          </button>
        </form>
      </div>

      <div className="bg-f1-card rounded-xl border border-zinc-800 overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-10 text-center text-zinc-500 animate-pulse">Fetching telemetry...</div>
        ) : results.length === 0 ? (
          <div className="p-10 text-center text-zinc-500">No results found for Round {round}.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-900 text-zinc-400 text-sm uppercase tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="p-4 w-16 text-center">Pos</th>
                  <th className="p-4">Driver</th>
                  <th className="p-4">Team</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {results.map((res) => (
                  <tr key={res.driverName} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4 text-center font-black text-white">{res.position}</td>
                    <td className="p-4 font-bold text-white">{res.driverName}</td>
                    <td className="p-4 text-zinc-400">{res.constructorName}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${res.status === 'Finished' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-f1-red'}`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono text-f1-red font-bold">{res.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}