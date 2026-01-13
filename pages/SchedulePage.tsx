import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SportType, SportEvent } from '../types';
import { fetchSchedule, fetchResults, LEAGUE_IDS } from '../services/sportsApi';
import Sidebar from '../components/Sidebar';
import EventCard from '../components/EventCard';
import { Filter, CalendarClock, Trophy, Radio, Loader2 } from 'lucide-react';

const SchedulePage: React.FC = () => {
  const [activeSport, setActiveSport] = useState<SportType | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'LIVE' | 'UPCOMING' | 'RESULTS'>('UPCOMING');
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load Data Effect
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      let data: SportEvent[] = [];

      try {
        // Determine which IDs to fetch based on filter
        const idsToFetch: string[] = [];
        
        // Group Logic: Fetch specific leagues based on the active category
        if (activeSport === 'ALL' || activeSport === SportType.RUGBY_UNION) {
            idsToFetch.push(LEAGUE_IDS.RUGBY_PREMIERSHIP, LEAGUE_IDS.RUGBY_URC, LEAGUE_IDS.RUGBY_SIX_NATIONS);
        }
        if (activeSport === 'ALL' || activeSport === SportType.RUGBY_LEAGUE) {
            idsToFetch.push(LEAGUE_IDS.RUGBY_SUPER_LEAGUE, LEAGUE_IDS.NRL);
        }
        if (activeSport === 'ALL' || activeSport === SportType.RUGBY_SEVENS) {
            idsToFetch.push(LEAGUE_IDS.RUGBY_SEVENS);
        }
        if (activeSport === 'ALL' || activeSport === SportType.SOCCER) {
            idsToFetch.push(LEAGUE_IDS.EPL);
        }
        if (activeSport === 'ALL' || activeSport === SportType.NBA) {
            idsToFetch.push(LEAGUE_IDS.NBA);
        }
        if (activeSport === 'ALL' || activeSport === SportType.NFL) {
            idsToFetch.push(LEAGUE_IDS.NFL);
        }
        if (activeSport === 'ALL' || activeSport === SportType.F1) {
            idsToFetch.push(LEAGUE_IDS.F1);
        }
        if (activeSport === 'ALL' || activeSport === SportType.CRICKET) {
            idsToFetch.push(LEAGUE_IDS.CRICKET_IPL, LEAGUE_IDS.CRICKET_TEST);
        }

        // Fetcher based on View Mode
        const fetcher = viewMode === 'RESULTS' ? fetchResults : fetchSchedule;
        
        const promises = idsToFetch.map(id => fetcher(id));
        const results = await Promise.all(promises);
        
        // Flatten and remove nulls/undefined
        data = results.flat().filter(e => !!e);
        
      } catch (e) {
        console.error("API Error", e);
        data = [];
      }

      setEvents(data);
      setLoading(false);
    };

    loadData();
  }, [activeSport, viewMode]);

  const filteredEvents = useMemo(() => {
    // When 'ALL' is selected, we show everything we fetched.
    // When a specific sport is selected, the useEffect above ALREADY filtered the *fetch* 
    // to only include relevant leagues. 
    // We add a safety filter here just in case, but rely mostly on the fetch logic.
    return events.filter(e => {
        if (activeSport === 'ALL') return true;
        // Loose matching because API sport names vary (e.g. "Motorsport" vs "F1")
        if (activeSport === SportType.F1) return true; 
        if (activeSport === SportType.CRICKET) return true;
        return e.sport.toLowerCase().includes(activeSport.split(' ')[0].toLowerCase());
    });
  }, [events, activeSport]);

  const handleEventClick = (eventId: string) => {
    navigate(`/match/${eventId}`);
  };

  return (
    <div className="flex min-h-screen bg-brand-dark">
      <Sidebar activeSport={activeSport} onSelectSport={setActiveSport} />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)]">
        
        {/* Mobile Filter */}
        <div className="lg:hidden mb-6 overflow-x-auto pb-2 flex gap-2">
            <button onClick={() => setActiveSport('ALL')} className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold ${activeSport === 'ALL' ? 'bg-brand-accent text-brand-dark' : 'bg-slate-800 text-slate-400'}`}>All Sports</button>
            <button onClick={() => setActiveSport(SportType.RUGBY_UNION)} className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold ${activeSport === SportType.RUGBY_UNION ? 'bg-brand-accent text-brand-dark' : 'bg-slate-800 text-slate-400'}`}>Rugby Union</button>
            <button onClick={() => setActiveSport(SportType.SOCCER)} className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold ${activeSport === SportType.SOCCER ? 'bg-brand-accent text-brand-dark' : 'bg-slate-800 text-slate-400'}`}>Soccer</button>
            <button onClick={() => setActiveSport(SportType.F1)} className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold ${activeSport === SportType.F1 ? 'bg-brand-accent text-brand-dark' : 'bg-slate-800 text-slate-400'}`}>F1</button>
        </div>

        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              {activeSport === 'ALL' ? 'Global Feed' : activeSport}
            </h1>
          </div>
          
          <div className="bg-brand-card p-1 rounded-lg flex border border-slate-700/50">
             <button 
                onClick={() => setViewMode('LIVE')}
                className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded transition-all ${viewMode === 'LIVE' ? 'bg-brand-accent text-brand-dark shadow' : 'text-slate-400 hover:text-white'}`}
             >
                <Radio size={14} className={viewMode === 'LIVE' ? 'animate-pulse' : ''} /> Live
             </button>
             <button 
                onClick={() => setViewMode('UPCOMING')}
                className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded transition-all ${viewMode === 'UPCOMING' ? 'bg-brand-accent text-brand-dark shadow' : 'text-slate-400 hover:text-white'}`}
             >
                <CalendarClock size={14} /> Schedule
             </button>
             <button 
                onClick={() => setViewMode('RESULTS')}
                className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded transition-all ${viewMode === 'RESULTS' ? 'bg-brand-accent text-brand-dark shadow' : 'text-slate-400 hover:text-white'}`}
             >
                <Trophy size={14} /> Results
             </button>
          </div>
        </header>

        {loading ? (
            <div className="flex items-center justify-center py-40">
                <Loader2 size={40} className="text-brand-accent animate-spin" />
            </div>
        ) : filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
            <Filter size={48} className="mb-4 text-slate-700" />
            <p className="text-slate-400 font-medium">No matches found.</p>
            <p className="text-slate-600 text-xs mt-2 max-w-sm text-center">
              There are no {viewMode.toLowerCase()} events scheduled for {activeSport === 'ALL' ? 'any sport' : activeSport} in the database right now.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event, idx) => (
              <EventCard 
                key={event.id || idx} 
                event={event} 
                onClick={() => handleEventClick(event.id)} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SchedulePage;