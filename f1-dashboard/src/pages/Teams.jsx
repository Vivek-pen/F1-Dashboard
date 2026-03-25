import { useEffect, useState } from 'react';
import { getTeams } from '../services/api';
import { Shield, ExternalLink } from 'lucide-react';
import { getTeamColor } from '../utils/colors';

// Helper function to map team names to their official websites
const getTeamUrl = (teamName) => {
  if (!teamName) return 'https://www.formula1.com/en/teams.html';
  
  const name = teamName.toLowerCase();
  if (name.includes('red bull')) return 'https://www.redbullracing.com/int-en';
  if (name.includes('ferrari')) return 'https://www.ferrari.com/en-EN/formula1/team';
  if (name.includes('mercedes')) return 'https://www.mercedesamgf1.com/';
  if (name.includes('mclaren')) return 'https://www.mclaren.com/racing/formula-1/';
  if (name.includes('aston')) return 'https://www.astonmartinf1.com/en-GB';
  if (name.includes('alpine')) return 'https://www.alpinef1.com/';
  if (name.includes('williams')) return 'http://williamsf1.com/';
  if (name.includes('rb') || name.includes('visa')||name.includes('vcarb')) return 'https://www.visacashapprb.com/int-en';
  if (name.includes('audi')) return 'https://www.audi.com/en/sport/motorsport/formula-1/';
  if (name.includes('haas')) return 'https://www.haasf1team.com/';
  if(name.includes('cadillac')) return 'https://www.cadillacf1team.com/';
  
  return 'https://www.formula1.com/en/teams.html'; // Fallback
};

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTeams()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : (res.data?.content || []);
        setTeams(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center text-f1-red mt-10 animate-pulse font-bold">Loading Teams...</div>;

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-2 h-8 bg-f1-red rounded-sm shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tight">Constructors</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => {
          const teamColor = getTeamColor(team.name);
          const teamUrl = getTeamUrl(team.name);

          return (
            <a 
              href={teamUrl}
              target="_blank"
              rel="noopener noreferrer"
              key={team.constructorId || team.name} 
              className="bg-f1-card rounded-xl border border-zinc-800 relative overflow-hidden group hover:border-zinc-700 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-all duration-300 flex flex-col min-h-[160px] cursor-pointer"
            >
              {/* Top Color Strip */}
              <div 
                className="h-2 w-full transition-transform duration-500 group-hover:scale-y-150 origin-top z-20" 
                style={{ backgroundColor: teamColor }}
              ></div>

              {/* Gradients */}
              <div 
                className="absolute inset-0 opacity-10 pointer-events-none z-10"
                style={{ background: `linear-gradient(180deg, ${teamColor} 0%, rgba(24, 24, 27, 0) 100%)` }}
              ></div>
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none z-10"
                style={{ background: `radial-gradient(circle at top right, ${teamColor}, transparent 70%)` }}
              ></div>

              {/* Background Icon */}
              <div className="absolute -right-4 -bottom-4 text-zinc-800 opacity-20 group-hover:opacity-40 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 z-10">
                <Shield size={140} />
              </div>

              {/* Card Content */}
              <div className="relative z-20 p-6 flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <h3 className="text-3xl font-black text-white tracking-wide uppercase italic drop-shadow-md">
                    {team.name}
                  </h3>
                  {/* Added an external link icon that appears on hover to signal it's clickable */}
                  <ExternalLink size={20} className="text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:text-white" />
                </div>
                
                <div className="mt-4 inline-block">
                  <span className="px-4 py-1.5 rounded-lg bg-zinc-950/80 backdrop-blur-sm text-xs font-bold text-zinc-300 border border-zinc-800 uppercase tracking-wider shadow-inner flex items-center gap-2 w-max">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: teamColor }}></span>
                    {team.nationality}
                  </span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}