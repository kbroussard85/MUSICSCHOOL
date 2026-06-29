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
}

interface CartItem {
  item: GearItem;
  quantity: number;
}

interface GearPageClientProps {
  initialItems: GearItem[];
  initialCategory: string;
}

export default function GearPageClient({ initialItems, initialCategory }: GearPageClientProps) {
  const [category, setCategory] = useState(initialCategory);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [ccNumber, setCcNumber] = useState('');
  const [ccExpiry, setCcExpiry] = useState('');
  const [ccCvv, setCcCvv] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCategory(value);
    window.location.href = `/gear?category=${encodeURIComponent(value)}`;
  };

  const addToCart = (item: GearItem) => {
    const existing = cart.find(c => c.item.id === item.id);
    if (existing) {
      if (existing.quantity >= item.stock) {
        alert('Cannot add more. Limit reached based on available stock.');
        return;
      }
      setCart(cart.map(c => c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { item, quantity: 1 }]);
    }
    setIsCartOpen(true);
  };

  const updateQuantity = (itemId: string, amount: number) => {
    const existing = cart.find(c => c.item.id === itemId);
    if (!existing) return;

    const nextQty = existing.quantity + amount;
    if (nextQty <= 0) {
      setCart(cart.filter(c => c.item.id !== itemId));
    } else if (nextQty > existing.item.stock) {
      alert('Limit reached based on available stock.');
    } else {
      setCart(cart.map(c => c.item.id === itemId ? { ...c, quantity: nextQty } : c));
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(c => c.item.id !== itemId));
  };

  const subtotal = cart.reduce((sum, c) => sum + (c.item.price * c.quantity), 0);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || isCheckingOut) return;

    setIsCheckingOut(true);
    try {
      const res = await fetch('/api/gear/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(c => ({
            id: c.item.id,
            quantity: c.quantity
          }))
        })
      });

      if (res.ok) {
        const result = await res.json();
        if (result.status === 'success') {
          setCheckoutSuccess(true);
          setCart([]);
        } else {
          alert('Checkout failed: ' + result.error);
        }
      } else {
        alert('Server communication error during checkout.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Network error during checkout.');
    } finally {
      setIsCheckingOut(false);
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
    <div className="space-y-8 font-sans pb-10 relative">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[9px] font-black text-pink-400 uppercase tracking-widest block mb-1">Academy Pro Shop</span>
          <h1 className="text-3xl font-heading font-black uppercase tracking-wider text-slate-100">
            Academy Gear Marketplace
          </h1>
          <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">
            Purchase recommended backline equipment, manuals, and instrument accessories
          </p>
        </div>

        {/* Category Dropdown and Cart Button */}
        <div className="flex items-center gap-4 self-start md:self-auto w-full md:w-auto">
          {/* Dropdown Filter */}
          <div className="flex-1 md:flex-none">
            <select
              value={category}
              onChange={handleCategoryChange}
              className="w-full md:w-56 bg-[#121722]/50 border border-white/10 px-4 py-2.5 text-xs text-[#f1ecff] focus:outline-none focus:border-violet-400 transition-all font-mono"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="py-2.5 px-5 bg-pink-500/10 border border-pink-500/35 hover:bg-pink-500/20 text-pink-400 text-xs font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer transition-all"
          >
            <i className="fa-solid fa-cart-shopping"></i>
            <span>Cart ({cart.reduce((sum, c) => sum + c.quantity, 0)})</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Marketplace Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {initialItems.map((item) => (
            <div 
              key={item.id} 
              className="stitch-card overflow-hidden flex flex-col justify-between group hover:border-violet-500/30 transition-all"
            >
              {/* Product Image */}
              <div className="h-44 bg-slate-900 relative overflow-hidden shrink-0 border-b border-white/5">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102" 
                />
                <span className="absolute top-3 right-3 text-[9px] font-mono font-black text-violet-400 bg-[#0c0e14]/90 px-2 py-0.5 border border-violet-500/30">
                  ${item.price.toFixed(2)}
                </span>
              </div>

              {/* Product details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block mb-1">
                    Category: {item.category}
                  </span>
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 line-clamp-1 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-6 uppercase tracking-wide">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 mt-auto">
                  <span className="text-[9px] font-mono text-slate-500">
                    Stock: <span className={item.stock > 3 ? 'text-slate-300' : 'text-pink-400 font-bold'}>{item.stock} left</span>
                  </span>

                  {item.stock > 0 ? (
                    <button
                      onClick={() => addToCart(item)}
                      className="py-2 px-4 border border-violet-500/30 hover:border-violet-500 text-violet-400 hover:text-white text-[9px] font-black uppercase tracking-widest cursor-pointer transition-all"
                    >
                      Add To Cart
                    </button>
                  ) : (
                    <span className="py-2 px-4 bg-slate-900 border border-slate-800 text-slate-600 text-[9px] font-black uppercase tracking-widest">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Shopping Cart Panel */}
        {isCartOpen && (
          <div className="w-full lg:w-80 stitch-card p-6 sticky top-28 self-start shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <h3 className="font-heading text-sm font-black uppercase tracking-wider text-slate-200">
                Shopping Cart
              </h3>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-slate-500 hover:text-pink-400 text-xs font-mono uppercase cursor-pointer"
              >
                Close
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 uppercase font-mono">
                Your cart is empty.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                  {cart.map((c) => (
                    <div key={c.item.id} className="text-xs flex justify-between gap-2 border-b border-white/5 pb-2">
                      <div className="flex-1">
                        <p className="font-black text-slate-200 uppercase truncate max-w-[130px]">{c.item.name}</p>
                        <p className="text-[9px] text-slate-500">${c.item.price.toFixed(2)} x {c.quantity}</p>
                      </div>
                      
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button 
                          onClick={() => updateQuantity(c.item.id, -1)}
                          className="w-5 h-5 bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-400 flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <span className="text-[10px] font-mono font-bold text-slate-300 w-4 text-center">{c.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(c.item.id, 1)}
                          className="w-5 h-5 bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-400 flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/5 pt-4 space-y-4">
                  <div className="flex justify-between font-mono text-xs uppercase font-black">
                    <span className="text-slate-400">Subtotal:</span>
                    <span className="text-violet-400">${subtotal.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full py-3 stitch-btn-violet text-xs font-black uppercase tracking-widest cursor-pointer text-center"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0c0e14] border border-pink-500/35 p-6 shadow-2xl relative">
            <button 
              onClick={() => { setIsCheckoutOpen(false); setCheckoutSuccess(false); }}
              className="absolute top-4 right-4 text-slate-500 hover:text-pink-400 text-xs font-mono uppercase cursor-pointer"
            >
              Cancel [X]
            </button>

            {checkoutSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-2xl mx-auto glow-pulse-emerald">
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <h3 className="text-lg font-heading font-black uppercase text-slate-200 tracking-wider">
                  Purchase Successful!
                </h3>
                <p className="text-[11px] text-slate-400 uppercase tracking-wide max-w-xs mx-auto">
                  Your gear order has been processed. Stocks have been updated. Bring your receipt to the front desk to claim your items.
                </p>
                <button
                  onClick={() => { setIsCheckoutOpen(false); setCheckoutSuccess(false); window.location.reload(); }}
                  className="mt-6 py-2 px-6 stitch-btn-violet text-[10px] font-black uppercase tracking-widest"
                >
                  Return to Pro Shop
                </button>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <span className="text-[9px] font-black text-pink-500 uppercase tracking-widest block mb-1">
                  Pro Shop Checkout
                </span>
                <h3 className="text-xl font-heading font-black uppercase text-slate-100 tracking-wider mb-4 border-b border-white/5 pb-2">
                  Order Summary
                </h3>

                <div className="max-h-28 overflow-y-auto space-y-2 border-b border-white/5 pb-2 pr-1 font-mono text-[10px] uppercase text-slate-400">
                  {cart.map(c => (
                    <div key={c.item.id} className="flex justify-between">
                      <span className="truncate max-w-[200px]">{c.item.name} x{c.quantity}</span>
                      <span>${(c.item.price * c.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between font-mono text-xs uppercase font-black py-2">
                  <span className="text-slate-400">Total Due:</span>
                  <span className="text-violet-400">${subtotal.toFixed(2)}</span>
                </div>

                {/* Credit Card form inputs */}
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1">Credit Card Number</label>
                    <input 
                      type="text" 
                      required
                      placeholder="4111 2222 3333 4242"
                      value={ccNumber}
                      onChange={(e) => setCcNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 px-3 py-2 text-xs text-[#f1ecff] focus:outline-none focus:border-violet-400 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1">Expiry Date</label>
                      <input 
                        type="text" 
                        required
                        placeholder="MM/YY"
                        value={ccExpiry}
                        onChange={(e) => setCcExpiry(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 px-3 py-2 text-xs text-[#f1ecff] focus:outline-none focus:border-violet-400 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1">CVV / CVC</label>
                      <input 
                        type="password" 
                        required
                        maxLength={4}
                        placeholder="***"
                        value={ccCvv}
                        onChange={(e) => setCcCvv(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 px-3 py-2 text-xs text-[#f1ecff] focus:outline-none focus:border-violet-400 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCheckingOut}
                  className="w-full mt-6 py-3 stitch-btn-violet text-xs font-black uppercase tracking-widest disabled:opacity-50 cursor-pointer text-center"
                >
                  {isCheckingOut ? 'Authorizing Payment...' : `Pay $${subtotal.toFixed(2)}`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
