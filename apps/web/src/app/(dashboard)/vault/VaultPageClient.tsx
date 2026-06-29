'use client';

import React, { useState, useEffect } from 'react';

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

interface TabMeasure {
  number: number;
  lyrics: string;
  chords: string;
  tabs: string;
  timestampSeconds: number;
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
  
  // Splitscreen Media States
  const [activeItem, setActiveItem] = useState<VaultItem | null>(null);
  const [activeMeasureIndex, setActiveMeasureIndex] = useState(0);
  const [syncStatus, setSyncStatus] = useState('SYNCED');

  // Simulated Time-Linked Tab Scrolling
  useEffect(() => {
    if (!activeItem) return;
    const interval = setInterval(() => {
      setActiveMeasureIndex((prev) => (prev + 1) % mockMeasures.length);
    }, 4500); // Shift highlighted measure every 4.5s to simulate video progress
    return () => clearInterval(interval);
  }, [activeItem]);

  const handleFilterChange = (newSearch: string, newCat: string, newType: string) => {
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

  const openLessonWorkspace = (item: VaultItem) => {
    setActiveItem(item);
    setActiveMeasureIndex(0);
    setSyncStatus('SYNCED');
  };

  const closeLessonWorkspace = () => {
    setActiveItem(null);
  };

  const handleMeasureClick = (index: number) => {
    setActiveMeasureIndex(index);
    setSyncStatus('SEEKING');
    setTimeout(() => {
      setSyncStatus('SYNCED');
    }, 800);
  };

  // Mock time-linked tablature measures
  const mockMeasures: TabMeasure[] = [
    { number: 1, chords: "Am - F", tabs: "e|-----5---5-----8---8---| B|---5---5-----8---8---| G|-5---------9---------|", lyrics: "Intro Riff - Establishing Backline Key Groove", timestampSeconds: 0 },
    { number: 2, chords: "C - G", tabs: "e|-----3---3-----3---3---| B|---3---3-----3---3---| G|-4---------4---------|", lyrics: "Drum Entry & Bassline Sync Phase", timestampSeconds: 5 },
    { number: 3, chords: "Am - F", tabs: "e|-----5---5-----8---8---| B|---5---5-----8---8---| G|-5---------9---------|", lyrics: "Verse 1 - Under lock & key, the rehearsals align...", timestampSeconds: 10 },
    { number: 4, chords: "C - G", tabs: "e|-----3---3-----3---3---| B|---3---3-----3---3---| G|-4---------4---------|", lyrics: "We take the stage, we break the bedroom design...", timestampSeconds: 15 },
    { number: 5, chords: "F - G", tabs: "e|-----1---1-----3---3---| B|---1---1-----3---3---| G|-2---------4---------|", lyrics: "Pre-Chorus - Plug into the amplifier, turn it high...", timestampSeconds: 20 },
    { number: 6, chords: "C - G - Am", tabs: "e|-----8---8-----8---8---| B|---8---8-----10--10--| G|-9---------9---------|", lyrics: "Chorus - Anyone can play notes, but we jam to fly!", timestampSeconds: 25 },
    { number: 7, chords: "F - G - C", tabs: "e|-----1---1-----3---3---| B|---1---1-----3---3---| G|-2---------4---------|", lyrics: "Live on the stage under the dark sky...", timestampSeconds: 30 }
  ];

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
      <div className="border-b border-white/5 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[9px] font-black text-pink-400 uppercase tracking-widest block mb-1">Resource Hub</span>
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
            className="flex-1 bg-[#121722]/50 border border-white/10 px-4 py-2.5 text-xs text-[#f1ecff] placeholder-slate-500 focus:outline-none focus:border-violet-400 transition-all font-mono"
          />
          <button 
            type="submit" 
            className="py-2.5 px-5 stitch-btn-violet text-xs font-black uppercase tracking-widest cursor-pointer"
          >
            Find
          </button>
        </form>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-4 bg-[#121722]/30 border border-white/5 p-4">
        
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
                  : 'bg-transparent border-white/10 text-slate-400 hover:text-violet-400 hover:border-violet-500/30'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Instrument Category Selector */}
        <div className="flex flex-wrap gap-2 items-center border-t border-white/5 pt-3">
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mr-2">Instrument:</span>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => selectCategory(cat.value)}
              className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-sm transition-all border cursor-pointer ${
                category === cat.value 
                  ? 'bg-violet-500 border-violet-500 text-white shadow-md shadow-violet-500/10' 
                  : 'bg-transparent border-white/10 text-slate-400 hover:text-violet-400 hover:border-violet-500/30'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>

      {/* Grid Roster of Resources */}
      {initialItems.length === 0 ? (
        <div className="p-16 border border-dashed border-white/10 text-center bg-[#121722]/10">
          <i className="fa-solid fa-folder-open text-slate-600 text-3xl mb-4"></i>
          <p className="text-sm font-mono text-slate-500 uppercase tracking-wider">No vault items found matching your filters.</p>
          <button 
            onClick={() => { setSearch(''); setCategory('all'); setType('all'); handleFilterChange('', 'all', 'all'); }}
            className="mt-6 py-2 px-6 stitch-btn-violet text-[10px] font-black uppercase tracking-widest"
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
                className="stitch-card overflow-hidden flex flex-col justify-between group hover:border-violet-500/30 transition-all"
              >
                {/* Thumbnail Header */}
                <div className="h-44 bg-slate-900 relative overflow-hidden shrink-0 border-b border-white/5">
                  {item.thumbnail ? (
                    <img 
                      src={item.thumbnail} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#121722]/30 text-slate-600">
                      <i className="fa-solid fa-music text-3xl"></i>
                    </div>
                  )}
                  
                  {/* Overlay badge for type */}
                  <span className={`absolute top-3 left-3 text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5 border rounded-sm ${
                    item.type === 'TAB' 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                      : item.type === 'VIDEO'
                      ? 'bg-violet-500/10 border-violet-500/30 text-violet-400'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  }`}>
                    {item.type}
                  </span>

                  {/* Play Overlay if video */}
                  {isVideo && (
                    <button 
                      onClick={() => openLessonWorkspace(item)}
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
                      className="w-full py-2.5 text-center border border-violet-500/30 hover:border-violet-500 text-violet-400 hover:text-white text-[10px] font-black uppercase tracking-widest block transition-all"
                    >
                      Download PDF Charts
                    </a>
                  ) : (
                    <button 
                      onClick={() => openLessonWorkspace(item)}
                      className="w-full py-2.5 text-center stitch-btn-violet text-[10px] font-black uppercase tracking-widest cursor-pointer"
                    >
                      Open Lesson Workspace
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Time-Linked Splitscreen Lesson Workspace Modal (Stitch Spec 2.3) */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md">
          <div className="relative w-full h-[90vh] bg-[#0c0e14] border border-pink-500/35 flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#121722]/50">
              <div className="flex items-center gap-3">
                <span className="stitch-badge-violet text-[8px] font-black uppercase tracking-widest px-2 py-0.5">
                  DRM Workspace Active
                </span>
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-200">
                  {activeItem.title} &bull; {activeItem.artist}
                </h3>
              </div>

              <div className="flex items-center gap-4">
                <span className={`font-mono text-[9px] font-bold ${syncStatus === 'SYNCED' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse"></span>
                  TAB TIMECODE: {syncStatus}
                </span>
                <button 
                  onClick={closeLessonWorkspace}
                  className="py-1 px-3 bg-pink-600 text-white font-mono text-xs uppercase tracking-wider hover:bg-pink-700 transition-all cursor-pointer"
                >
                  Exit Workspace [X]
                </button>
              </div>
            </div>

            {/* Splitscreen Splitscreen Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
              
              {/* Left Column: Video Lesson Player */}
              <div className="flex flex-col bg-black overflow-hidden relative">
                <div className="flex-1 relative">
                  <iframe
                    src={activeItem.url}
                    title={activeItem.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  />
                </div>
                <div className="p-4 bg-slate-950 font-mono text-[10px] text-slate-400 uppercase tracking-wider border-t border-white/5">
                  <p className="text-slate-200 font-bold mb-1">Instruction Timeline Indicator</p>
                  <p>Auto-scrolling tablature triggers as playback matches measure stamps.</p>
                </div>
              </div>

              {/* Right Column: Time-Linked Tablature Component */}
              <div className="flex flex-col border-t lg:border-t-0 lg:border-l border-white/5 bg-[#0a0c10] overflow-hidden">
                {/* Title */}
                <div className="p-4 border-b border-white/5 bg-[#121722]/30 flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Interactive Tablature Scroll</span>
                  <span className="text-[9px] font-mono text-slate-500">Click measure card to seek timestamp</span>
                </div>

                {/* Scrollable list of measures */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 scroll-smooth">
                  {mockMeasures.map((measure, idx) => {
                    const isActive = idx === activeMeasureIndex;
                    return (
                      <div 
                        key={measure.number}
                        onClick={() => handleMeasureClick(idx)}
                        className={`p-4 border transition-all cursor-pointer relative ${
                          isActive 
                            ? 'bg-violet-950/20 border-violet-500/40 shadow-md shadow-violet-500/5' 
                            : 'bg-[#121722]/45 border-white/5 hover:border-white/10'
                        }`}
                      >
                        {/* active indicator banner */}
                        {isActive && (
                          <div className="absolute top-0 left-0 bottom-0 w-1 bg-violet-400"></div>
                        )}

                        <div className="flex justify-between items-center text-[10px] font-mono mb-2">
                          <span className={`font-black ${isActive ? 'text-violet-400' : 'text-slate-500'}`}>
                            MEASURE {measure.number}
                          </span>
                          <span className="text-slate-600 font-bold">
                            CHORDS: {measure.chords}
                          </span>
                        </div>

                        {/* tab notation */}
                        <pre className={`font-mono text-[10px] leading-tight p-2.5 bg-black/60 overflow-x-auto ${
                          isActive ? 'text-violet-300' : 'text-slate-500'
                        }`}>
                          {measure.tabs}
                        </pre>

                        {/* lyrics / commentary */}
                        <p className={`text-[10px] font-medium mt-2 leading-relaxed ${
                          isActive ? 'text-slate-200' : 'text-slate-500'
                        }`}>
                          {measure.lyrics}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
