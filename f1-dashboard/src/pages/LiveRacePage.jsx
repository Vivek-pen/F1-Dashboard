// src/pages/LiveRacePage.jsx
import { useEffect, useState } from 'react';
import { TelemetryService } from '../services/TelemetryService';
import TrackMap from '../components/TrackMap';
import LeaderboardPanel from '../components/LeaderboardPanel';
import { Activity } from 'lucide-react';

export default function LiveRacePage() {
  const [trackData, setTrackData] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchTelemetry = async () => {
      try {
        // Fetch both endpoints concurrently to ensure sync
        const [trackRes, leaderboardRes] = await Promise.all([
          TelemetryService.getLiveTrack(),
          TelemetryService.getLiveLeaderboard()
        ]);

        if (!isMounted) return;

        // Safely extract arrays from potential Spring Boot wrapper formats
        const tData = trackRes.data || [];
const lData = leaderboardRes.data || [];

        if (tData.length > 0) {
          setTrackData(tData);
          setLeaderboardData(lData);
          setIsLive(true);
        } else {
          setIsLive(false);
        }
      } catch (error) {
        console.error("Telemetry fetch error:", error);
        if (isMounted) setIsLive(false);
      }
    };

    // Initial fetch
    fetchTelemetry();

    // Set 1-second polling interval
    const intervalId = setInterval(fetchTelemetry, 1000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  if (!isLive) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-500 max-w-5xl mx-auto">
        <Activity size={64} className="mb-6 opacity-20" />
        <h2 className="text-3xl font-black italic tracking-widest text-zinc-600 uppercase mb-2">No Live Telemetry</h2>
        <p className="text-zinc-500 font-medium">The session is currently offline.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[90rem] mx-auto space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-zinc-800 pb-4">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(239,68,68,1)]"></div>
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tight">Live Race Control</h1>
      </div>
      
      {/* Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Track Map (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col h-full">
          <TrackMap trackData={trackData} leaderboardData={leaderboardData} />
        </div>

        {/* Right: Leaderboard (8 Columns) */}
        <div className="lg:col-span-8 flex flex-col">
          <LeaderboardPanel leaderboardData={leaderboardData} />
        </div>

      </div>
    </div>
  );
}