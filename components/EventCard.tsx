import React from 'react';
import { SportEvent } from '../types';
import { Calendar, Clock, ChevronRight, Shield } from 'lucide-react';

interface EventCardProps {
  event: SportEvent;
  onClick: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const isLive = event.status === 'LIVE';
  const isFinished = event.status === 'FINISHED';
  const startTime = new Date(event.startTime);
  const isValidDate = !isNaN(startTime.getTime());

  // Helper for placeholder logos if API doesn't return one
  const Logo = ({ src, alt }: { src?: string, alt: string }) => (
    src ? (
      <img src={src} alt={alt} className="w-10 h-10 object-contain" />
    ) : (
      <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
        <Shield size={20} className="text-slate-500" />
      </div>
    )
  );

  return (
    <div 
      onClick={onClick}
      className="group bg-brand-card hover:bg-slate-800 border border-slate-700 hover:border-brand-accent/50 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 relative shadow-sm hover:shadow-md flex flex-col"
    >
      {/* Background Banner Fade (optional visual flair) */}
      {event.thumb && (
         <div className="absolute top-0 left-0 w-full h-24 opacity-10 pointer-events-none">
            <img src={event.thumb} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-card"></div>
         </div>
      )}

      {/* Header Status */}
      <div className="px-4 py-3 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/30 relative z-10">
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide truncate max-w-[120px]">{event.league}</span>
        </div>
        {isLive ? (
           <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-500 animate-pulse">
             <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> LIVE
           </span>
        ) : (
           <span className="text-[10px] font-medium text-slate-500">
             {isValidDate ? startTime.toLocaleDateString([], {month:'short', day:'numeric'}) + ' ' + startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'TBA'}
           </span>
        )}
      </div>

      {/* Match Content */}
      <div className="p-4 relative z-10">
        <div className="flex items-center justify-between mb-3">
           <div className="flex items-center gap-3">
              <Logo src={event.homeTeamBadge} alt={event.homeTeam} />
              <span className="text-sm font-bold text-white leading-tight">{event.homeTeam}</span>
           </div>
           <span className={`text-xl font-black ${isLive ? 'text-brand-accent' : 'text-slate-200'}`}>
              {event.score?.home ?? '-'}
           </span>
        </div>

        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
              <Logo src={event.awayTeamBadge} alt={event.awayTeam} />
              <span className="text-sm font-bold text-white leading-tight">{event.awayTeam}</span>
           </div>
           <span className={`text-xl font-black ${isLive ? 'text-brand-accent' : 'text-slate-200'}`}>
              {event.score?.away ?? '-'}
           </span>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800 pt-3">
           <span className="truncate max-w-[150px]">{event.venue || 'TBA'}</span>
           {isLive && <span className="text-brand-accent flex items-center gap-1 font-bold">Watch <ChevronRight size={12} /></span>}
        </div>
      </div>
    </div>
  );
};

export default EventCard;