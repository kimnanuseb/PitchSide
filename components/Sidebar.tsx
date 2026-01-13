import React from 'react';
import { SportType } from '../types';
import { 
  Trophy, Activity, Target, Club, Flame, Map, 
  CircleDashed, MonitorPlay, Zap, Code
} from 'lucide-react';

interface SidebarProps {
  activeSport: SportType | 'ALL';
  onSelectSport: (sport: SportType | 'ALL') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSport, onSelectSport }) => {
  const mainCategories = [
    { id: 'ALL', label: 'All Sports', icon: <Trophy size={18} /> },
    { id: SportType.RUGBY_UNION, label: 'Rugby Union', icon: <Target size={18} /> },
    { id: SportType.RUGBY_LEAGUE, label: 'Rugby League', icon: <Target size={18} /> },
    { id: SportType.RUGBY_SEVENS, label: 'Rugby Sevens', icon: <Target size={18} /> },
  ];

  const secondaryCategories = [
    { id: SportType.SOCCER, label: 'Soccer', icon: <Activity size={18} /> },
    { id: SportType.CRICKET, label: 'Cricket', icon: <Club size={18} /> },
    { id: SportType.NFL, label: 'NFL', icon: <Flame size={18} /> },
    { id: SportType.NBA, label: 'NBA', icon: <CircleDashed size={18} /> },
    { id: SportType.F1, label: 'Formula 1', icon: <Zap size={18} /> },
  ];

  const CategoryButton = ({ item }: { item: any }) => (
    <button
      onClick={() => onSelectSport(item.id as SportType | 'ALL')}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
        activeSport === item.id
          ? 'bg-brand-accent text-brand-dark font-bold shadow-lg shadow-green-900/20'
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`}
    >
      {item.icon}
      {item.label}
    </button>
  );

  return (
    <aside className="w-64 bg-brand-dark border-r border-slate-800 hidden lg:flex flex-col h-[calc(100vh-64px)] sticky top-16 overflow-y-auto z-40">
      <div className="p-4 space-y-6">
        <div>
          <h3 className="text-[10px] font-black text-brand-accent uppercase tracking-widest mb-3 px-2">
            Main Events
          </h3>
          <ul className="space-y-1">
            {mainCategories.map((cat) => (
              <li key={cat.id}><CategoryButton item={cat} /></li>
            ))}
          </ul>
        </div>

        <div>
           <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-3 px-2">
            Global
          </h3>
          <ul className="space-y-1">
            {secondaryCategories.map((cat) => (
              <li key={cat.id}><CategoryButton item={cat} /></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-slate-800">
        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2">
            <Map size={14} className="text-brand-accent" />
            <h4 className="text-white text-xs font-bold">PitchSide PWA</h4>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Crafted by <span className="text-brand-accent">Soig Creations</span>
            <br />
            Developer Giovanni Nanuseb
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;