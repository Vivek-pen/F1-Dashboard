import { NavLink } from 'react-router-dom';
import { Home, Calendar, Trophy, Users, Building2, Radio } from 'lucide-react';

export default function Navbar() {
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg font-bold uppercase tracking-wide text-sm transition-all duration-200 ${
      isActive
        ? 'bg-f1-red text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]'
        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
    }`;

  return (
    <nav className="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-50 shadow-xl">
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-f1-red rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.3)] group-hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] transition-all duration-300">
              <span className="text-white font-black text-xl italic">F1</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-white font-black text-xl italic tracking-tight">F1 DASHBOARD</div>
              <div className="text-zinc-500 text-xs font-bold tracking-widest uppercase">2026 Season</div>
            </div>
          </NavLink>

          <div className="flex items-center gap-2">
            <NavLink to="/" className={navLinkClass}>
              <Home size={18} />
              <span className="hidden md:inline">Home</span>
            </NavLink>

            <NavLink to="/replay" className={navLinkClass}>
              <Radio size={18} />
              <span className="hidden md:inline">Replay Race</span>
            </NavLink>

            <NavLink to="/races" className={navLinkClass}>
              <Calendar size={18} />
              <span className="hidden md:inline">Races</span>
            </NavLink>

            <NavLink to="/standings" className={navLinkClass}>
              <Trophy size={18} />
              <span className="hidden md:inline">Standings</span>
            </NavLink>

            <NavLink to="/drivers" className={navLinkClass}>
              <Users size={18} />
              <span className="hidden md:inline">Drivers</span>
            </NavLink>

            <NavLink to="/teams" className={navLinkClass}>
              <Building2 size={18} />
              <span className="hidden md:inline">Teams</span>
            </NavLink>
          </div>

        </div>
      </div>
    </nav>
  );
}
