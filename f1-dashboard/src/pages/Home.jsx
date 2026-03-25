import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNextRace, getDriverStandings, getConstructorStandings } from '../services/api';
import { ChevronRight, ChevronDown, ChevronUp, Timer, MapPin, CalendarClock } from 'lucide-react';
import { getTeamColor } from '../utils/colors';

export default function Home() {
  const [upcoming, setUpcoming] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [timeLeft, setTimeLeft] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSchedule, setShowSchedule] = useState(false); // State for the dropdown

  useEffect(() => {
    Promise.all([
      getNextRace(),
      getDriverStandings(),
      getConstructorStandings()
    ])
      .then(([raceRes, driversRes, teamsRes]) => {
        const nextRace = Array.isArray(raceRes.data) ? raceRes.data[0] : raceRes.data;
        setUpcoming(nextRace || null);
        
        setDrivers(Array.isArray(driversRes.data) ? driversRes.data.slice(0, 5) : (driversRes.data?.content?.slice(0, 5) || []));
        setTeams(Array.isArray(teamsRes.data) ? teamsRes.data.slice(0, 5) : (teamsRes.data?.content?.slice(0, 5) || []));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // 1. Live Countdown Timer (Updated to use raceDateTime)
  useEffect(() => {
    if (!upcoming?.raceDateTime) return;
    
    const interval = setInterval(() => {
      const raceDate = new Date(upcoming.raceDateTime).getTime();
      const now = new Date().getTime();
      const distance = raceDate - now;

      if (distance < 0) {
        setTimeLeft('RACE IS LIVE');
        clearInterval(interval);
        return;
      }

      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);
      
      const format = (num) => num.toString().padStart(2, '0');
      setTimeLeft(`${format(d)}D : ${format(h)}H : ${format(m)}M : ${format(s)}S`);
    }, 1000);

    return () => clearInterval(interval);
  }, [upcoming]);

  // 2. Helper function to format UTC strings into localized user time
  const formatLocalTime = (utcString) => {
    if (!utcString) return null;
    const date = new Date(utcString);
    return date.toLocaleString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="text-center text-f1-red mt-10 font-bold animate-pulse">Loading Dashboard...</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-[90rem] mx-auto">
      {/* Hero Section: Next Race */}
      <div className="bg-gradient-to-br from-zinc-900 via-f1-card to-f1-dark border border-zinc-800 rounded-2xl p-8 md:p-12 relative shadow-2xl">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-f1-red opacity-10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-8">
          
          {/* Left Side: Race Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-f1-red text-white text-xs font-black tracking-widest px-3 py-1 rounded-sm uppercase">
                Round {upcoming?.round || '?'}
              </span>
              <span className="text-zinc-400 font-medium text-sm tracking-wider uppercase">Next Race</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white italic mb-4 uppercase tracking-tight">
              {upcoming?.raceName || 'SEASON TBD'}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-zinc-300 font-medium text-lg">
              <span className="flex items-center gap-1 text-f1-red"><MapPin size={18} /></span>
              <span>{upcoming?.circuitName || 'Circuit TBA'}</span>
              {(upcoming?.locality || upcoming?.country) && (
                <>
                  <span className="hidden sm:inline text-zinc-600">•</span>
                  <span>{upcoming?.locality}, {upcoming?.country}</span>
                </>
              )}
            </div>
          </div>

          {/* Right Side: Timer & Schedule Dropdown */}
          <div className="flex flex-col gap-4 min-w-[340px] md:min-w-[420px]">
            {/* Countdown Box */}
            <div className="bg-zinc-950/80 backdrop-blur-md border border-zinc-800 p-6 rounded-xl text-center shadow-lg">
              <div className="flex items-center justify-center gap-2 text-zinc-400 mb-2 font-semibold text-sm tracking-widest">
                <Timer size={16} className="text-f1-red" />
                LIGHTS OUT IN
              </div>
              <div className={`font-mono whitespace-nowrap text-3xl md:text-4xl font-black tracking-tight ${timeLeft === 'RACE IS LIVE' ? 'text-green-500 animate-pulse' : 'text-white drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`}>
                {timeLeft || '00D : 00H : 00M : 00S'}
              </div>
            </div>

            {/* Weekend Schedule Accordion */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-300">
              <button 
                onClick={() => setShowSchedule(!showSchedule)}
                className="w-full flex items-center justify-between p-4 text-sm font-bold text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors uppercase tracking-widest"
              >
                <div className="flex items-center gap-2">
                  <CalendarClock size={16} className="text-f1-red" />
                  Local Weekend Schedule
                </div>
                {showSchedule ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              
              {/* Expandable Content */}
              <div className={`transition-all duration-300 ease-in-out ${showSchedule ? 'max-h-96 opacity-100 border-t border-zinc-800' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="p-4 flex flex-col gap-3">
                  
                  {/* Qualifying */}
                  {upcoming?.qualifyingTime && (
                    <div className="flex justify-between items-center text-sm border-b border-zinc-800/50 pb-2">
                      <span className="text-zinc-400 font-semibold uppercase tracking-wider">Qualifying</span>
                      <span className="text-white font-mono font-bold">{formatLocalTime(upcoming.qualifyingTime)}</span>
                    </div>
                  )}

                  {/* Sprint Qualifying (Only shows if not null) */}
                  {upcoming?.sprintQualifyingTime && (
                    <div className="flex justify-between items-center text-sm border-b border-zinc-800/50 pb-2">
                      <span className="text-zinc-400 font-semibold uppercase tracking-wider">Sprint Shootout</span>
                      <span className="text-white font-mono font-bold">{formatLocalTime(upcoming.sprintQualifyingTime)}</span>
                    </div>
                  )}

                  {/* Sprint Race (Only shows if not null) */}
                  {upcoming?.sprintRaceTime && (
                    <div className="flex justify-between items-center text-sm border-b border-zinc-800/50 pb-2">
                      <span className="text-zinc-400 font-semibold uppercase tracking-wider">Sprint</span>
                      <span className="text-white font-mono font-bold">{formatLocalTime(upcoming.sprintRaceTime)}</span>
                    </div>
                  )}

                  {/* Main Race */}
                  {upcoming?.raceDateTime && (
                    <div className="flex justify-between items-center text-sm pt-1">
                      <span className="text-f1-red font-black uppercase tracking-wider">Grand Prix</span>
                      <span className="text-f1-red font-mono font-black">{formatLocalTime(upcoming.raceDateTime)}</span>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Top 5 Standings Preview (Same as before) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Drivers Top 5 */}
        <div className="bg-f1-card rounded-xl border border-zinc-800 overflow-hidden shadow-lg flex flex-col">
          <div className="bg-zinc-900 p-5 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="text-xl font-black text-white italic tracking-wide">TOP 5 DRIVERS</h2>
            <Link to="/standings" className="text-f1-red hover:text-red-400 text-sm font-bold flex items-center transition-colors">
              VIEW ALL <ChevronRight size={16} />
            </Link>
          </div>
          <div className="p-0 flex-grow">
            {drivers.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 font-medium">No standings available yet.</div>
            ) : (
              <div className="divide-y divide-zinc-800/50">
                {drivers.map((driver) => {
                  const teamColor = getTeamColor(driver.constructorName);
                  return (
                    <div key={driver.driverName} className="flex items-center justify-between p-4 hover:bg-zinc-800/30 transition-colors group relative">
                      <div className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-2" style={{ backgroundColor: teamColor }}></div>
                      <div className="flex items-center gap-4 pl-2">
                        <span className="w-6 text-center font-black text-xl text-zinc-500">{driver.position}</span>
                        <div>
                          <div className="font-bold text-white text-lg uppercase tracking-wide">{driver.driverName}</div>
                          <div className="text-xs uppercase tracking-widest font-semibold mt-0.5" style={{ color: teamColor }}>{driver.constructorName}</div>
                        </div>
                      </div>
                      <div className="text-xl font-mono font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{driver.points} <span className="text-sm text-zinc-500 font-sans font-bold">PTS</span></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Constructors Top 5 */}
        <div className="bg-f1-card rounded-xl border border-zinc-800 overflow-hidden shadow-lg flex flex-col">
          <div className="bg-zinc-900 p-5 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="text-xl font-black text-white italic tracking-wide">TOP 5 TEAMS</h2>
            <Link to="/standings" className="text-f1-red hover:text-red-400 text-sm font-bold flex items-center transition-colors">
              VIEW ALL <ChevronRight size={16} />
            </Link>
          </div>
          <div className="p-0 flex-grow">
            {teams.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 font-medium">No standings available yet.</div>
            ) : (
              <div className="divide-y divide-zinc-800/50">
                {teams.map((team) => {
                  const teamColor = getTeamColor(team.constructorName || team.name);
                  return (
                    <div key={team.constructorName || team.name} className="flex items-center justify-between p-4 hover:bg-zinc-800/30 transition-colors group relative">
                      <div className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-2" style={{ backgroundColor: teamColor }}></div>
                      <div className="flex items-center gap-4 pl-2">
                        <span className="w-6 text-center font-black text-xl text-zinc-500">{team.position}</span>
                        <div className="font-bold text-white text-lg uppercase tracking-wide">{team.constructorName || team.name}</div>
                      </div>
                      <div className="text-xl font-mono font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{team.points} <span className="text-sm text-zinc-500 font-sans font-bold">PTS</span></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}