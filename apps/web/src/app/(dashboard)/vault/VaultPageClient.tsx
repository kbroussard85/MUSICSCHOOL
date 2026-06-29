'use client';

import React, { useState } from 'react';

interface VaultItem {
  id: string;
  title: string;
  artist: string;
  type: string;
  category: string;
  url: string;
  thumbnail: string;
  description: string;
}

interface VaultPageClientProps {
  initialItems: VaultItem[];
  initialSearch: string;
  initialCategory: string;
  initialType: string;
}

export default function VaultPageClient({ 
  initialItems, 
  initialSearch, 
  initialCategory, 
  initialType 
}: VaultPageClientProps) {
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [type, setType] = useState(initialType);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [activeVideoTitle, setActiveVideoTitle] = useState('');

  const handleFilterChange = (newSearch: string, newCat: string, newType: string) => {
    // Navigate with new search params
    const params = new URLSearchParams();
    if (newSearch) params.set('search', newSearch);
    if (newCat && newCat !== 'all') params.set('category', newCat);
    if (newType && newType !== 'all') params.set('type', newType);
    
    window.location.href = `/vault?${params.toString()}`;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange(search, category, type);
  };

  const selectCategory = (cat: string) => {
    setCategory(cat);
    handleFilterChange(search, cat, type);
  };

  const selectType = (t: string) => {
    setType(t);
    handleFilterChange(search, category, t);
  };

  const openVideoPlayer = (url: string, title: string) => {
    setActiveVideoUrl(url);
    setActiveVideoTitle(title);
  };

  const closeVideoPlayer = () => {
    setActiveVideoUrl(null);
    setActiveVideoTitle('');
  };

  const categories = [
    { label: 'All Instruments', value: 'all' },
    { label: 'Guitar', value: 'guitar' },
    { label: 'Bass', value: 'bass' },
    { label: 'Synth / Keys', value: 'synth/keys' },
    { label: 'Drums', value: 'drums' }
  ];

  const types = [
    { label: 'All Resources', value: 'all' },
    { label: 'Charts & Tabs', value: 'TAB' },
    { label: 'Video Lessons', value: 'VIDEO' },
    { label: 'Masterclasses', value: 'MASTERCLASS' }
  ];

  return (
    <div className="space-y-8 font-sans pb-10">
      
      {/* Page Header */}
      <div className="border-b border-cyan-500/10 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest block mb-1">Resource Hub</span>
          <h1 className="text-3xl font-heading font-black uppercase tracking-wider text-slate-100">
            The Vault
          </h1>
          <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">
            Access lesson charts, tabs, video walkthroughs, and archived masterclasses
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-96">
          <input 
            type="text" 
            placeholder="Search song, instructor, topic..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-[#0b0813] border border-cyan-500/20 px-4 py-2.5 text-xs text-[#f1ecff] placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all font-mono"
          />
          <button 
            type="submit" 
            className="py-2.5 px-5 cyber-btn-cyan text-xs font-black uppercase tracking-widest cursor-pointer"
          >
            Find
          </button>
        </form>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-4 bg-[#0b0813]/60 border border-cyan-500/10 p-4 rounded-sm">
        
        {/* Type selector */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mr-2">Resource Type:</span>
          {types.map((t) => (
            <button
              key={t.value}
              onClick={() => selectType(t.value)}
              className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-sm transition-all border cursor-pointer ${
                type === t.value 
                  ? 'bg-pink-500 border-pink-500 text-white shadow-md shadow-pink-500/10' 
                  : 'bg-transparent border-cyan-500/15 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Instrument Category Selector */}
        <div className="flex flex-wrap gap-2 items-center border-t border-cyan-500/5 pt-3">
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mr-2">Instrument:</span>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => selectCategory(cat.value)}
              className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-sm transition-all border cursor-pointer ${
                category === cat.value 
                  ? 'bg-cyan-500 border-cyan-500 text-[#06040a] shadow-md shadow-cyan-500/10' 
                  : 'bg-transparent border-cyan-500/15 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>

      {/* Grid Roster of Resources */}
      {initialItems.length === 0 ? (
        <div className="p-16 border border-dashed border-cyan-500/15 text-center bg-[#0b0813]/40 rounded-sm">
          <i className="fa-solid fa-folder-open text-slate-600 text-3xl mb-4"></i>
          <p className="text-sm font-mono text-slate-500 uppercase tracking-wider">No vault items found matching your filters.</p>
          <button 
            onClick={() => { setSearch(''); setCategory('all'); setType('all'); handleFilterChange('', 'all', 'all'); }}
            className="mt-6 py-2 px-6 cyber-btn-cyan text-[10px] font-black uppercase tracking-widest"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialItems.map((item) => {
            const isVideo = item.type === 'VIDEO' || item.type === 'MASTERCLASS';
            
            return (
              <div 
                key={item.id} 
                className="cyber-card bg-[#0b0813]/85 border-cyan-500/15 overflow-hidden flex flex-col justify-between group hover:border-pink-500/30 transition-all"
              >
                {/* Thumbnail Header */}
                <div className="h-44 bg-slate-900 relative overflow-hidden shrink-0 border-b border-cyan-500/10">
                  {item.thumbnail ? (
                    <img 
                      src={item.thumbnail} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#0e0b1c] text-slate-600">
                      <i className="fa-solid fa-music text-3xl"></i>
                    </div>
                  )}
                  
                  {/* Overlay badge for type */}
                  <span className={`absolute top-3 left-3 text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5 border rounded-sm ${
                    item.type === 'TAB' 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                      : item.type === 'VIDEO'
                      ? 'bg-pink-500/10 border-pink-500/30 text-pink-400'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  }`}>
                    {item.type}
                  </span>

                  {/* Play Overlay if video */}
                  {isVideo && (
                    <button 
                      onClick={() => openVideoPlayer(item.url, item.title)}
                      className="absolute inset-0 bg-black/45 flex items-center justify-center text-white text-3xl opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                      aria-label="Play Lesson"
                    >
                      <i className="fa-solid fa-circle-play text-pink-500 glow-pulse-pink"></i>
                    </button>
                  )}
                </div>

                {/* Body Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-200">{item.title}</h3>
                    {item.artist && (
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mt-0.5">By {item.artist}</p>
                    )}
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-4 mb-6 uppercase tracking-wide">
                      {item.description}
                    </p>
                  </div>

                  {item.type === 'TAB' ? (
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-2.5 text-center cyber-btn-cyan text-[10px] font-black uppercase tracking-widest block"
                    >
                      Download PDF Charts
                    </a>
                  ) : (
                    <button 
                      onClick={() => openVideoPlayer(item.url, item.title)}
                      className="w-full py-2.5 text-center cyber-btn-pink text-[10px] font-black uppercase tracking-widest cursor-pointer"
                    >
                      Stream Video Lesson
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Video Player Modal */}
      {activeVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl bg-[#0b0813] border border-pink-500/35 p-2 shadow-2xl">
            {/* Close Button */}
            <button 
              onClick={closeVideoPlayer}
              className="absolute -top-10 right-0 py-1.5 px-3 bg-pink-500 text-white font-mono text-xs uppercase tracking-wider border border-pink-500 hover:bg-pink-600 transition-colors cursor-pointer"
            >
              Close Player [X]
            </button>
            
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 p-2.5 border-b border-cyan-500/10 mb-2">
              Streaming: {activeVideoTitle}
            </h3>

            {/* Video aspect ratio container */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={activeVideoUrl}
                title={activeVideoTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
