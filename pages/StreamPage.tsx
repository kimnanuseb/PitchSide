import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SportEvent, CommentaryItem } from '../types';
import { ArrowLeft, MapPin, Share2, Sparkles, Mic2, RefreshCw, Trophy, Shield, Loader2, Info } from 'lucide-react';
import ChatWidget from '../components/ChatWidget';
import Navbar from '../components/Navbar';
import { fetchEventById } from '../services/sportsApi';

const MatchCenterPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<SportEvent | undefined>();
  const [loading, setLoading] = useState(true);
  const [commentary, setCommentary] = useState<CommentaryItem[]>([]);
  
  // Simulators for "Live Feeling" since Open APIs don't push websocket updates
  const [displayHomeScore, setDisplayHomeScore] = useState<string | number>(0);
  const [displayAwayScore, setDisplayAwayScore] = useState<string | number>(0);
  const [gameTime, setGameTime] = useState(0);

  useEffect(() => {
    const loadEvent = async () => {
        setLoading(true);
        let found = undefined;
        
        // Only fetch from Real API
        if (id) {
             try {
                 const apiEvent = await fetchEventById(id);
                 if (apiEvent) {
                     found = apiEvent;
                 }
             } catch (e) {
                 console.error("Failed to load match", e);
             }
        }
        
        if (found) {
            setEvent(found);
            setDisplayHomeScore(found.score?.home || 0);
            setDisplayAwayScore(found.score?.away || 0);
        }
        setLoading(false);
    };

    loadEvent();
  }, [id]);

  // Simulation Effect for "Live" feel
  useEffect(() => {
    if (!event || event.status !== 'LIVE') return;

    const interval = setInterval(() => {
        setGameTime(prev => prev + 1);
        // Randomly add commentary
        if (Math.random() > 0.8) {
            const comments = [
                "Solid defense from the home side.",
                "Big tackle in the midfield!",
                "They are building phases nicely here.",
                "Kick to touch, lineout upcoming.",
                "Ref checks the TMO... play on."
            ];
            const text = comments[Math.floor(Math.random() * comments.length)];
            setCommentary(prev => [{ id: Date.now().toString(), time: `${gameTime}'`, text, type: 'info' }, ...prev]);
        }
    }, 3000);

    return () => clearInterval(interval);
  }, [event, gameTime]);

  if (loading) {
      return (
        <div className="min-h-screen bg-brand-dark flex flex-col">
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
                <Loader2 size={32} className="animate-spin text-brand-accent" />
                <span className="text-sm font-medium">Connecting to live feed...</span>
            </div>
        </div>
      );
  }

  if (!event) {
      return (
        <div className="min-h-screen bg-brand-dark flex flex-col">
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
                <Info size={32} />
                <span className="text-sm font-medium">Match not found or unavailable.</span>
                <p className="text-xs text-slate-600 max-w-xs text-center">
                    This event ID does not exist in the public database or has expired.
                </p>
                <Link to="/" className="text-brand-accent hover:underline text-sm mt-2">Return to Schedule</Link>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Match Center */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Header Navigation */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Link to="/" className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <span className="text-slate-400 text-sm font-medium">{event.league}</span>
                </div>
                <div className="text-[10px] text-slate-500 bg-slate-800 px-2 py-1 rounded border border-slate-700 font-medium">
                    Soig Creations Live Feed
                </div>
            </div>

            {/* Scoreboard Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-xl overflow-hidden relative">
                {event.thumb && (
                    <div className="absolute inset-0 opacity-20">
                        <img src={event.thumb} className="w-full h-full object-cover" alt="" />
                    </div>
                )}
                <div className="absolute top-0 inset-x-0 h-1 bg-brand-accent"></div>
                
                {/* Live Status Bar */}
                <div className="bg-black/40 backdrop-blur-sm p-2 flex justify-center items-center gap-2 text-[10px] font-bold tracking-widest text-slate-300 relative z-10">
                    {event.status === 'LIVE' ? (
                        <>
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            LIVE • {gameTime > 0 ? gameTime + "'" : 'In Progress'}
                        </>
                    ) : (
                        <span>{event.status} {event.status === 'SCHEDULED' ? `• ${new Date(event.startTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}` : ''}</span>
                    )}
                </div>

                <div className="p-8 flex items-center justify-between relative z-10">
                    {/* Home Team */}
                    <div className="flex flex-col items-center flex-1">
                        {event.homeTeamBadge ? (
                            <img src={event.homeTeamBadge} alt={event.homeTeam} className="w-20 h-20 md:w-24 md:h-24 object-contain mb-4 drop-shadow-lg" />
                        ) : (
                            <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center border-4 border-slate-600 mb-4">
                                <Shield size={32} className="text-slate-400" />
                            </div>
                        )}
                        <h2 className="text-xl md:text-2xl font-bold text-white text-center leading-tight">{event.homeTeam}</h2>
                    </div>

                    {/* Score */}
                    <div className="flex flex-col items-center px-4 md:px-10">
                        <div className="text-5xl md:text-7xl font-black text-white tracking-tighter flex items-center gap-4 drop-shadow-2xl">
                            <span>{displayHomeScore}</span>
                            <span className="text-slate-500 text-3xl">:</span>
                            <span>{displayAwayScore}</span>
                        </div>
                        <div className="mt-2 text-xs font-mono text-brand-accent bg-brand-accent/10 px-3 py-1 rounded backdrop-blur-md border border-brand-accent/20">
                            {event.period || 'Match Center'}
                        </div>
                    </div>

                    {/* Away Team */}
                    <div className="flex flex-col items-center flex-1">
                        {event.awayTeamBadge ? (
                            <img src={event.awayTeamBadge} alt={event.awayTeam} className="w-20 h-20 md:w-24 md:h-24 object-contain mb-4 drop-shadow-lg" />
                        ) : (
                            <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center border-4 border-slate-600 mb-4">
                                <Shield size={32} className="text-slate-400" />
                            </div>
                        )}
                        <h2 className="text-xl md:text-2xl font-bold text-white text-center leading-tight">{event.awayTeam}</h2>
                    </div>
                </div>

                <div className="bg-slate-900/60 backdrop-blur-sm p-3 flex items-center justify-between border-t border-slate-800 text-xs text-slate-400 relative z-10">
                    <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        {event.venue || 'Venue TBD'}
                    </div>
                    <div className="flex items-center gap-2">
                         <Trophy size={14} />
                         {event.league}
                    </div>
                </div>
            </div>

            {/* Live Feed / Commentary */}
            <div className="bg-brand-card rounded-xl border border-slate-700 flex flex-col h-[400px]">
                <div className="p-4 border-b border-slate-700 flex items-center gap-2">
                    <Mic2 size={18} className="text-brand-accent" />
                    <h3 className="font-bold text-white">Match Commentary</h3>
                    {event.status !== 'LIVE' && <span className="text-xs text-slate-500 ml-auto font-normal">Waiting for start</span>}
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {commentary.length === 0 && (
                        <div className="text-center text-slate-500 py-10 flex flex-col items-center">
                            <span className="mb-2">Connecting to audio commentary stream...</span>
                        </div>
                    )}
                    {commentary.map(comm => (
                        <div key={comm.id} className="flex gap-4 animate-in fade-in slide-in-from-right-4">
                            <div className="w-10 text-right text-xs font-mono text-brand-accent font-bold pt-1">
                                {comm.time}
                            </div>
                            <div className="flex-1 pb-4 border-b border-slate-800 border-dashed">
                                <p className={`text-sm ${comm.type === 'try' ? 'font-bold text-white' : 'text-slate-300'}`}>
                                    {comm.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Right Column: Chat & Info */}
        <div className="flex flex-col gap-6">
           <div className="h-[500px] lg:h-auto lg:flex-1">
             <ChatWidget matchContext={`${event.homeTeam} vs ${event.awayTeam}`} />
           </div>
        </div>

      </div>
    </div>
  );
};

export default MatchCenterPage;