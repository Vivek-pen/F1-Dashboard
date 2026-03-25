import { useEffect, useState, useMemo, useRef } from 'react';
import { getLiveLeaderboard, getLiveTrack } from '../services/api';
import { Radio, MapPin } from 'lucide-react';
import { getTeamColor } from '../utils/colors';

// --- HELPER: TIRE COMPOUND STYLING ---
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

// --- COMPONENT: DYNAMIC TRACK MAP WITH GPU INTERPOLATION ---
const TrackMap = ({ telemetry, leaderboard }) => {
  // We use a ref to remember exactly where the car was in the last frame
  // This allows us to calculate the angle it is turning!
  const previousPositions = useRef({});

  const getDriverCode = (driverNumber) => {
    const driver = leaderboard.find(d => d.driverNumber === driverNumber);
    if (!driver || !driver.driverName) return String(driverNumber);
    const nameParts = driver.driverName.split(' ');
    return nameParts[nameParts.length - 1].substring(0, 3).toUpperCase();
  };

  const viewBoxInfo = useMemo(() => {
    // Fixed viewBox for Monaco track layout
    return {
      viewBox: "-550 -380 700 550",
      dotSize: 8,
      fontSize: 14
    };
  }, []);

  // Monaco track path (matching backend coordinates)
  const trackPath = useMemo(() => {
    const points = [
      // Start/Finish straight
      [0, 0], [50, 0], [100, 0], [150, 0], [200, 0],
      
      // Turn 1 - Sainte Devote
      [250, 0], [280, -20], [300, -50], [310, -85], [310, -120],
      
      // Turn 2 - Beau Rivage
      [310, -160], [310, -200], [305, -240], [295, -275],
      
      // Turn 3 - Massenet
      [280, -300], [260, -315], [235, -325], [205, -330],
      
      // Turn 4 - Casino Square
      [170, -330], [140, -325], [115, -310], [95, -290],
      
      // Turn 5 - Mirabeau
      [80, -265], [70, -235], [65, -205], [60, -175],
      
      // Tunnel entrance
      [55, -145], [48, -115], [40, -85], [30, -60],
      
      // Turn 6 - Portier
      [15, -40], [-5, -25], [-25, -15], [-45, -10],
      
      // Tunnel section
      [-75, -5], [-110, 0], [-150, 5], [-195, 10],
      [-240, 15], [-285, 20], [-330, 25], [-370, 28],
      
      // Tunnel exit
      [-405, 30], [-435, 30], [-460, 28], [-480, 22],
      
      // Turn 10 - Nouvelle Chicane
      [-495, 10], [-505, -5], [-510, -25], [-510, -45],
      [-508, -65], [-500, -80], [-485, -90], [-465, -95],
      
      // Turn 11 - Tabac
      [-440, -100], [-410, -100], [-380, -95], [-355, -85],
      
      // Swimming Pool complex
      [-335, -70], [-320, -50], [-310, -25], [-305, 0],
      [-305, 25], [-310, 50], [-320, 70], [-335, 85],
      
      // Turn 14 - La Rascasse
      [-355, 95], [-380, 100], [-410, 100], [-435, 95],
      
      // Turn 15 - Anthony Noghes
      [-455, 85], [-470, 70], [-480, 50], [-485, 25],
      [-485, 0], [-480, -25], [-470, -45], [-455, -60],
      
      // Back to start/finish
      [-430, -70], [-400, -75], [-360, -75], [-320, -70],
      [-280, -60], [-240, -45], [-200, -30], [-160, -15],
      [-120, -5], [-80, 0], [-40, 0]
    ];
    
    return points.map(p => `${p[0]},${p[1]}`).join(' ');
  }, []);

  return (
    <div className="bg-zinc-950 rounded-b-xl border border-t-0 border-zinc-800 overflow-hidden relative w-full h-[400px] xl:h-[600px] flex items-center justify-center shadow-inner">
      <div className="absolute top-4 left-4 flex items-center gap-2 z-10 bg-zinc-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-800">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <span className="text-zinc-400 font-mono text-xs font-bold tracking-widest uppercase">Replay Mode</span>
      </div>

      {/* Track Info Badge */}
      <div className="absolute top-4 right-4 bg-zinc-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-800">
        <span className="text-zinc-400 font-mono text-xs font-bold tracking-widest uppercase">🇲🇨 Monaco GP</span>
      </div>

      {telemetry.length === 0 ? (
        <span className="text-zinc-600 font-mono text-sm">Awaiting Track Data...</span>
      ) : (
        <svg 
          viewBox={viewBoxInfo.viewBox} 
          className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]"
          style={{ transform: 'scaleY(-1)' }} 
        >
          {/* Draw the track path */}
          <polyline
            points={trackPath}
            fill="none"
            stroke="#3f3f46"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.6"
          />
          
          {/* Track center line */}
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

          {/* Start/Finish Line */}
          <line
            x1="-15"
            y1="-15"
            x2="-15"
            y2="15"
            stroke="#ffffff"
            strokeWidth="4"
            opacity="0.8"
          />
          <line
            x1="-15"
            y1="-15"
            x2="-15"
            y2="15"
            stroke="#ef4444"
            strokeWidth="3"
            strokeDasharray="5,5"
            opacity="0.9"
          />

          {/* Track Labels */}
          <text
            x="20"
            y="20"
            fill="#71717a"
            fontSize="12"
            fontWeight="bold"
            style={{ transform: 'scaleY(-1)' }}
          >
            START
          </text>

          {telemetry.map((car) => {
            const x = car.x || 0;
            const y = car.y || 0;
            const driverCode = getDriverCode(car.driverNumber);
            
            const driverRecord = leaderboard.find(d => d.driverNumber === car.driverNumber);
            const teamColor = getTeamColor(car.teamName || driverRecord?.teamName || 'Unknown'); 
            const isPitting = driverRecord?.pitStop;

            // Math to calculate rotation angle
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
                  // Smooth transition matching backend update rate
                  transform: `translate(${x}px, ${y}px)`,
                  transition: 'transform 1s linear' 
                }}
              >
                {/* Arrow rotating in the direction of travel */}
                <path 
                  d={`M ${viewBoxInfo.dotSize * 1.5} 0 L -${viewBoxInfo.dotSize} ${viewBoxInfo.dotSize} L -${viewBoxInfo.dotSize} -${viewBoxInfo.dotSize} Z`}
                  fill={teamColor}
                  opacity="0.8"
                  style={{ 
                    transform: `rotate(${angle}deg)`, 
                    transition: 'transform 1s linear'
                  }}
                />
                
                {/* Main Car Dot */}
                <circle
                  cx={0}
                  cy={0}
                  r={viewBoxInfo.dotSize}
                  fill={isPitting ? '#ef4444' : teamColor}
                  stroke="#ffffff"
                  strokeWidth={viewBoxInfo.dotSize * 0.25}
                  filter="drop-shadow(0 0 3px rgba(0,0,0,0.8))"
                />
                
                {/* Driver Abbreviation */}
                <text
                  x={0}
                  y={-(viewBoxInfo.dotSize * 2.2)} 
                  fill={isPitting ? '#ef4444' : '#ffffff'}
                  fontSize={viewBoxInfo.fontSize}
                  fontWeight="900"
                  textAnchor="middle"
                  style={{ transform: 'scaleY(-1)' }}
                  filter="drop-shadow(0 0 2px rgba(0,0,0,0.9))"
                >
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

// --- MAIN PAGE: LIVE RACE ---
export default function LiveRace() {
  const [positions, setPositions] = useState([]);
  const [trackTelemetry, setTrackTelemetry] = useState([]);
  const [isLive, setIsLive] = useState(true); 
  const [lastUpdated, setLastUpdated] = useState('Connecting...');

  // 1. Leaderboard Polling (Every 5 seconds)
  useEffect(() => {
    let isMounted = true;

    const fetchLeaderboard = async () => {
      try {
        const res = await getLiveLeaderboard();
        if (!isMounted) return;

        const data = Array.isArray(res.data) ? res.data : (res.data?.content || []);
        if (data && data.length > 0) {
          setPositions(data);
          setIsLive(true);
        } else {
          setIsLive(false); 
        }
      } catch (error) {
        console.error("Leaderboard fetch error:", error);
        if (isMounted) setIsLive(false); 
      }
    };

    fetchLeaderboard();
    const intervalId = setInterval(fetchLeaderboard, 5000); 

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  // 2. Track GPS Polling (Every 2 seconds for smooth CSS interpolation)
  useEffect(() => {
    let isMounted = true;
    
    if (!isLive) return;

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
    const intervalId = setInterval(fetchTrack, 2000); 

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [isLive]); 

  // --- OFFLINE UI FALLBACK ---
  if (!isLive) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-500 animate-fade-in max-w-5xl mx-auto">
        <Radio size={64} className="mb-6 opacity-20" />
        <h2 className="text-3xl font-black italic tracking-widest text-zinc-600 uppercase mb-2">No Replay Data</h2>
        <p className="text-zinc-500 font-medium">Replay data is unavailable. Please check the backend configuration.</p>
      </div>
    );
  }

  // --- LIVE DASHBOARD UI ---
  return (
    <div className="animate-fade-in max-w-[100rem] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,1)]"></div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tight">Race Replay</h1>
        </div>
        <div className="text-sm font-mono text-zinc-400 font-bold bg-zinc-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-zinc-800 shadow-inner flex items-center gap-2">
          <Radio size={14} className="text-blue-500" />
          REPLAY: <span className="text-white">{lastUpdated}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: TRACK MAP */}
        <div className="lg:col-span-4 xl:col-span-5 flex flex-col h-full">
          <div className="bg-zinc-900 p-4 border border-zinc-800 rounded-t-xl flex items-center justify-between">
            <h2 className="text-lg font-black text-white italic tracking-wide uppercase flex items-center gap-2">
              <MapPin size={18} className="text-f1-red" /> Circuit Map
            </h2>
          </div>
          <TrackMap telemetry={trackTelemetry} leaderboard={positions} />
        </div>

        {/* RIGHT COLUMN: TIMING TOWER */}
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
                        <div 
                          className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-2"
                          style={{ backgroundColor: teamColor }}
                        ></div>
                        {pos.position}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-zinc-600 font-black italic text-sm w-6 text-right">
                            {pos.driverNumber}
                          </span>
                          <div>
                            <div className="font-bold text-white uppercase tracking-wide text-lg">
                              {pos.driverName || `Driver ${pos.driverNumber}`}
                            </div>
                            <div className="text-xs uppercase tracking-widest font-semibold mt-0.5" style={{ color: teamColor }}>
                              {teamName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right font-mono text-lg font-medium text-zinc-300">
                        {pos.gap === 'Leader' ? (
                          <span className="text-f1-red font-black italic uppercase tracking-wider text-sm">Leader</span>
                        ) : (
                          pos.gap || '-'
                        )}
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
                          <div className="inline-flex items-center justify-center bg-red-600 text-white text-xs font-black px-3 py-1 rounded shadow-[0_0_10px_rgba(220,38,38,0.8)] animate-pulse tracking-widest uppercase">
                            PIT
                          </div>
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