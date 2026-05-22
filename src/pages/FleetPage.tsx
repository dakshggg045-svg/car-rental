import { useMemo, useState } from 'react';
import { Search, RotateCcw, SlidersHorizontal, X } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { filterVehicles } from '@/utils/filters';
import { VehicleCategory } from '@/types';
import VehicleCard from '@/components/VehicleCard';

const categories: Array<VehicleCategory | 'All'> = ['All','Economy','Compact','Sedan','SUV','Luxury','Van','Sports','Electric'];

export default function FleetPage() {
  const { state, dispatch } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { filters } = state;
  const filtered = useMemo(() => filterVehicles(state.vehicles, filters, state.reservations), [state.vehicles, filters, state.reservations]);
  const up = (u: Partial<typeof filters>) => dispatch({ type: 'SET_FILTERS', payload: u });
  const hasActive = filters.category !== 'All' || filters.priceRange[0] > 0 || filters.priceRange[1] < 25000 || filters.transmission !== 'All' || filters.fuel !== 'All' || filters.seats !== null || filters.searchQuery || filters.pickupDate || filters.returnDate;

  const inp = "w-full px-3 py-2.5 bg-[#111] border border-white/[0.08] rounded-lg text-white text-[13px] focus:border-[#d4af37]/50 focus:outline-none";

  return (
    <div className="min-h-screen pt-16 bg-[#0a0a0a]">
      {/* Sticky top search bar */}
      <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.04] sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
              <input type="text" placeholder="Search make, model, year…" value={filters.searchQuery} onChange={e => up({ searchQuery: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-white/[0.06] rounded-lg text-white text-[13px] placeholder:text-neutral-600 focus:border-[#d4af37]/50 focus:outline-none" />
            </div>

            {/* Date inputs — always visible */}
            <input type="date" value={filters.pickupDate} onChange={e => up({ pickupDate: e.target.value })} min={new Date().toISOString().split('T')[0]} placeholder="Pickup"
              className="hidden md:block w-40 px-3 py-2.5 bg-[#111] border border-white/[0.06] rounded-lg text-white text-[13px] focus:border-[#d4af37]/50 focus:outline-none" />
            <input type="date" value={filters.returnDate} onChange={e => up({ returnDate: e.target.value })} min={filters.pickupDate || new Date().toISOString().split('T')[0]}
              className="hidden md:block w-40 px-3 py-2.5 bg-[#111] border border-white/[0.06] rounded-lg text-white text-[13px] focus:border-[#d4af37]/50 focus:outline-none" />

            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                sidebarOpen ? 'bg-[#d4af37] text-black' : 'bg-[#111] text-neutral-400 border border-white/[0.06] hover:text-white'
              }`}>
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
            </button>

            {hasActive && (
              <button onClick={() => dispatch({ type: 'RESET_FILTERS' })} className="px-3 py-2.5 text-neutral-500 hover:text-white text-[13px] transition-colors">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category tabs */}
          <div className="flex gap-1.5 mt-3 overflow-x-auto scrollbar-hide">
            {categories.map(c => (
              <button key={c} onClick={() => up({ category: c })}
                className={`px-3.5 py-1.5 rounded-lg text-[12px] uppercase tracking-wide whitespace-nowrap transition-colors ${
                  filters.category === c ? 'bg-[#d4af37] text-black font-semibold' : 'text-neutral-500 hover:text-white hover:bg-white/[0.04]'
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
        <div className="flex gap-8">
          {/* Sidebar filters */}
          {sidebarOpen && (
            <aside className="hidden lg:block w-[240px] shrink-0">
              <div className="sticky top-[180px] space-y-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] uppercase tracking-widest text-neutral-500 font-semibold">Filters</span>
                  <button onClick={() => setSidebarOpen(false)} className="text-neutral-600 hover:text-white"><X className="w-3.5 h-3.5" /></button>
                </div>
                <div><label className="block text-[11px] text-neutral-500 uppercase tracking-wider mb-1.5">Transmission</label><select value={filters.transmission} onChange={e => up({ transmission: e.target.value as any })} className={inp}><option value="All">Any</option><option value="Automatic">Automatic</option><option value="Manual">Manual</option></select></div>
                <div><label className="block text-[11px] text-neutral-500 uppercase tracking-wider mb-1.5">Fuel Type</label><select value={filters.fuel} onChange={e => up({ fuel: e.target.value as any })} className={inp}><option value="All">Any</option><option value="Gasoline">Gasoline</option><option value="Diesel">Diesel</option><option value="Electric">Electric</option><option value="Hybrid">Hybrid</option></select></div>
                <div><label className="block text-[11px] text-neutral-500 uppercase tracking-wider mb-1.5">Min. Seats</label><select value={filters.seats ?? ''} onChange={e => up({ seats: e.target.value ? +e.target.value : null })} className={inp}><option value="">Any</option><option value="2">2+</option><option value="4">4+</option><option value="5">5+</option><option value="7">7+</option></select></div>
                <div>
                  <label className="block text-[11px] text-neutral-500 uppercase tracking-wider mb-2">Price: ₹{filters.priceRange[0]} – ₹{filters.priceRange[1]}/day</label>
                  <input type="range" min="0" max="25000" step="500" value={filters.priceRange[0]} onChange={e => up({ priceRange: [+e.target.value, filters.priceRange[1]] })} className="w-full mb-2" />
                  <input type="range" min="0" max="25000" step="500" value={filters.priceRange[1]} onChange={e => up({ priceRange: [filters.priceRange[0], +e.target.value] })} className="w-full" />
                </div>
                {hasActive && (
                  <button onClick={() => dispatch({ type: 'RESET_FILTERS' })} className="w-full py-2 text-[12px] text-neutral-500 border border-white/[0.06] rounded-lg hover:text-white transition-colors">
                    Clear all filters
                  </button>
                )}
              </div>
            </aside>
          )}

          {/* Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-neutral-500 text-[13px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Showing <span className="text-white font-medium">{filtered.length}</span> vehicles
              </p>
            </div>
            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-neutral-500 text-[14px] mb-4">No vehicles match your criteria.</p>
                <button onClick={() => dispatch({ type: 'RESET_FILTERS' })} className="px-5 py-2 bg-[#d4af37] text-black text-[13px] font-semibold rounded-lg">Clear filters</button>
              </div>
            ) : (
              <div className={`grid gap-x-6 gap-y-10 ${sidebarOpen ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
                {filtered.map(v => <VehicleCard key={v.id} vehicle={v} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
