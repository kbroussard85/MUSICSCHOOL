'use client';

import React, { useState } from 'react';

interface GearItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  stock: number;
  hyperlink?: string;
}

interface GearAdminClientProps {
  initialItems: GearItem[];
  initialCategory: string;
}

export default function GearAdminClient({ initialItems, initialCategory }: GearAdminClientProps) {
  const [items, setItems] = useState<GearItem[]>(initialItems);
  const [category, setCategory] = useState(initialCategory);

  // Add Product Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('books');
  const [newPrice, setNewPrice] = useState('');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=400&q=80');
  const [newDescription, setNewDescription] = useState('');
  const [newStock, setNewStock] = useState('10');
  const [newHyperlink, setNewHyperlink] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Edit Mode State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editHyperlink, setEditHyperlink] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleCategoryFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCategory(value);
    window.location.href = `/gear?category=${encodeURIComponent(value)}`;
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdding) return;
    setIsAdding(true);

    try {
      const res = await fetch('/api/gear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          category: newCategory,
          price: parseFloat(newPrice),
          image: newImage,
          description: newDescription,
          stock: parseInt(newStock),
          hyperlink: newHyperlink || undefined
        })
      });

      if (res.ok) {
        const result = await res.json();
        if (result.status === 'success') {
          setItems([result.data, ...items]);
          setShowAddForm(false);
          // Reset form
          setNewName('');
          setNewCategory('books');
          setNewPrice('');
          setNewDescription('');
          setNewStock('10');
          setNewHyperlink('');
        } else {
          alert('Error adding product: ' + result.error);
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

  const startEdit = (item: GearItem) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditCategory(item.category);
    setEditPrice(item.price.toString());
    setEditImage(item.image);
    setEditDescription(item.description);
    setEditStock(item.stock.toString());
    setEditHyperlink(item.hyperlink || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleEditSubmit = async (id: string) => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      const res = await fetch('/api/gear', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          name: editName,
          category: editCategory,
          price: parseFloat(editPrice),
          image: editImage,
          description: editDescription,
          stock: parseInt(editStock),
          hyperlink: editHyperlink || undefined
        })
      });

      if (res.ok) {
        const result = await res.json();
        if (result.status === 'success') {
          setItems(items.map(item => item.id === id ? result.data : item));
          setEditingId(null);
        } else {
          alert('Error updating product: ' + result.error);
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
    if (!confirm('Are you sure you want to delete this product from the inventory?')) return;

    try {
      const res = await fetch(`/api/gear?id=${id}`, {
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
    { label: 'All Equipment', value: 'all' },
    { label: 'Instruction Books', value: 'books' },
    { label: 'Guitars', value: 'guitar' },
    { label: 'Basses', value: 'bass' },
    { label: 'Synths & Keyboards', value: 'synth/keys' },
    { label: 'Drums & Cymbals', value: 'drums' },
    { label: 'Audio Production', value: 'audio production' }
  ];

  return (
    <div className="space-y-8 font-sans pb-10">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[9px] font-black text-pink-400 uppercase tracking-widest block mb-1">Administrative Dashboard</span>
          <h1 className="text-3xl font-heading font-black uppercase tracking-wider text-slate-100">
            Pro Shop Inventory Editor
          </h1>
          <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">
            Upload, update, and manage equipment catalog, prices, and external hyperlinks
          </p>
        </div>

        {/* Filters and Add button */}
        <div className="flex items-center gap-4 self-start md:self-auto w-full md:w-auto">
          <select
            value={category}
            onChange={handleCategoryFilterChange}
            className="bg-[#121722]/50 border border-white/10 px-4 py-2.5 text-xs text-[#f1ecff] focus:outline-none focus:border-violet-400 font-mono"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="py-2.5 px-5 bg-pink-500 hover:bg-pink-600 text-white text-xs font-black uppercase tracking-widest cursor-pointer transition-colors"
          >
            {showAddForm ? 'Cancel Add' : 'Add New Product'}
          </button>
        </div>
      </div>

      {/* Add New Product Form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="stitch-card p-6 space-y-4 max-w-2xl">
          <span className="text-[9px] font-black text-pink-500 uppercase tracking-widest block mb-2">Create Product</span>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1">Product Name</label>
              <input 
                type="text" 
                required
                placeholder="Fender Stratocaster"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 px-3 py-2 text-xs text-[#f1ecff] focus:outline-none focus:border-violet-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 px-3 py-2 text-xs text-[#f1ecff] focus:outline-none focus:border-violet-400 font-mono"
              >
                {categories.filter(c => c.value !== 'all').map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1">Price ($ USD)</label>
              <input 
                type="number" 
                step="0.01"
                required
                placeholder="49.99"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 px-3 py-2 text-xs text-[#f1ecff] focus:outline-none focus:border-violet-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1">Stock Quantity</label>
              <input 
                type="number" 
                required
                placeholder="10"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 px-3 py-2 text-xs text-[#f1ecff] focus:outline-none focus:border-violet-400 font-mono"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1">Image URL</label>
              <input 
                type="text" 
                required
                placeholder="https://images.unsplash.com/..."
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 px-3 py-2 text-xs text-[#f1ecff] focus:outline-none focus:border-violet-400 font-mono"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1">Affiliate/Buy Hyperlink (Optional)</label>
              <input 
                type="text" 
                placeholder="https://sweetwater.com/..."
                value={newHyperlink}
                onChange={(e) => setNewHyperlink(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 px-3 py-2 text-xs text-[#f1ecff] focus:outline-none focus:border-violet-400 font-mono"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1">Product Description</label>
              <textarea 
                required
                rows={3}
                placeholder="Describe product features..."
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
            {isAdding ? 'Uploading...' : 'Publish Product'}
          </button>
        </form>
      )}

      {/* Grid Roster of Products */}
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
              {/* Product Image preview */}
              <div className="h-44 bg-slate-900 relative overflow-hidden shrink-0 border-b border-white/5">
                <img 
                  src={isEditing ? editImage : item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover" 
                />
                {!isEditing && (
                  <span className="absolute top-3 right-3 text-[9px] font-mono font-black text-violet-400 bg-[#0c0e14]/90 px-2 py-0.5 border border-violet-500/30">
                    ${item.price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Editing Card Form */}
              {isEditing ? (
                <div className="p-5 flex-1 flex flex-col gap-3 font-mono text-[10px]">
                  <div>
                    <label className="block text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Product Name</label>
                    <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-violet-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Price ($)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-violet-400 text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Stock</label>
                      <input 
                        type="number" 
                        value={editStock}
                        onChange={(e) => setEditStock(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-violet-400 text-center"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Category</label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-violet-400"
                    >
                      {categories.filter(c => c.value !== 'all').map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Image URL</label>
                    <input 
                      type="text" 
                      value={editImage}
                      onChange={(e) => setEditImage(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-violet-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Affiliate Hyperlink</label>
                    <input 
                      type="text" 
                      value={editHyperlink}
                      onChange={(e) => setEditHyperlink(e.target.value)}
                      placeholder="No link configured"
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
                /* Read Details & Controls View */
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block mb-1">
                      Category: {item.category} &bull; Stock: {item.stock}
                    </span>
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 line-clamp-1 mb-2">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-4 uppercase tracking-wide">
                      {item.description}
                    </p>
                    
                    {item.hyperlink && (
                      <p className="text-[9px] font-mono text-pink-400 truncate mb-4">
                        <i className="fa-solid fa-link mr-1 text-[8px]"></i>
                        Link: <a href={item.hyperlink} target="_blank" rel="noopener noreferrer" className="hover:underline">{item.hyperlink}</a>
                      </p>
                    )}
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
