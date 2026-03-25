// src/components/TrackMap.jsx
import { useMemo } from 'react';
import CarMarker from './CarMarker';

// Helper to grab generic team colors
const getTeamColor = (teamName) => {
  if (!teamName) return '#ef4444';
  const name = teamName.toLowerCase();
  if (name.includes('red bull')) return '#3671C6';
  if (name.includes('ferrari')) return '#E80020';
  if (name.includes('mercedes')) return '#27F4D2';
  if (name.includes('mclaren')) return '#FF8000';
  return '#ef4444'; // Fallback
};

export default function TrackMap({ trackData, leaderboardData }) {
  
  // Dynamically size the track boundaries based on the coordinates
  const viewBox = useMemo(() => {
    if (!trackData || trackData.length === 0) return "0 0 1000 1000";
    
    const xs = trackData.map(d => d.x || 0);
    const ys = trackData.map(d => d.y || 0);
    
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const width = (maxX - minX) || 1000;
    const height = (maxY - minY) || 1000;
    
    // Add 10% padding so cars don't clip the edges of the box
    const paddingX = width * 0.1;
    const paddingY = height * 0.1;

    return `${minX - paddingX} ${minY - paddingY} ${width + paddingX * 2} ${height + paddingY * 2}`;
  }, [trackData]);

  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden relative w-full h-[500px] flex items-center justify-center shadow-inner">
      <svg 
        viewBox={viewBox} 
        className="w-full h-full"
        style={{ transform: 'scaleY(-1)' }} // Invert Y-axis to match standard coordinate mapping
      >
        {trackData.map((car) => {
          // Look up the driver's team in the leaderboard data to assign their color
          const driverStats = leaderboardData.find(d => d.driverNumber === car.driverNumber);
          const color = getTeamColor(driverStats?.teamName);

          return (
            <CarMarker 
              key={car.driverNumber} 
              driverNumber={car.driverNumber} 
              targetX={car.x} 
              targetY={car.y} 
              teamColor={color} 
            />
          );
        })}
      </svg>
    </div>
  );
}