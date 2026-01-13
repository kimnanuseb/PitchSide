import React from 'react';
import { Radio, Search, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="h-16 bg-brand-card border-b border-slate-700 flex items-center px-4 md:px-6 sticky top-0 z-50 shadow-lg shadow-black/20">
      <div className="flex items-center gap-3">
        <button className="md:hidden text-slate-400 hover:text-white">
          <Menu size={24} />
        </button>
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-brand-accent rounded-lg flex items-center justify-center text-brand-dark font-black transform group-hover:rotate-6 transition-transform">
            P
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Pitch<span className="text-brand-accent">Side</span>
          </span>
        </Link>
      </div>

      <div className="flex-1 max-w-xl mx-auto hidden md:block px-6">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-slate-500 group-focus-within:text-brand-accent transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search teams, leagues, or results..."
            className="w-full bg-brand-dark border border-slate-700 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all text-slate-200 placeholder-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <Link to="/" className="hidden sm:flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
          <Radio size={16} className="text-red-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider">Live Hub</span>
        </Link>
        <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-slate-400">
           ME
        </div>
      </div>
    </nav>
  );
};

export default Navbar;