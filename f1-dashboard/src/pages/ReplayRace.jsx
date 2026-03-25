import { useEffect, useState, useMemo, useRef } from 'react';
import { getLiveLeaderboard, getLiveTrack } from '../services/api';
import { Radio, MapPin, Play, Pause, RotateCcw, ChevronDown } from 'lucide-react';
import { getTeamColor } from '../utils/colors';

const getTireStyle = (compound) => {
  if (!compound) return 'bg-zinc-800 text-zinc-400 border-zinc-700';
  const c = compound.toLowerCase();
  if (c.includes('soft')) return 'bg-red-600 text-white border-red-500 shadow-[0_0_8px_rgba(220,38,38,0.5)]';
  if (c.includes('medium')) return 'bg-yellow-400 text-black border-yellow-300 shadow-[0_0_8px_rgba(250,204,21,0.5)]';
  if (c.includes('hard')) return 'bg-white text-black border-gray-200 shadow-[0_0_8px_rgba(255,255,255,0.5)]';
  if (c.includes('inter')) return 'bg-green-500 text-white border-green-400 shadow-[0_0_8px_rgba(34,197,94,0.5)]';
  if (c.includes('wet')) return 'bg-blue-500 text-white border-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]';
  return 'bg-zinc-800 text-zinc-300 border-zinc-700';
};

const TrackMap = ({ telemetry, leaderboard, circuitInfo }) => {
  const previousPositions = useRef({});
  const [trackPoints, setTrackPoints] = useState([]);
  const [viewBox, setViewBox] = useState("-550 -380 700 550");

  useEffect(() => {
    if (circuitInfo && circuitInfo.trackPoints) {
      setTrackPoints(circuitInfo.trackPoints);
      setViewBox(circuitInfo.viewBox || "-550 -380 700 550");
    }
  }, [circuitInfo]);

  const getDriverCode = (driverNumber) => {
    const driver = leaderboard.find(d => d.driverNumber === driverNumber);
    if (!driver || !driver.driverName) return String(driverNumber);
    const nameParts = driver.driverName.split(' ');
    return nameParts[nameParts.length - 1].substring(0, 3).toUpperCase();
  };

  const viewBoxInfo = useMemo(() => {
    return {
      viewBox: viewBox,
      dotSize: 8,
      fontSize: 14
    };
  }, [viewBox]);

  const trackPath = useMemo(() => {
    if (!trackPoints || trackPoints.length === 0) return "";
    return trackPoints.map(p => `${p.x},${p.y}`).join(' ');
  }, [trackPoints]);

  return (
    <div className="bg-zinc-950 rounded-b-xl border border-t-0 border-zinc-800 overflow-hidden relative w-full h-[400px] xl:h-[600px] flex items-center justify-center shadow-inner">
      <div className="absolute top-4 left-4 flex items-center gap-2 z-10 bg-zinc-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-800">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <span className="text-zinc-400 font-mono text-xs font-bold tracking-widest uppercase">Replay Mode</span>
      </div>

      <div className="absolute top-4 right-4 bg-zinc-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-800">
        <span className="text-zinc-400 font-mono text-xs font-bold tracking-widest uppercase">
          {circuitInfo?.flag || '🇲🇨'} {circuitInfo?.name || 'Monaco GP'}
        </span>
      </div>

      {telemetry.length === 0 ? (
        <span className="text-zinc-600 font-mono text-sm">Awaiting Track Data...</span>
      ) : (
        <svg 
          viewBox={viewBoxInfo.viewBox} 
          className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]"
          style={{ transform: 'scaleY(-1)' }} 
        >
          <polyline
            points={trackPath}
            fill="none"
            stroke="#3f3f46"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.6"
          />
          
          <polyline
            points={trackPath}
            fill="none"
            stroke="#52525b"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="8,6"
            opacity="0.4"
          />

          <line x1="-15" y1="-15" x2="-15" y2="15" stroke="#ffffff" strokeWidth="4" opacity="0.8" />
          <line x1="-15" y1="-15" x2="-15" y2="15" stroke="#ef4444" strokeWidth="3" strokeDasharray="5,5" opacity="0.9" />

          <text x="20" y="20" fill="#71717a" fontSize="12" fontWeight="bold" style={{ transform: 'scaleY(-1)' }}>
            START
          </text>

          {telemetry.map((car) => {
            const x = car.x || 0;
            const y = car.y || 0;
            const driverCode = getDriverCode(car.driverNumber);
            
            const driverRecord = leaderboard.find(d => d.driverNumber === car.driverNumber);
            const teamColor = getTeamColor(car.teamName || driverRecord?.teamName || 'Unknown'); 
            const isPitting = driverRecord?.pitStop;

            const prev = previousPositions.current[car.driverNumber] || { x, y, angle: 0 };
            const dx = x - prev.x;
            const dy = y - prev.y;
            let angle = prev.angle;
            
            if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
              angle = Math.atan2(dy, dx) * (180 / Math.PI);
            }
            previousPositions.current[car.driverNumber] = { x, y, angle };

            return (
              <g 
                key={car.driverNumber}
                style={{ 
                  transform: `translate(${x}px, ${y}px)`,
                  transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  willChange: 'transform'
                }}
              >
                <path 
                  d={`M ${viewBoxInfo.dotSize * 1.5} 0 L -${viewBoxInfo.dotSize} ${viewBoxInfo.dotSize} L -${viewBoxInfo.dotSize} -${viewBoxInfo.dotSize} Z`}
                  fill={teamColor}
                  opacity="0.8"
                  style={{ 
                    transform: `rotate(${angle}deg)`, 
                    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    transformOrigin: 'center'
                  }}
                />
                
                <circle cx={0} cy={0} r={viewBoxInfo.dotSize} fill={isPitting ? '#ef4444' : teamColor} stroke="#ffffff" strokeWidth={viewBoxInfo.dotSize * 0.25} filter="drop-shadow(0 0 3px rgba(0,0,0,0.8))">
                  <animate attributeName="r" values={`${viewBoxInfo.dotSize};${viewBoxInfo.dotSize * 1.1};${viewBoxInfo.dotSize}`} dur="2s" repeatCount="indefinite" />
                </circle>
                
                <text x={0} y={-(viewBoxInfo.dotSize * 2.2)} fill={isPitting ? '#ef4444' : '#ffffff'} fontSize={viewBoxInfo.fontSize} fontWeight="900" textAnchor="middle" style={{ transform: 'scaleY(-1)' }} filter="drop-shadow(0 0 2px rgba(0,0,0,0.9))">
                  {driverCode}
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
};

export default function ReplayRace() {
  const [positions, setPositions] = useState([]);
  const [trackTelemetry, setTrackTelemetry] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('Not started');
  
  const [availableRaces, setAvailableRaces] = useState([]);
  const [selectedRace, setSelectedRace] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showRaceSelector, setShowRaceSelector] = useState(false);
  const [progress, setProgress] = useState({ currentLap: 0, totalLaps: 78 });
  const [circuitInfo, setCircuitInfo] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_PUBLIC_BACKEND_URL || 'http://localhost:9090/api'}/replay/available-races`)
      .then(res => res.json())
      .then(data => {
        setAvailableRaces(data);
        if (data.length > 0) {
          handleRaceSelect(data[0]);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedRace && selectedRace.circuitName) {
      fetch(`${import.meta.env.VITE_PUBLIC_BACKEND_URL || 'http://localhost:9090/api'}/replay/circuit-info/${selectedRace.circuitName}`)
        .then(res => res.json())
        .then(data => setCircuitInfo(data))
        .catch(console.error);
    }
  }, [selectedRace]);

  useEffect(() => {
    let isMounted = true;

    const fetchLeaderboard = async () => {
      try {
        const res = await getLiveLeaderboard();
        if (!isMounted) return;

        const data = Array.isArray(res.data) ? res.data : (res.data?.content || []);
        if (data && data.length > 0) {
          setPositions(data);
          setIsActive(true);
        }
      } catch (error) {
        console.error("Leaderboard fetch error:", error);
      }
    };

    fetchLeaderboard();
    const intervalId = setInterval(fetchLeaderboard, 5000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchTrack = async () => {
      try {
        const res = await getLiveTrack();
        if (!isMounted) return;

        const data = Array.isArray(res.data) ? res.data : (res.data?.content || []);
        if (data && data.length > 0) {
          setTrackTelemetry(data);
          setLastUpdated(new Date().toLocaleTimeString());
        }
      } catch (error) {
        console.error("Track fetch error:", error);
      }
    };

    fetchTrack();
    const intervalId = setInterval(fetchTrack, 1000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      fetch(`${import.meta.env.VITE_PUBLIC_BACKEND_URL || 'http://localhost:9090/api'}/replay/progress`)
        .then(res => res.json())
        .then(data => {
          setProgress(data);
          setIsPlaying(data.isPlaying);
        })
        .catch(console.error);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleRaceSelect = (race) => {
    setSelectedRace(race);
    setShowRaceSelector(false);
    
    fetch(`${import.meta.env.VITE_PUBLIC_BACKEND_URL || 'http://localhost:9090/api'}/replay/select/${race.round}`, { method: 'POST' })
      .then(res => res.json())
      .then(() => {
        setIsPlaying(false);
        setProgress({ currentLap: 0, totalLaps: 78 });
      })
      .catch(console.error);
  };

  const handlePlayPause = () => {
    const action = isPlaying ? 'pause' : 'play';
    fetch(`${import.meta.env.VITE_PUBLIC_BACKEND_URL || 'http://localhost:9090/api'}/replay/control/${action}`, { method: 'POST' })
      .then(res => res.json())
      .then(() => setIsPlaying(!isPlaying))
      .catch(console.error);
  };

  const handleReset = () => {
    fetch(`${import.meta.env.VITE_PUBLIC_BACKEND_URL || 'http://localhost:9090/api'}/replay/control/reset`, { method: 'POST' })
      .then(res => res.json())
      .then(() => {
        setIsPlaying(false);
        setProgress({ currentLap: 0, totalLaps: 78 });
      })
      .catch(console.error);
  };

  return (
    <div className="animate-fade-in max-w-[100rem] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,1)]"></div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tight">Race Replay</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowRaceSelector(!showRaceSelector)}
              className="bg-zinc-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-zinc-800 shadow-inner flex items-center gap-2 hover:bg-zinc-800 transition-colors"
            >
              <span className="text-white font-bold text-sm">
                {selectedRace ? selectedRace.raceName : 'Select Race'}
              </span>
              <ChevronDown size={16} className="text-zinc-400" />
            </button>
            
            {showRaceSelector && (
              <div className="absolute top-full mt-2 right-0 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl max-h-96 overflow-y-auto min-w-[300px] z-50">
                {availableRaces.map((race) => (
                  <button
                    key={race.round}
                    onClick={() => handleRaceSelect(race)}
                    className="w-full text-left px-4 py-3 hover:bg-zinc-800 transition-colors border-b border-zinc-800 last:border-b-0"
                  >
                    <div className="text-white font-bold">{race.raceName}</div>
                    <div className="text-zinc-500 text-xs mt-1">Round {race.round} • {race.date}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 bg-zinc-900/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-zinc-800">
            <button onClick={handlePlayPause} className="p-1 hover:bg-zinc-800 rounded transition-colors">
              {isPlaying ? <Pause size={18} className="text-blue-500" /> : <Play size={18} className="text-blue-500" />}
            </button>
            <button onClick={handleReset} className="p-1 hover:bg-zinc-800 rounded transition-colors">
              <RotateCcw size={18} className="text-zinc-400" />
            </button>
            <div className="text-xs font-mono text-zinc-400 ml-2">
              Lap {progress.currentLap}/{progress.totalLaps}
            </div>
          </div>

          <div className="text-sm font-mono text-zinc-400 font-bold bg-zinc-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-zinc-800 shadow-inner flex items-center gap-2">
            <Radio size={14} className="text-blue-500" />
            <span className="text-white">{lastUpdated}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 xl:col-span-5 flex flex-col h-full">
          <div className="bg-zinc-900 p-4 border border-zinc-800 rounded-t-xl flex items-center justify-between">
            <h2 className="text-lg font-black text-white italic tracking-wide uppercase flex items-center gap-2">
              <MapPin size={18} className="text-f1-red" /> Circuit Map
            </h2>
          </div>
          <TrackMap telemetry={trackTelemetry} leaderboard={positions} circuitInfo={circuitInfo} />
        </div>

        <div className="lg:col-span-8 xl:col-span-7 bg-f1-card rounded-xl border border-zinc-800 overflow-hidden shadow-2xl flex flex-col">
          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead className="bg-zinc-900/90 text-zinc-400 text-xs uppercase tracking-widest border-b border-zinc-800 sticky top-0 z-10 backdrop-blur-sm">
                <tr>
                  <th className="p-4 w-16 text-center">Pos</th>
                  <th className="p-4">Driver</th>
                  <th className="p-4 text-right">Gap</th>
                  <th className="p-4 text-right">Interval</th>
                  <th className="p-4 text-center">Tyre</th>
                  <th className="p-4 text-right">Last Lap</th>
                  <th className="p-4 w-24 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {positions.map((pos) => {
                  const teamName = pos.teamName || 'Unknown';
                  const teamColor = getTeamColor(teamName);
                  const isPitting = pos.pitStop;
                  
                  return (
                    <tr key={pos.driverNumber} className="hover:bg-zinc-800/40 transition-colors group relative">
                      <td className="relative p-4 text-center font-black text-white text-lg">
                        <div className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-2" style={{ backgroundColor: teamColor }}></div>
                        {pos.position}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-zinc-600 font-black italic text-sm w-6 text-right">{pos.driverNumber}</span>
                          <div>
                            <div className="font-bold text-white uppercase tracking-wide text-lg">{pos.driverName || `Driver ${pos.driverNumber}`}</div>
                            <div className="text-xs uppercase tracking-widest font-semibold mt-0.5" style={{ color: teamColor }}>{teamName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right font-mono text-lg font-medium text-zinc-300">
                        {pos.gap === 'Leader' ? <span className="text-f1-red font-black italic uppercase tracking-wider text-sm">Leader</span> : (pos.gap || '-')}
                      </td>
                      <td className="p-4 text-right font-mono text-lg font-medium text-zinc-400">
                        {pos.interval && pos.interval !== '-' ? pos.interval : <span className="text-zinc-700">-</span>}
                      </td>
                      <td className="p-4 text-center">
                        <div className="inline-flex justify-center w-full">
                          {pos.tireCompound ? (
                            <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center font-black text-xs ${getTireStyle(pos.tireCompound)}`}>
                              {pos.tireCompound.charAt(0).toUpperCase()}
                            </div>
                          ) : (
                            <span className="text-zinc-600">-</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right font-mono text-xl text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">
                        {pos.lastLapTime || 'NO TIME'}
                      </td>
                      <td className="p-4 text-center">
                        {isPitting ? (
                          <div className="inline-flex items-center justify-center bg-red-600 text-white text-xs font-black px-3 py-1 rounded shadow-[0_0_10px_rgba(220,38,38,0.8)] animate-pulse tracking-widest uppercase">PIT</div>
                        ) : (
                          <span className="text-zinc-600 font-bold text-xs uppercase tracking-widest">Track</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
