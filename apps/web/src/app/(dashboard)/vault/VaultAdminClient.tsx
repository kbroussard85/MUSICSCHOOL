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

interface VaultAdminClientProps {
  initialItems: VaultItem[];
  initialSearch: string;
  initialCategory: string;
  initialType: string;
}

export default function VaultAdminClient({ 
  initialItems, 
  initialSearch, 
  initialCategory, 
  initialType 
}: VaultAdminClientProps) {
  const [items, setItems] = useState<VaultItem[]>(initialItems);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [type, setType] = useState(initialType);

  // Add Asset Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newType, setNewType] = useState('TAB');
  const [newCategory, setNewCategory] = useState('all');
  const [newUrl, setNewUrl] = useState('');
  const [newThumbnail, setNewThumbnail] = useState('https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=300&q=80');
  const [newDescription, setNewDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Edit Mode State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editArtist, setEditArtist] = useState('');
  const [editType, setEditType] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editThumbnail, setEditThumbnail] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdding) return;
    setIsAdding(true);

    try {
      const res = await fetch('/api/vault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          artist: newArtist,
          type: newType,
          category: newCategory,
          url: newUrl,
          thumbnail: newThumbnail || undefined,
          description: newDescription || undefined
        })
      });

      if (res.ok) {
        const result = await res.json();
        if (result.status === 'success') {
          setItems([result.data, ...items]);
          setShowAddForm(false);
          // Reset
          setNewTitle('');
          setNewArtist('');
          setNewType('TAB');
          setNewCategory('all');
          setNewUrl('');
          setNewDescription('');
        } else {
          alert('Error creating asset: ' + result.error);
        }
      } else {
        alert('Server communication error.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error.');
    } finally {
      setIsAdding(false);
    }
  };

  const startEdit = (item: VaultItem) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditArtist(item.artist);
    setEditType(item.type);
    setEditCategory(item.category);
    setEditUrl(item.url);
    setEditThumbnail(item.thumbnail);
    setEditDescription(item.description);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleEditSubmit = async (id: string) => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      const res = await fetch('/api/vault', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          title: editTitle,
          artist: editArtist,
          type: editType,
          category: editCategory,
          url: editUrl,
          thumbnail: editThumbnail || undefined,
          description: editDescription || undefined
        })
      });

      if (res.ok) {
        const result = await res.json();
        if (result.status === 'success') {
          setItems(items.map(item => item.id === id ? result.data : item));
          setEditingId(null);
        } else {
          alert('Error updating asset: ' + result.error);
        }
      } else {
        alert('Server returned an error.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource asset from the vault?')) return;

    try {
      const res = await fetch(`/api/vault?id=${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        const result = await res.json();
        if (result.status === 'success') {
          setItems(items.filter(item => item.id !== id));
        } else {
          alert('Delete failed: ' + result.error);
        }
      } else {
        alert('Server returned an error.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error.');
    }
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
      <div className="border-b border-white/5 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[9px] font-black text-pink-400 uppercase tracking-widest block mb-1">Administrative Dashboard</span>
          <h1 className="text-3xl font-heading font-black uppercase tracking-wider text-slate-100">
            The Vault Organizer
          </h1>
          <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">
            Upload, update, and categorize charts, tabs, sheet music, audio guides, and video lessons
          </p>
        </div>

        {/* Search & Add button */}
        <div className="flex gap-2 w-full md:w-auto items-center">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1 md:flex-none">
            <input 
              type="text" 
              placeholder="Search assets..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#121722]/50 border border-white/10 px-4 py-2 text-xs text-[#f1ecff] placeholder-slate-500 focus:outline-none focus:border-violet-400 font-mono w-full md:w-56"
            />
            <button type="submit" className="hidden" aria-label="Search" />
          </form>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="py-2 px-5 bg-pink-500 hover:bg-pink-600 text-white text-xs font-black uppercase tracking-widest cursor-pointer transition-colors"
          >
            {showAddForm ? 'Cancel Add' : 'Add Vault Asset'}
          </button>
        </div>
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

      {/* Add New Asset Form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="stitch-card p-6 space-y-4 max-w-2xl">
          <span className="text-[9px] font-black text-pink-500 uppercase tracking-widest block mb-2">Create Vault Resource</span>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1">Asset Title</label>
              <input 
                type="text" 
                required
                placeholder="Comfortably Numb Solos"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 px-3 py-2 text-xs text-[#f1ecff] focus:outline-none focus:border-violet-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1">Artist / Instructor Name</label>
              <input 
                type="text" 
                placeholder="Pink Floyd / Evelyn Pierce"
                value={newArtist}
                onChange={(e) => setNewArtist(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 px-3 py-2 text-xs text-[#f1ecff] focus:outline-none focus:border-violet-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1">Asset Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 px-3 py-2 text-xs text-[#f1ecff] focus:outline-none focus:border-violet-400 font-mono"
              >
                <option value="TAB">Charts & Tablatures</option>
                <option value="VIDEO">Video Rehearsal/Lesson</option>
                <option value="MASTERCLASS">Archived Masterclass</option>
              </select>
            </div>
            <div>
              <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1">Instrument Focus</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 px-3 py-2 text-xs text-[#f1ecff] focus:outline-none focus:border-violet-400 font-mono"
              >
                {categories.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1">Asset Resource URL (PDF Link / Video Embed Link)</label>
              <input 
                type="text" 
                required
                placeholder="https://images.unsplash.com/..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 px-3 py-2 text-xs text-[#f1ecff] focus:outline-none focus:border-violet-400 font-mono"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1">Thumbnail Preview Image URL</label>
              <input 
                type="text" 
                placeholder="https://images.unsplash.com/..."
                value={newThumbnail}
                onChange={(e) => setNewThumbnail(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 px-3 py-2 text-xs text-[#f1ecff] focus:outline-none focus:border-violet-400 font-mono"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1">Brief Description</label>
              <textarea 
                rows={2}
                placeholder="Describe sheet music details, track structures, or key indicators..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 px-3 py-2 text-xs text-[#f1ecff] focus:outline-none focus:border-violet-400 font-mono resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isAdding}
            className="py-2.5 px-6 stitch-btn-violet text-xs font-black uppercase tracking-widest cursor-pointer disabled:opacity-50"
          >
            {isAdding ? 'Uploading...' : 'Publish Asset'}
          </button>
        </form>
      )}

      {/* Grid of Vault Assets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {items.map((item) => {
          const isEditing = editingId === item.id;

          return (
            <div 
              key={item.id} 
              className={`stitch-card overflow-hidden flex flex-col justify-between group transition-all ${
                isEditing ? 'border-pink-500/50 shadow-md shadow-pink-500/5' : 'hover:border-violet-500/30'
              }`}
            >
              {/* Preview Thumbnail */}
              <div className="h-44 bg-slate-900 relative overflow-hidden shrink-0 border-b border-white/5">
                <img 
                  src={isEditing ? editThumbnail : (item.thumbnail || 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=300&q=80')} 
                  alt={item.title} 
                  className="w-full h-full object-cover" 
                />
                
                <span className={`absolute top-3 left-3 text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5 border rounded-sm bg-[#0c0e14]/90 border-violet-500/30 text-violet-400`}>
                  {isEditing ? editType : item.type}
                </span>
              </div>

              {/* Editing Area */}
              {isEditing ? (
                <div className="p-5 flex-1 flex flex-col gap-3 font-mono text-[10px]">
                  <div>
                    <label className="block text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Asset Title</label>
                    <input 
                      type="text" 
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-violet-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Artist / Instructor</label>
                    <input 
                      type="text" 
                      value={editArtist}
                      onChange={(e) => setEditArtist(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-violet-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Type</label>
                      <select
                        value={editType}
                        onChange={(e) => setEditType(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-violet-400 font-mono"
                      >
                        <option value="TAB">TAB</option>
                        <option value="VIDEO">VIDEO</option>
                        <option value="MASTERCLASS">MASTERCLASS</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Instrument</label>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-violet-400 font-mono"
                      >
                        {categories.map(c => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Resource URL</label>
                    <input 
                      type="text" 
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-violet-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Thumbnail Image URL</label>
                    <input 
                      type="text" 
                      value={editThumbnail}
                      onChange={(e) => setEditThumbnail(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-violet-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Description</label>
                    <textarea 
                      rows={2}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-violet-400 resize-none"
                    />
                  </div>

                  <div className="flex gap-2 mt-4 pt-3 border-t border-white/5">
                    <button 
                      onClick={() => handleEditSubmit(item.id)}
                      disabled={isSaving}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[9px] font-black uppercase tracking-widest cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button 
                      onClick={cancelEdit}
                      className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[9px] font-black uppercase tracking-widest cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* Read View */
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block mb-1">
                      Instrument: {item.category}
                    </span>
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 line-clamp-1 mb-2">
                      {item.title}
                    </h3>
                    {item.artist && (
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mt-0.5 mb-3">By {item.artist}</p>
                    )}
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-6 uppercase tracking-wide">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 border-t border-white/5 pt-4 mt-auto">
                    <button
                      onClick={() => startEdit(item)}
                      className="flex-1 py-2 border border-violet-500/30 hover:border-violet-500 text-violet-400 hover:text-white text-[9px] font-black uppercase tracking-widest cursor-pointer transition-colors"
                    >
                      Edit details
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="py-2 px-3 border border-pink-500/35 hover:bg-pink-500/10 text-pink-400 text-[9px] font-black uppercase tracking-widest cursor-pointer transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
